import { NextResponse } from 'next/server';
import { fetchGitHubStats } from '../../../../utils/githubApi';
import { FALLBACK_DATA, createCacheHeaders } from '../../../../utils/social';

export async function GET() {
  try {
    // Fetch GitHub data directly
    const github = await fetchGitHubStats('MrUnknownji') || FALLBACK_DATA.github;
    
    // Fetch Twitter data from our API
    const twitterRes = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/social/twitter?username=MrUnknownG786`);
    let twitter = FALLBACK_DATA.twitter;
    
    if (twitterRes.ok) {
      twitter = await twitterRes.json();
      console.log("Twitter User Data: ", twitter);
    }
    
    // Fetch LinkedIn data from our API
    const linkedinRes = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/social/linkedin?username=sandeep-kumar-sk1707`);
    let linkedin = FALLBACK_DATA.linkedin;
    
    if (linkedinRes.ok) {
      linkedin = await linkedinRes.json();
      console.log("LinkedIn User Data: ", linkedin);
    }
    
    // Return combined data with cache headers
    return NextResponse.json({
      github,
      twitter,
      linkedin,
    }, { headers: createCacheHeaders() });
  } catch (error) {
    console.error('Error fetching social stats:', error);
    
    // Return fallback data on error
    return NextResponse.json(FALLBACK_DATA);
  }
} 