import { supabase } from './supabase';
import type { PlotPost, PostComment } from '../types';

interface PostRow {
  id: string;
  movie_title: string;
  year: string;
  poster_color: string;
  plot_hole: string;
  rewrite: string;
  author: string;
  author_avatar: string;
  sob_rating: number;
  sob_rating_count: number;
  user_sob_rating: number | null;
  votes: number;
  downvotes: number;
  user_vote: 'up' | 'down' | null;
  time_ago: string;
  created_at: number;
  is_boosted: boolean;
  tags: string[];
  comments: PostComment[];
}

function rowToPost(row: PostRow): PlotPost {
  return {
    id: row.id,
    movieTitle: row.movie_title,
    year: row.year,
    posterColor: row.poster_color,
    plotHole: row.plot_hole,
    rewrite: row.rewrite,
    author: row.author,
    authorAvatar: row.author_avatar,
    sobRating: Number(row.sob_rating),
    sobRatingCount: row.sob_rating_count,
    userSobRating: row.user_sob_rating,
    votes: row.votes,
    userVote: row.user_vote,
    downvotes: row.downvotes ?? 0,
    timeAgo: row.time_ago,
    createdAt: row.created_at,
    isBoosted: row.is_boosted,
    tags: row.tags,
    comments: row.comments ?? [],
  };
}

function postToRow(post: PlotPost): Omit<PostRow, 'created_at' | 'is_boosted'> {
  return {
    id: post.id,
    movie_title: post.movieTitle,
    year: post.year,
    poster_color: post.posterColor,
    plot_hole: post.plotHole,
    rewrite: post.rewrite,
    author: post.author,
    author_avatar: post.authorAvatar,
    sob_rating: post.sobRating,
    sob_rating_count: post.sobRatingCount,
    user_sob_rating: post.userSobRating,
    votes: post.votes,
    downvotes: post.downvotes,
    user_vote: post.userVote,
    time_ago: post.timeAgo,
    tags: post.tags,
    comments: post.comments ?? [],
  };
}

export async function fetchPosts(): Promise<PlotPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as PostRow[]).map(rowToPost);
}

export async function insertPost(post: PlotPost): Promise<void> {
  const row = postToRow(post);
  const { error } = await supabase.from('posts').insert(row);
  if (error) throw error;
}

export async function updatePost(id: string, updates: Partial<PostPost>): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

interface PostPost {
  movie_title?: string;
  year?: string;
  poster_color?: string;
  plot_hole?: string;
  rewrite?: string;
  author?: string;
  author_avatar?: string;
  sob_rating?: number;
  sob_rating_count?: number;
  user_sob_rating?: number | null;
  votes?: number;
  downvotes?: number;
  user_vote?: 'up' | 'down' | null;
  time_ago?: string;
  is_boosted?: boolean;
  tags?: string[];
  comments?: PostComment[];
}

export function buildPostRow(post: PlotPost): PostPost {
  return postToRow(post);
}
