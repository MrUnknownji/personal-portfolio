'use client';

import React from 'react';
import Link from 'next/link';

export default function LinkedInVerificationPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">LinkedIn App Verification</h1>
        
        <div className="mb-8">
          <p className="mb-4">
            This page is used to verify your LinkedIn application. If you're seeing this page, it means
            your LinkedIn application's redirect URL is correctly configured.
          </p>
          
          <div className="p-4 bg-green-100 text-green-800 rounded-md">
            <p className="font-medium">Verification Successful</p>
            <p className="mt-2">
              Your LinkedIn application has been successfully verified. You can now use the LinkedIn API
              to fetch profile data for your portfolio.
            </p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          
          <ol className="list-decimal pl-6 space-y-2">
            <li>Return to your LinkedIn Developer Console</li>
            <li>Complete the verification process by confirming this URL works</li>
            <li>Go to the Admin page to connect your LinkedIn account</li>
          </ol>
        </div>
        
        <div className="flex justify-between">
          <Link 
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Admin Page
          </Link>
          
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 