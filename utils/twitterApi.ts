import { TwitterStats } from "../types/social";
import { getFallbackData } from "./social";

export async function getTwitterUserByUsername(
	username: string
): Promise<TwitterStats | null> {
	try {
		const bearerToken = process.env.TWITTER_BEARER_TOKEN;

		if (!bearerToken) {
			console.error("Twitter API bearer token is not configured");
			return getFallbackData("twitter", username);
		}

		// Twitter API v2 endpoint for user lookup by username
		const url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url,description,public_metrics`;

		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${bearerToken}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(
				`Twitter API error: ${response.status} ${response.statusText}`
			);
		}

		const data = await response.json();

		if (!data.data) {
			return getFallbackData("twitter", username);
		}

		// Map Twitter API response to TwitterStats format
		return {
			username: data.data.username,
			name: data.data.name,
			profileImage: data.data.profile_image_url?.replace("_normal", "") || "",
			followers: data.data.public_metrics?.followers_count || 0,
			following: data.data.public_metrics?.following_count || 0,
			tweets: data.data.public_metrics?.tweet_count || 0,
			description: data.data.description,
		};
	} catch (error) {
		console.error("Error fetching Twitter user data:", error);
		return getFallbackData("twitter", username);
	}
}
