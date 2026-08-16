"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { SOCIAL_PROFILES } from "@/data/social";
import type {
  SocialPlatform,
  SocialProfileStats,
  SocialStatsResponse,
} from "@/types/social";
import SocialInfoBox, { type SocialInfoLink } from "./SocialInfoBox";

const PROFILE_IMAGE =
  "https://res.cloudinary.com/dfwgprzxo/image/upload/c_fill,g_face,w_104,h_104,q_auto,f_auto/v1767790586/sandeep_bgqjpb.png";

const baseLinks = [
  {
    platform: "github",
    href: SOCIAL_PROFILES.github.href,
    label: "GitHub",
    username: SOCIAL_PROFILES.github.username,
    description: "Check out my open source projects",
    color: "#ff9233",
    profileImage: PROFILE_IMAGE,
    stats: [
      { label: "Repos", value: "—" },
      { label: "Followers", value: "—" },
      { label: "Stars", value: "—" },
    ],
    icon: FiGithub,
  },
  {
    platform: "linkedin",
    href: SOCIAL_PROFILES.linkedin.href,
    label: "LinkedIn",
    username: "Sandeep Kumar",
    description: "Connect with me professionally",
    color: "#ff9233",
    profileImage: PROFILE_IMAGE,
    stats: [
      { label: "Connections", value: "—" },
      { label: "Posts", value: "—" },
      { label: "Impressions", value: "—" },
    ],
    icon: FiLinkedin,
  },
  {
    platform: "twitter",
    href: SOCIAL_PROFILES.twitter.href,
    label: "X",
    username: `@${SOCIAL_PROFILES.twitter.username}`,
    description: "Tech insights and updates",
    color: "#ff9233",
    profileImage: PROFILE_IMAGE,
    stats: [
      { label: "Followers", value: "—" },
      { label: "Posts", value: "—" },
      { label: "Following", value: "—" },
    ],
    icon: FaXTwitter,
  },
] as const satisfies ReadonlyArray<
  SocialInfoLink & {
    platform: SocialPlatform;
    href: string;
    icon: typeof FiGithub;
  }
>;

let cachedSocialStats: SocialStatsResponse | null = null;
let socialStatsRequest: Promise<SocialStatsResponse> | null = null;

function requestSocialStats() {
  if (cachedSocialStats) return Promise.resolve(cachedSocialStats);
  socialStatsRequest ??= fetch("/api/social/stats")
    .then((response) => {
      if (!response.ok) throw new Error("Could not load social metrics");
      return response.json() as Promise<SocialStatsResponse>;
    })
    .then((response) => {
      cachedSocialStats = response;
      return response;
    })
    .finally(() => {
      socialStatsRequest = null;
    });
  return socialStatsRequest;
}

function formatMetric(value: number | null) {
  if (value === null) return "—";
  if (value < 1_000) return new Intl.NumberFormat("en-US").format(value);
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function withLiveProfile<T extends (typeof baseLinks)[number]>(
  link: T,
  profile: SocialProfileStats | undefined,
): T {
  if (!profile) return link;

  return {
    ...link,
    username: profile.username || link.username,
    profileImage: profile.profileImage || link.profileImage,
    stats: profile.stats.map((metric) => ({
      label: metric.label,
      value: formatMetric(metric.value),
    })),
  } as T;
}

type Position = { x: number; top: number; bottom: number };

export default function SocialLinks() {
  const [socialStats, setSocialStats] = useState<SocialStatsResponse | null>(
    cachedSocialStats,
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, top: 0, bottom: 0 });
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRequestedStatsRef = useRef(Boolean(cachedSocialStats));
  const mountedRef = useRef(true);

  const loadSocialStats = useCallback(() => {
    if (hasRequestedStatsRef.current) return;
    hasRequestedStatsRef.current = true;
    void requestSocialStats()
      .then((response) => {
        if (mountedRef.current) setSocialStats(response);
      })
      .catch(() => {
        // Keep unavailable metrics as dashes if the local API itself is down.
      });
  }, []);

  const links = useMemo(
    () =>
      baseLinks.map((link) =>
        withLiveProfile(link, socialStats?.profiles[link.platform]),
      ),
    [socialStats],
  );

  const showCard = useCallback((element: HTMLAnchorElement, index: number) => {
    loadSocialStats();
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    const rect = element.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      top: rect.top,
      bottom: rect.bottom,
    });
    setActiveIndex(index);
    setCardVisible(true);
  }, [loadSocialStats]);

  const hideCard = useCallback(() => {
    setCardVisible(false);
    hideTimeoutRef.current = setTimeout(() => {
      setActiveIndex(null);
      hideTimeoutRef.current = null;
    }, 180);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const closeCard = () => {
      setCardVisible(false);
      setActiveIndex(null);
    };
    window.addEventListener("scroll", closeCard, { passive: true });
    window.addEventListener("resize", closeCard);
    return () => {
      mountedRef.current = false;
      window.removeEventListener("scroll", closeCard);
      window.removeEventListener("resize", closeCard);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const activeLink = activeIndex === null ? null : links[activeIndex];

  return (
    <>
      <nav aria-label="Social profiles" className="flex items-center gap-3">
        {links.map(({ href, label, description, color, icon: Icon }, index) => {
          const isActive = activeIndex === index;
          return (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${label}: ${description}`}
              onPointerEnter={(event) => showCard(event.currentTarget, index)}
              onPointerLeave={hideCard}
              onFocus={(event) => showCard(event.currentTarget, index)}
              onBlur={hideCard}
              className="group relative z-10 flex size-12 items-center justify-center rounded-xl border bg-[#111] transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
              style={{ borderColor: isActive ? color : "rgba(255,255,255,0.1)" }}
            >
              <Icon
                className="size-5 text-muted-foreground transition-[transform,color] duration-150 group-hover:scale-105"
                style={{ color: isActive ? color : undefined }}
                aria-hidden="true"
              />
            </a>
          );
        })}
      </nav>

      {activeLink && (
        <SocialInfoBox
          socialLink={activeLink}
          position={position}
          visible={cardVisible}
        />
      )}
    </>
  );
}
