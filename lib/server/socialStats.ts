import "server-only";

import { SOCIAL_PROFILES } from "@/data/social";
import type {
  SocialMetric,
  SocialProfileStats,
  SocialStatsResponse,
} from "@/types/social";

/**
 * Credentials used by these server-only fetches (keep every value in `.env`):
 * - GITHUB_TOKEN: optional fine-grained token; raises GitHub's public REST rate limit.
 * - X_BEARER_TOKEN: required for X user lookup and public metrics.
 * - LINKEDIN_ACCESS_TOKEN: required member OAuth token.
 * - LINKEDIN_PERSON_ID: optional when the token can call `/v2/me`; otherwise set it
 *   to the authenticated member's Person ID.
 * - LINKEDIN_API_VERSION: optional YYYYMM override for LinkedIn's versioned APIs.
 *
 * Obtaining a LinkedIn access token also needs LINKEDIN_CLIENT_ID and
 * LINKEDIN_CLIENT_SECRET in your OAuth flow (this read-only fetcher deliberately
 * does not issue or refresh tokens). LinkedIn profile/metrics require the OAuth
 * scopes `openid`, `profile`, `r_1st_connections_size`, `r_member_social`, and
 * `r_member_postAnalytics`; the last three also require partner approval.
 */

const REVALIDATE_SECONDS = 60 * 60;
const LINKEDIN_API_VERSION =
  process.env.LINKEDIN_API_VERSION?.trim() || "202605";

type GitHubUser = {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
};

type GitHubRepo = {
  stargazers_count: number;
};

type XUserResponse = {
  data?: {
    username?: string;
    profile_image_url?: string;
    public_metrics?: {
      followers_count?: number;
      following_count?: number;
      tweet_count?: number;
    };
  };
};

type LinkedInProfile = {
  id?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};

type LinkedInConnections = {
  firstDegreeSize?: number;
};

type LinkedInCollection<T> = {
  elements?: T[];
  paging?: {
    total?: number;
    links?: Array<{ rel?: string; href?: string }>;
  };
};

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

async function fetchJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Social API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function profileStatus(metrics: SocialMetric[]): SocialProfileStats["status"] {
  const availableCount = metrics.filter((metric) => metric.value !== null).length;
  if (availableCount === metrics.length) return "live";
  if (availableCount > 0) return "partial";
  return "unavailable";
}

function createUnavailableProfile(
  labels: [string, string, string],
): SocialProfileStats {
  return {
    username: null,
    profileImage: null,
    stats: labels.map((label) => ({ label, value: null })) as [
      SocialMetric,
      SocialMetric,
      SocialMetric,
    ],
    status: "unavailable",
  };
}

async function fetchGitHubStats(): Promise<SocialProfileStats> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const username = SOCIAL_PROFILES.github.username;
  const user = await fetchJson<GitHubUser>(
    `https://api.github.com/users/${encodeURIComponent(username)}`,
    { headers },
  );
  const pageCount = Math.max(1, Math.ceil(user.public_repos / 100));
  const repoPages = await Promise.all(
    Array.from({ length: pageCount }, (_, index) =>
      fetchJson<GitHubRepo[]>(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=updated&per_page=100&page=${index + 1}`,
        { headers },
      ),
    ),
  );
  const stars = repoPages
    .flat()
    .reduce((total, repo) => total + (repo.stargazers_count || 0), 0);
  const stats: SocialProfileStats["stats"] = [
    { label: "Repos", value: user.public_repos },
    { label: "Followers", value: user.followers },
    { label: "Stars", value: stars },
  ];

  return {
    username: user.login,
    profileImage: user.avatar_url,
    stats,
    status: "live",
  };
}

async function fetchXStats(): Promise<SocialProfileStats> {
  const token = process.env.X_BEARER_TOKEN?.trim();
  if (!token) throw new Error("X_BEARER_TOKEN is not configured");

  const username = SOCIAL_PROFILES.twitter.username;
  const response = await fetchJson<XUserResponse>(
    `https://api.x.com/2/users/by/username/${encodeURIComponent(username)}?user.fields=profile_image_url,public_metrics`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const metrics = response.data?.public_metrics;
  if (!response.data || !metrics) throw new Error("X returned no public metrics");

  const stats: SocialProfileStats["stats"] = [
    {
      label: "Followers",
      value: isNumber(metrics.followers_count) ? metrics.followers_count : null,
    },
    {
      label: "Posts",
      value: isNumber(metrics.tweet_count) ? metrics.tweet_count : null,
    },
    {
      label: "Following",
      value: isNumber(metrics.following_count) ? metrics.following_count : null,
    },
  ];

  return {
    username: response.data.username ? `@${response.data.username}` : null,
    profileImage: response.data.profile_image_url || null,
    stats,
    status: profileStatus(stats),
  };
}

function linkedInHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "LinkedIn-Version": LINKEDIN_API_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
  };
}

