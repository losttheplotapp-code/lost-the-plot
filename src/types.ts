export interface PostComment {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  timeAgo: string;
  likes?: number;
  parentId?: string | null;
  replyTo?: string | null;
  createdAt?: number;
}

export interface PlotPost {
  id: string;
  movieTitle: string;
  year: string;
  posterColor: string;
  plotHole: string;
  rewrite: string;
  author: string;
  authorAvatar: string;
  sobRating: number;
  sobRatingCount: number;
  userSobRating: number | null;
  votes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  timeAgo: string;
  createdAt: number;
  isBoosted?: boolean;
  tags: string[];
  comments?: PostComment[];
}

export interface Pitch {
  id: string;
  title: string;
  concept: string;
  author: string;
  authorAvatar: string;
  votes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  timeAgo: string;
  isBoosted?: boolean;
  tags: string[];
  comments?: PostComment[];
  artwork?: string | null;
}

export interface WeeklyPrompt {
  id: string;
  movie: string;
  prompt: string;
  description: string;
  endsAt: number;
  submissions?: PlotPost[];
  winnerId?: string | null;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  author: string;
  authorAvatar: string;
  points: number;
  wins: number;
  entries: number;
  badge: string;
}

export interface UserProfile {
  displayName: string;
  avatar: string;
  title: string;
  level: number;
  totalSubmissions: number;
  totalUpvotes: number;
  contestsWon: number;
  cinemaShelf: string[];
}

export type TabId = 'feed' | 'pitch' | 'challenges' | 'profile';

export interface ModerationFlag {
  id: string;
  postId: string;
  postType: 'Feed' | 'Pitch' | 'Challenge';
  reason: string;
  userContext: string;
  flaggedTextSnippet: string;
  timestamp: number;
}
