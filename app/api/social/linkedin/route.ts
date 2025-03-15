import { NextResponse } from 'next/server';
import { fetchLinkedInProfile, hasLinkedInCredentials } from '../../../../utils/linkedinApi';
import { createCacheHeaders } from '../../../../utils/social';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'sandeep-kumar-sk1707';
    
    // Log credential status
    if (hasLinkedInCredentials()) {
      console.log('LinkedIn client credentials found');
    } else {
      console.log('LinkedIn client credentials not found, will use fallback data');
    }
    
    // Fetch LinkedIn profile data (will use fallback with the provided username)
    const profileData = await fetchLinkedInProfile(username);
    console.log(`LinkedIn data for ${username}:`, profileData);
    
    // Return response with cache headers
    return NextResponse.json(profileData, { headers: createCacheHeaders() });
  } catch (error) {
    console.error('LinkedIn API error:', error);
    
    // Get username from request URL if possible
    let username = 'sandeep-kumar-sk1707';
    try {
      const { searchParams } = new URL(request.url);
      username = searchParams.get('username') || username;
    } catch (e) {
      console.log(e);
    }
    
    // Fetch fallback data with the username
    const profileData = await fetchLinkedInProfile(username);
    
    // Return response with cache headers
    return NextResponse.json(profileData, { headers: createCacheHeaders() });
  }
} 