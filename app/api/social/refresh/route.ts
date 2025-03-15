import { NextResponse } from 'next/server';
import { fetchGitHubStats } from '../../../../utils/githubApi';
import { getTwitterUserByUsername } from '../../../../utils/twitterApi';
import { fetchLinkedInProfile } from '../../../../utils/linkedinApi';

export async function GET() {
  try {
    // Force refresh all social media data
    const githubPromise = fetchGitHubStats('MrUnknownji');
    const twitterPromise = getTwitterUserByUsername('MrUnknownG786');
    const linkedinPromise = fetchLinkedInProfile('mrunknowng786');
    
    // Wait for all promises to resolve
    const [github, twitter, linkedin] = await Promise.all([
      githubPromise,
      twitterPromise,
      linkedinPromise
    ]);
    
    // Return the refreshed data
    return NextResponse.json({
      success: true,
      message: 'Social media stats refreshed successfully',
      data: {
        github,
        twitter,
        linkedin
      }
    });
  } catch (error) {
    console.error('Error refreshing social stats:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to refresh social media stats',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 