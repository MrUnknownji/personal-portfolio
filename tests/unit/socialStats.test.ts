import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getSocialStats } from "@/lib/server/socialStats";

describe("social stats", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns real GitHub totals and isolates unconfigured providers", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    vi.stubEnv("X_BEARER_TOKEN", "");
    vi.stubEnv("LINKEDIN_ACCESS_TOKEN", "");
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.endsWith("/users/MrUnknownji")) {
        return Response.json({
          login: "MrUnknownji",
          avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
          public_repos: 2,
          followers: 7,
        });
      }
      if (url.includes("/users/MrUnknownji/repos")) {
        return Response.json([
          { stargazers_count: 3 },
          { stargazers_count: 8 },
        ]);
      }
      return new Response(null, { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await getSocialStats();

    expect(response.profiles.github).toMatchObject({
      username: "MrUnknownji",
      status: "live",
      stats: [
        { label: "Repos", value: 2 },
        { label: "Followers", value: 7 },
        { label: "Stars", value: 11 },
      ],
    });
    expect(response.profiles.linkedin.status).toBe("unavailable");
    expect(response.profiles.twitter.status).toBe("unavailable");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
