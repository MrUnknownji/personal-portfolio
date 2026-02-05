import { NextResponse } from "next/server";
import { fetchGitHubStats } from "../../../../utils/githubApi";
import { FALLBACK_DATA, createCacheHeaders } from "../../../../utils/social";

export async function GET() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const githubPromise = fetchGitHubStats("MrUnknownji").then(
      (data) => data || FALLBACK_DATA.github,
    );

    // Fetch Twitter data from our API
    const twitterPromise = fetch(
      `${baseUrl}/api/social/twitter?username=MrUnknownG786`,
    ).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        console.log("Twitter User Data: ", data);
        return data;
      }
      return FALLBACK_DATA.twitter;
    });

    // Fetch LinkedIn data from our API
    const linkedinPromise = fetch(
      `${baseUrl}/api/social/linkedin?username=sandeep-kumar-sk1707`,
    ).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        console.log("LinkedIn User Data: ", data);
        return data;
      }
      return FALLBACK_DATA.linkedin;
    });

    const [github, twitter, linkedin] = await Promise.all([
      githubPromise,
      twitterPromise,
      linkedinPromise,
    ]);

    // Return combined data with cache headers
    return NextResponse.json(
      {
        github,
        twitter,
        linkedin,
      },
      { headers: createCacheHeaders() },
    );
  } catch (error) {
    console.error("Error fetching social stats:", error);

    // Return fallback data on error
    return NextResponse.json(FALLBACK_DATA);
  }
}
