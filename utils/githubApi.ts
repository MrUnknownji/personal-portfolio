import { GitHubStats } from "../types/social";
import { getFallbackData } from "./social";

export async function fetchGitHubStats(
  username: string,
): Promise<GitHubStats | null> {
  try {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return getFallbackData("github", username);
    }

    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      return getFallbackData("github", username);
    }

    const data = await response.json();

    return {
      username: data.login,
      name: data.name,
      profileImage: data.avatar_url,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
    };
  } catch {
    return getFallbackData("github", username);
  }
}
