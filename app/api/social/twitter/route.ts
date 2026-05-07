import { NextResponse } from "next/server";
import { getTwitterUserByUsername } from "../../../../utils/twitterApi";
import { createCacheHeaders } from "../../../../utils/social";

export async function GET(request: Request) {
  let username = "MrUnknownG786";
  try {
    const { searchParams } = new URL(request.url);
    username = searchParams.get("username") || username;

    const userData = await getTwitterUserByUsername(username);

    // Return response with cache headers
    return NextResponse.json(userData, { headers: createCacheHeaders() });
  } catch {
    // Fetch fallback data with the username
    const userData = await getTwitterUserByUsername(username);

    // Return response with cache headers
    return NextResponse.json(userData, { headers: createCacheHeaders() });
  }
}
