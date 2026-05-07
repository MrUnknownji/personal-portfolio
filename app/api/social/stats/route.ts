import { NextResponse } from "next/server";
import { fetchGitHubStats } from "../../../../utils/githubApi";
import { FALLBACK_DATA, createCacheHeaders } from "../../../../utils/social";
import { getTwitterUserByUsername } from "../../../../utils/twitterApi";

export async function GET() {
  try {
    const [github, twitter] = await Promise.all([
      fetchGitHubStats("MrUnknownji"),
      getTwitterUserByUsername("MrUnknownG786"),
    ]);

    // Return combined data with cache headers
    return NextResponse.json(
      {
        github: github || FALLBACK_DATA.github,
        twitter: twitter || FALLBACK_DATA.twitter,
        linkedin: FALLBACK_DATA.linkedin,
      },
      { headers: createCacheHeaders() },
    );
  } catch {
    // Return fallback data on error
    return NextResponse.json(FALLBACK_DATA, {
      headers: createCacheHeaders(),
    });
  }
}
