import { GitHubStats, LinkedInStats, TwitterStats, SocialStats } from '../types/social';

// Centralized fallback data for all social platforms
export const FALLBACK_DATA: SocialStats = {
  github: {
    username: 'MrUnknownji',
    name: 'Sandeep Kumar',
    profileImage: '/images/github-profile.jpg',
    public_repos: 20,
    followers: 100,
    following: 50,
  },
  linkedin: {
    username: 'sandeep-kumar-sk1707',
    name: 'Sandeep Kumar',
    profileImage: '/images/linkedin-profile.jpg',
    connections: '500+',
    endorsements: 0,
    posts: 1,
    headline: 'Software Developer | Web Developer'
  },
  twitter: {
    username: 'MrUnknownG786',
    name: 'Sandeep Kumar',
    profileImage: '/images/twitter-profile.jpg',
    followers: 25,
    following: 30,
    tweets: 50,
    description: 'Software Developer | Web Developer'
  }
};

// Helper function to get fallback data for a specific platform with custom username
export function getFallbackData<T extends keyof SocialStats>(
  platform: T, 
  username?: string
): NonNullable<SocialStats[T]> {
  const data = FALLBACK_DATA[platform];
  
  if (!data) {
    throw new Error(`No fallback data available for platform: ${platform}`);
  }
  
  if (username) {
    return {
      ...data,
      username
    } as NonNullable<SocialStats[T]>;
  }
  
  return data as NonNullable<SocialStats[T]>;
}

// Cache duration in seconds (1 hour)
export const CACHE_DURATION = 60 * 60;

// Helper function to create cache headers
export function createCacheHeaders(): Headers {
  const headers = new Headers();
  headers.set('Cache-Control', `s-maxage=${CACHE_DURATION}, stale-while-revalidate`);
  return headers;
}

// In-memory cache
let cachedStats: SocialStats | null = null;
let lastFetchTime = 0;

export async function fetchSocialStats(): Promise<SocialStats> {
  const currentTime = Date.now();
  
  // Return cached data if it's still fresh
  if (cachedStats && (currentTime - lastFetchTime < CACHE_DURATION)) {
    return cachedStats;
  }
  
  try {
    const response = await fetch('/api/social/stats');
    
    if (!response.ok) {
      throw new Error('Failed to fetch social stats');
    }
    
    const data = await response.json();
    
    // Update cache
    cachedStats = {
      github: data.github || FALLBACK_DATA.github,
      linkedin: data.linkedin || FALLBACK_DATA.linkedin,
      twitter: data.twitter || FALLBACK_DATA.twitter,
    };
    
    lastFetchTime = currentTime;
    
    return cachedStats;
  } catch (error) {
    console.error('Error fetching social stats:', error);
    
    // Return last cached data if available, otherwise fallback data
    return cachedStats || FALLBACK_DATA;
  }
} 