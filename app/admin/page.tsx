'use client';

import React, { useEffect, useState } from 'react';
import LinkedInAuth from '../../components/LinkedInAuth';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if we just completed LinkedIn authentication
    const urlParams = new URLSearchParams(window.location.search);
    const linkedinAuth = urlParams.get('linkedin_auth');
    const errorParam = urlParams.get('error');
    
    if (linkedinAuth === 'success') {
      setIsAuthenticated(true);
      setMessage('LinkedIn authentication successful! Your profile picture and name will now be fetched from LinkedIn.');
      setError('');
    } else if (linkedinAuth === 'error') {
      setIsAuthenticated(false);
      setMessage('');
      
      // Handle different error types
      switch (errorParam) {
        case 'no_code':
          setError('Authorization code was not provided by LinkedIn.');
          break;
        case 'no_credentials':
          setError('LinkedIn client credentials are not properly configured.');
          break;
        case 'token_exchange':
          setError('Failed to exchange authorization code for access token.');
          break;
        default:
          setError(`LinkedIn authentication failed: ${errorParam || 'Unknown error'}`);
      }
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Social Media Connections</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">LinkedIn</h3>
          {isAuthenticated ? (
            <div className="p-4 bg-green-100 text-green-800 rounded-md">
              <p>{message}</p>
              <p className="mt-2">Your LinkedIn account is connected.</p>
              <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
                <p className="font-medium">LinkedIn API Limitations</p>
                <p className="mt-1">
                  Due to LinkedIn API restrictions, only your profile picture and name can be fetched automatically.
                  Other metrics like connections, endorsements, and posts will use the fallback data you&apos;ve provided.
                </p>
                <p className="mt-2">
                  LinkedIn has significantly restricted their API access over the years and no longer provides
                  these metrics through their standard API.
                </p>
              </div>
              <p className="mt-4 text-sm">
                <strong>Note:</strong> The access token is temporarily stored and will be lost when the server restarts.
                In a production environment, you would store this token securely.
              </p>
            </div>
          ) : (
            <div>
              {error && (
                <div className="p-4 bg-red-100 text-red-800 rounded-md mb-4">
                  <p className="font-medium">Authentication Error</p>
                  <p>{error}</p>
                </div>
              )}
              <p className="mb-4">
                Connect your LinkedIn account to display your real profile picture and name on your portfolio.
              </p>
              <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md mb-4 text-sm">
                <p className="font-medium">LinkedIn API Limitations</p>
                <p>
                  Due to LinkedIn API restrictions, only your profile picture and name can be fetched automatically.
                  Other metrics like connections, endorsements, and posts will use the fallback data you&apos;ve provided.
                </p>
              </div>
              <LinkedInAuth />
              <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-md">
                <p className="font-medium">LinkedIn App Verification</p>
                <p className="mt-1">
                  Your LinkedIn application needs to be verified and authorized before you can use OAuth.
                  Follow these steps:
                </p>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  <li>Go to the <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn Developer Console</a></li>
                  <li>Select your application</li>
                  <li>Go to the &quot;Auth&quot; tab and add <code className="bg-blue-100 px-1 py-0.5 rounded">http://localhost:3000/api/auth/linkedin/callback</code> as a redirect URL</li>
                  <li>Complete the verification process</li>
                  <li>Go to the &quot;Products&quot; tab and request access to &quot;Sign In with LinkedIn&quot;</li>
                  <li>Wait for LinkedIn to approve your application</li>
                </ol>
                <p className="mt-2">
                  Until this process is complete, your portfolio will use fallback LinkedIn data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
} 