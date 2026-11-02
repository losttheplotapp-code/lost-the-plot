import { supabase } from './supabase';
import type { Pitch, PostComment } from '../types';

interface PitchRow {
  id: string;
  title: string;
  concept: string;
  author: string;
  author_avatar: string;
  votes: number;
  downvotes: number;
  user_vote: 'up' | 'down' | null;
  time_ago: string;
  created_at: number;
  is_boosted: boolean;
  tags: string[];
  comments: PostComment[];
  artwork: string | null;
}

function rowToPitch(row: PitchRow): Pitch {
  return {
    id: row.id,
    title: row.title,
    concept: row.concept,
    author: row.author,
    authorAvatar: row.author_avatar,
    votes: row.votes,
    downvotes: row.downvotes ?? 0,
    userVote: row.user_vote,
    timeAgo: row.time_ago,
    isBoosted: row.is_boosted,
    tags: row.tags ?? [],
    comments: row.comments ?? [],
    artwork: row.artwork,
  };
}

interface PitchUpdate {
  id?: string;
  title?: string;
  concept?: string;
  author?: string;
  author_avatar?: string;
  votes?: number;
  downvotes?: number;
  user_vote?: 'up' | 'down' | null;
  time_ago?: string;
  is_boosted?: boolean;
  tags?: string[];
  comments?: PostComment[];
  artwork?: string | null;
}

export async function fetchPitches(): Promise<Pitch[]> {
  const { data, error } = await supabase
    .from('pitches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as PitchRow[]).map(rowToPitch);
}

export async function insertPitch(pitch: Pitch): Promise<void> {
  const row: PitchUpdate = {
    id: pitch.id,
    title: pitch.title,
    concept: pitch.concept,
    author: pitch.author,
    author_avatar: pitch.authorAvatar,
    votes: pitch.votes,
    downvotes: pitch.downvotes,
    user_vote: pitch.userVote,
    time_ago: pitch.timeAgo,
    is_boosted: pitch.isBoosted ?? false,
    tags: pitch.tags,
    comments: pitch.comments ?? [],
    artwork: pitch.artwork ?? null,
  };
  const { error } = await supabase.from('pitches').insert(row);
  if (error) throw error;
}

export async function updatePitch(id: string, updates: Partial<PitchUpdate>): Promise<void> {
  const { error } = await supabase
    .from('pitches')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function deletePitch(id: string): Promise<void> {
  const { error } = await supabase.from('pitches').delete().eq('id', id);
  if (error) throw error;
}
