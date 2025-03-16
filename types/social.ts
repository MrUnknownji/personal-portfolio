export interface SocialLink {
	icon: React.ReactNode;
	label: string;
	href: string;
	bgColor: string;
	hoverBgColor: string;
	iconColor: string;
	hoverIconColor: string;
	description: string;
	color?: string;
	stats: {
		label: string;
		value: string;
	}[];
	profileImage?: string;
	username?: string;
}

export interface GitHubStats {
	username: string;
	name?: string;
	profileImage: string;
	public_repos: number;
	followers: number;
	following: number;
}

export interface LinkedInStats {
	username: string;
	name?: string;
	profileImage: string;
	connections: string;
	endorsements: number;
	posts: number;
	headline?: string;
}

export interface TwitterStats {
	username: string;
	name?: string;
	profileImage: string;
	followers: number;
	following: number;
	tweets: number;
	description?: string;
}

export interface SocialStats {
	github?: GitHubStats;
	linkedin?: LinkedInStats;
	twitter?: TwitterStats;
}
