import { NextResponse } from 'next/server';
import crypto from 'crypto';

// LinkedIn OAuth endpoints
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';

export async function GET() {
  try {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    
    if (!clientId) {
      return NextResponse.json({ error: 'LinkedIn client ID not configured' }, { status: 500 });
    }
    
    // The redirect URI must be registered in your LinkedIn Developer Console
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/linkedin/callback`;
    
    // Generate a secure state value to prevent CSRF attacks
    const state = crypto.randomBytes(16).toString('hex');
    
    // Create the authorization URL
    const authUrl = new URL(LINKEDIN_AUTH_URL);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    
    // Use the correct scope for Sign In with LinkedIn using OpenID Connect
    // Only request scopes that your application is authorized to use
    authUrl.searchParams.append('scope', 'openid profile');
    
    authUrl.searchParams.append('state', state);
    
    console.log('Redirecting to LinkedIn authorization URL:', authUrl.toString());
    
    // Redirect to LinkedIn authorization page
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('LinkedIn auth error:', error);
    return NextResponse.json({ error: 'Failed to initiate LinkedIn authentication' }, { status: 500 });
  }
} 