async function fetchLinkedInPersonId(
  headers: HeadersInit,
): Promise<string | null> {
  const configuredId = process.env.LINKEDIN_PERSON_ID?.trim();
  if (configuredId) return configuredId;

  try {
    const profile = await fetchJson<LinkedInProfile>(
      "https://api.linkedin.com/v2/me?projection=(id)",
      { headers },
    );
    return profile.id || null;
  } catch {
    return null;
  }
}

async function fetchLinkedInPostCount(
  personId: string,
  headers: HeadersInit,
): Promise<number | null> {
  const author = encodeURIComponent(`urn:li:person:${personId}`);
  let start = 0;
  let total = 0;

  // Personal profiles normally fit in one page. The cap prevents an accidental
  // unbounded request chain if LinkedIn returns malformed pagination metadata.
  for (let page = 0; page < 20; page += 1) {
    const response = await fetchJson<LinkedInCollection<unknown>>(
      `https://api.linkedin.com/rest/posts?author=${author}&q=author&viewContext=AUTHOR&sortBy=CREATED&start=${start}&count=100`,
      { headers },
    );
    const count = response.elements?.length ?? 0;
    total += count;

    if (isNumber(response.paging?.total)) return response.paging.total;
    const hasNextLink = response.paging?.links?.some(
      (link) => link.rel === "next",
    );
    if (count < 100 && !hasNextLink) return total;
    start += count || 100;
  }

  return total;
}

async function fetchLinkedInStats(): Promise<SocialProfileStats> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("LINKEDIN_ACCESS_TOKEN is not configured");

  const headers = linkedInHeaders(token);
  const [profileResult, personId] = await Promise.all([
    fetchJson<LinkedInProfile>("https://api.linkedin.com/v2/userinfo", {
      headers,
    }).catch(() => null),
    fetchLinkedInPersonId(headers),
  ]);

  const [connectionsResult, postsResult, impressionsResult] = personId
    ? await Promise.allSettled([
        fetchJson<LinkedInConnections>(
          `https://api.linkedin.com/v2/connections/urn:li:person:${encodeURIComponent(personId)}`,
          { headers },
        ),
        fetchLinkedInPostCount(personId, headers),
        fetchJson<LinkedInCollection<{ count?: number }>>(
          "https://api.linkedin.com/rest/memberCreatorPostAnalytics?q=me&queryType=IMPRESSION&aggregation=TOTAL",
          { headers },
        ),
      ])
    : [null, null, null];

  const connections =
    connectionsResult?.status === "fulfilled" &&
    isNumber(connectionsResult.value.firstDegreeSize)
      ? connectionsResult.value.firstDegreeSize
      : null;
  const posts =
    postsResult?.status === "fulfilled" && isNumber(postsResult.value)
      ? postsResult.value
      : null;
  const impressions =
    impressionsResult?.status === "fulfilled"
      ? (impressionsResult.value.elements || []).reduce(
          (total, item) => total + (isNumber(item.count) ? item.count : 0),
          0,
        )
      : null;
  const stats: SocialProfileStats["stats"] = [
    { label: "Connections", value: connections },
    { label: "Posts", value: posts },
    { label: "Impressions", value: impressions },
  ];
  const profileName =
    profileResult?.name ||
    [profileResult?.given_name, profileResult?.family_name]
      .filter(Boolean)
      .join(" ") ||
    null;

  return {
    username: profileName,
    profileImage: profileResult?.picture || null,
    stats,
    status: profileStatus(stats),
  };
}

async function settledProfile(
  fetcher: () => Promise<SocialProfileStats>,
  labels: [string, string, string],
): Promise<SocialProfileStats> {
  try {
    return await fetcher();
  } catch {
    return createUnavailableProfile(labels);
  }
}

export async function getSocialStats(): Promise<SocialStatsResponse> {
  const [github, linkedin, twitter] = await Promise.all([
    settledProfile(fetchGitHubStats, ["Repos", "Followers", "Stars"]),
    settledProfile(fetchLinkedInStats, [
      "Connections",
      "Posts",
      "Impressions",
    ]),
    settledProfile(fetchXStats, ["Followers", "Posts", "Following"]),
  ]);

  return {
    profiles: { github, linkedin, twitter },
    fetchedAt: new Date().toISOString(),
  };
}
