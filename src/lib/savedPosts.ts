import { supabase } from './supabase';

export async function fetchSavedPostIds(): Promise<string[]> {
  const { data, error } = await supabase
    .from('saved_posts')
    .select('post_id')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as { post_id: string }[]).map((row) => row.post_id);
}

export async function savePost(postId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_posts')
    .insert({ post_id: postId });
  if (error && error.code !== '23505') throw error;
}

export async function unsavePost(postId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_posts')
    .delete()
    .eq('post_id', postId);
  if (error) throw error;
}
