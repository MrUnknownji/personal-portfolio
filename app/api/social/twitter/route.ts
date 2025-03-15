import { NextResponse } from 'next/server';
import { getTwitterUserByUsername } from '../../../../utils/twitterApi';
import { createCacheHeaders } from '../../../../utils/social';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'MrUnknownG786';
    
    const userData = await getTwitterUserByUsername(username);
    console.log(`Twitter data for ${username}:`, userData);
    
    // Return response with cache headers
    return NextResponse.json(userData, { headers: createCacheHeaders() });
  } catch (error) {
    console.error('Twitter API error:', error);
    
    // Get username from request URL if possible
    let username = 'MrUnknownG786';
    try {
      const { searchParams } = new URL(request.url);
      username = searchParams.get('username') || username;
    } catch (e) {
      // Ignore URL parsing errors
    }
    
    // Fetch fallback data with the username
    const userData = await getTwitterUserByUsername(username);
    
    // Return response with cache headers
    return NextResponse.json(userData, { headers: createCacheHeaders() });
  }
} 