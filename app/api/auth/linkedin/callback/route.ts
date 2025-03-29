import { NextResponse } from "next/server";

// LinkedIn OAuth endpoints
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    console.log("LinkedIn callback received:", {
      code: code ? `${code.substring(0, 10)}...` : undefined,
      state,
      error,
      errorDescription,
    });

    // Check for errors from LinkedIn
    if (error) {
      console.error("LinkedIn authorization error:", error, errorDescription);
      return NextResponse.redirect(
        `${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/admin?linkedin_auth=error&error=${error}`,
      );
    }

    // Verify authorization code
    if (!code) {
      console.error("Authorization code not provided");
      return NextResponse.redirect(
        `${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/admin?linkedin_auth=error&error=no_code`,
      );
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("LinkedIn credentials not configured");
      return NextResponse.redirect(
        `${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/admin?linkedin_auth=error&error=no_credentials`,
      );
    }

    // The redirect URI must match the one used in the authorization request
    const redirectUri = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/api/auth/linkedin/callback`;

    // Exchange authorization code for access token
    const tokenResponse = await fetch(LINKEDIN_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("LinkedIn token error:", errorData);
      return NextResponse.redirect(
        `${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/admin?linkedin_auth=error&error=token_exchange`,
      );
    }

    const tokenData = await tokenResponse.json();

    // Store the access token in a secure way (this is simplified for demonstration)
    // In a real application, you would store this in a secure database or session
    const accessToken = tokenData.access_token;

    // Store the token temporarily (for demonstration purposes)
    // In production, use a secure storage method
    process.env.LINKEDIN_ACCESS_TOKEN = accessToken;

    console.log("LinkedIn access token obtained successfully");

    // Redirect back to the admin page
    return NextResponse.redirect(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/admin?linkedin_auth=success`,
    );
  } catch (error) {
    console.error("LinkedIn callback error:", error);
    return NextResponse.redirect(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/admin?linkedin_auth=error&error=unknown`,
    );
  }
}
