import { LinkedInStats } from "../types/social";
import { getFallbackData } from "./social";

// LinkedIn API endpoints - OpenID Connect userinfo endpoint
const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";

export async function fetchLinkedInProfile(
	username: string
): Promise<LinkedInStats> {
	try {
		// Check if we have an access token
		const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

		if (!accessToken) {
			console.log("LinkedIn access token not available, using fallback data");
			return getFallbackData("linkedin", username);
		}

		console.log("LinkedIn access token found, attempting to fetch real data");

		// Fetch user info using OpenID Connect endpoint
		const profileResponse = await fetch(LINKEDIN_USERINFO_URL, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!profileResponse.ok) {
			console.error(
				"LinkedIn API profile error:",
				await profileResponse.text()
			);
			return getFallbackData("linkedin", username);
		}

		const profileData = await profileResponse.json();
		console.log("LinkedIn profile data:", profileData);

		// Get fallback data to use for fields not available via API
		const fallback = getFallbackData("linkedin", username);

		// LinkedIn API doesn't provide connection count, endorsements, or post count
		// We'll use real data for what we can get and fallback data for the rest
		return {
			username,
			name: profileData.name || fallback.name,
			profileImage: profileData.picture || fallback.profileImage,
			connections: fallback.connections,
			endorsements: fallback.endorsements,
			posts: fallback.posts,
			headline:
				profileData.headline ||
				(profileData.given_name && profileData.family_name
					? `${profileData.given_name} ${profileData.family_name} | LinkedIn`
					: fallback.headline),
		};
	} catch (error) {
		console.error("LinkedIn API error:", error);
		return getFallbackData("linkedin", username);
	}
}

// Helper function to check if LinkedIn credentials are available
export function hasLinkedInCredentials(): boolean {
	return !!(
		process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
	);
}
