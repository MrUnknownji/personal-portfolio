export type SocialPlatform = "github" | "linkedin" | "twitter";

export type SocialMetric = {
  label: string;
  value: number | null;
};

export type SocialProfileStats = {
  username: string | null;
  profileImage: string | null;
  stats: [SocialMetric, SocialMetric, SocialMetric];
  status: "live" | "partial" | "unavailable";
};

export type SocialStatsResponse = {
  profiles: Record<SocialPlatform, SocialProfileStats>;
  fetchedAt: string;
};
