import { GitHubStats } from "../types/social";
import { getFallbackData } from "./social";

export async function fetchGitHubStats(
	username: string
): Promise<GitHubStats | null> {
	try {
		const token = process.env.GITHUB_TOKEN;

		if (!token) {
			console.error("GitHub token not configured");
			return getFallbackData("github", username);
		}

		const response = await fetch(`https://api.github.com/users/${username}`, {
			headers: {
				Authorization: `token ${token}`,
				Accept: "application/vnd.github.v3+json",
			},
		});

		if (!response.ok) {
			throw new Error(
				`GitHub API error: ${response.status} ${response.statusText}`
			);
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
	} catch (error) {
		console.error("Error fetching GitHub stats:", error);
		return getFallbackData("github", username);
	}
}
