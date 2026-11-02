import { useState, useCallback, memo, useMemo, useEffect } from 'react';
import { Film } from 'lucide-react';
import type { TabId, PlotPost, Pitch, UserProfile, PostComment, ModerationFlag, WeeklyPrompt } from './types';
import { weeklyPrompts, getCurrentWeeklyPrompt, getDaysRemainingInWeek, userProfile as initialProfile } from './data';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Feed } from './components/Feed';
import { PitchBoard } from './components/PitchBoard';
import { Contests } from './components/Contests';
import { Profile } from './components/Profile';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { LoginScreen } from './components/LoginScreen';
import { LegalPage, type LegalPageType } from './components/LegalPage';
import { fetchPosts, insertPost, updatePost, deletePost } from './lib/posts';
import { fetchPitches, insertPitch, updatePitch, deletePitch } from './lib/pitches';
import { fetchSavedPostIds, savePost, unsavePost } from './lib/savedPosts';

const MemoFeed = memo(Feed);
const MemoPitchBoard = memo(PitchBoard);
const MemoContests = memo(Contests);
const MemoProfile = memo(Profile);

function addCommentToPost(prev: PlotPost[], id: string, text: string, parentId: string | null = null, replyTo: string | null = null): PlotPost[] {
  const newComment: PostComment = {
    id: `cmt${Date.now()}`,
    author: 'You',
    authorAvatar: 'YO',
    text,
    timeAgo: 'just now',
    likes: 0,
    parentId,
    replyTo,
    createdAt: Date.now(),
  };
  return prev.map((post) => {
    if (post.id !== id) return post;
    const newComments = [...(post.comments ?? [])];
    if (parentId) {
      const parentIndex = newComments.findIndex((c) => c.id === parentId);
      if (parentIndex !== -1) {
        newComments.splice(parentIndex + 1, 0, newComment);
      } else {
        newComments.push(newComment);
      }
    } else {
      newComments.push(newComment);
    }
    return { ...post, comments: newComments };
  });
}

function setBoostedFlag<T extends { id: string; isBoosted?: boolean }>(items: T[], id: string): T[] {
  return items.map((item) =>
    item.id === id ? { ...item, isBoosted: true } : item
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('ltp_authed', false);
  const [activeTab, setActiveTab] = useState<TabId>('feed');
  const [posts, setPosts] = useState<PlotPost[]>([]);
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [pitchesLoading, setPitchesLoading] = useState(true);
  const [savedPostIdList, setSavedPostIdList] = useState<string[]>([]);
  const [profile, setProfile] = useLocalStorage<UserProfile>('ltp_profile', initialProfile);
  const [moderationQueue, setModerationQueue] = useLocalStorage<ModerationFlag[]>('ltp_moderation_queue', []);
  const [isAdmin, setIsAdmin] = useState(false);
  const [legalPage, setLegalPage] = useState<LegalPageType | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [postData, pitchData, savedIds] = await Promise.all([fetchPosts(), fetchPitches(), fetchSavedPostIds()]);
        if (active) {
          setPosts(postData);
          setPitches(pitchData);
          setSavedPostIdList(savedIds);
          setPostsLoading(false);
          setPitchesLoading(false);
        }
      } catch {
        if (active) {
          setToastMessage('Could not load posts from the server. Please refresh.');
          setToastVisible(true);
          setPostsLoading(false);
          setPitchesLoading(false);
        }
      }
    })();
    return () => { active = false; };
  }, []);

  const savedPostIds = useMemo(() => new Set(savedPostIdList), [savedPostIdList]);

  const userPosts = useMemo(
    () => posts.filter((p) => p.author === profile.displayName && !p.tags.includes('Challenge')),
    [posts, profile.displayName],
  );

  const savedPosts = useMemo(
    () => savedPostIdList
      .map((id) => posts.find((p) => p.id === id))
      .filter((p): p is PlotPost => p !== undefined && !p.tags.includes('Challenge')),
    [posts, savedPostIdList],
  );

  const challengePosts = useMemo(
    () => posts.filter((p) => p.tags.includes('Challenge')),
    [posts],
  );

  const handleSignIn = useCallback(() => {
    setIsAuthenticated(true);
  }, [setIsAuthenticated]);

  const handleSkip = useCallback(() => {
    setIsAuthenticated(true);
  }, [setIsAuthenticated]);

  const handleFlag = useCallback((flag: Omit<ModerationFlag, 'id' | 'timestamp'>) => {
    const newFlag: ModerationFlag = {
      ...flag,
      id: `flag${Date.now()}`,
      timestamp: Date.now(),
    };
    setModerationQueue((prev) => [...prev, newFlag]);
    setToastMessage('Thank you. Your detailed report has been submitted for review.');
    setToastVisible(true);
  }, [setModerationQueue]);

  const handleToastDismiss = useCallback(() => {
    setToastVisible(false);
  }, []);

  const handleShareCopied = useCallback(() => {
    setToastMessage('Link copied to clipboard!');
    setToastVisible(true);
  }, []);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateVote = useCallback(
    (prev: PlotPost[], id: string, direction: 'up' | 'down') => {
      let newVotes = 0;
      let newDownvotes = 0;
      let newVote: 'up' | 'down' | null = direction;
      const updated = prev.map((post) => {
        if (post.id !== id) return post;
        let voteDelta = 0;
        let downvoteDelta = 0;

        if (post.userVote === direction) {
          newVote = null;
          voteDelta = direction === 'up' ? -1 : 1;
          downvoteDelta = direction === 'down' ? -1 : 0;
        } else if (post.userVote === null) {
          voteDelta = direction === 'up' ? 1 : -1;
          downvoteDelta = direction === 'down' ? 1 : 0;
        } else {
          voteDelta = direction === 'up' ? 2 : -2;
          downvoteDelta = direction === 'down' ? 1 : -1;
        }

        newVotes = post.votes + voteDelta;
        newDownvotes = (post.downvotes ?? 0) + downvoteDelta;
        return { ...post, votes: newVotes, downvotes: newDownvotes, userVote: newVote };
      });
      updatePost(id, { votes: newVotes, user_vote: newVote }).catch(() => {});
      return updated;
    },
    [],
  );

  const handlePostVote = useCallback((id: string, direction: 'up' | 'down') => {
    setPosts((prev) => updateVote(prev, id, direction));
  }, [updateVote]);

  const handlePostRate = useCallback((id: string, rating: number) => {
    let dbRating: number | null = rating;
    let dbSum = 0;
    let dbCount = 0;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post;

        const prevUserRating = post.userSobRating;
        let newCount = post.sobRatingCount;
        let newSum = post.sobRating * post.sobRatingCount;

        if (prevUserRating === null) {
          newCount += 1;
          newSum += rating;
        } else if (prevUserRating === rating) {
          newCount -= 1;
          newSum -= rating;
          dbRating = null;
          dbSum = newCount > 0 ? newSum / newCount : 0;
          dbCount = newCount;
          updatePost(id, { sob_rating: dbSum, sob_rating_count: dbCount, user_sob_rating: null }).catch(() => {});
          return {
            ...post,
            sobRating: newCount > 0 ? newSum / newCount : 0,
            sobRatingCount: newCount,
            userSobRating: null,
          };
        } else {
          newSum += rating - prevUserRating;
        }

        dbSum = newSum / newCount;
        dbCount = newCount;
        updatePost(id, { sob_rating: dbSum, sob_rating_count: dbCount, user_sob_rating: dbRating }).catch(() => {});

        return {
          ...post,
          sobRating: newSum / newCount,
          sobRatingCount: newCount,
          userSobRating: rating,
        };
      }),
    );
  }, []);

  const handlePostComment = useCallback((id: string, text: string, parentId?: string | null, replyTo?: string | null) => {
    setPosts((prev) => {
      const updated = addCommentToPost(prev, id, text, parentId ?? null, replyTo ?? null);
      const post = updated.find((p) => p.id === id);
      if (post) {
        updatePost(id, { comments: post.comments ?? [] }).catch(() => {});
      }
      return updated;
    });
  }, []);

  const handleFeedCreate = useCallback((movieTitle: string, plotHole: string, rewrite: string) => {
    const newPost: PlotPost = {
      id: `fp${Date.now()}`,
      movieTitle,
      year: '2025',
      posterColor: 'from-cinema-700 to-cinema-950',
      plotHole: plotHole || 'User-submitted plot hole',
      rewrite,
      author: profile.displayName,
      authorAvatar: profile.avatar,
      sobRating: 0,
      sobRatingCount: 0,
      userSobRating: null,
      votes: 1,
      downvotes: 0,
      userVote: 'up',
      timeAgo: 'just now',
      createdAt: Date.now(),
      tags: ['User Post'],
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    insertPost(newPost).catch(() => {
      setToastMessage('Could not save your post to the server.');
      setToastVisible(true);
    });
    setProfile((prev) => ({ ...prev, totalSubmissions: prev.totalSubmissions + 1 }));
    setToastMessage('Posted! Your plot hole fix is now live in the Feed.');
    setToastVisible(true);
  }, [setPosts, setProfile, profile.displayName, profile.avatar]);

  const handlePitchVote = useCallback((id: string, direction: 'up' | 'down') => {
    setPitches((prev) => {
      const updated = prev.map((pitch) => {
        if (pitch.id !== id) return pitch;
        let voteDelta = 0;
        let newVote: 'up' | 'down' | null = direction;

        let downvoteDelta = 0;

        if (pitch.userVote === direction) {
          newVote = null;
          voteDelta = direction === 'up' ? -1 : 1;
          downvoteDelta = direction === 'down' ? -1 : 0;
        } else if (pitch.userVote === null) {
          voteDelta = direction === 'up' ? 1 : -1;
          downvoteDelta = direction === 'down' ? 1 : 0;
        } else {
          voteDelta = direction === 'up' ? 2 : -2;
          downvoteDelta = direction === 'down' ? 1 : -1;
        }

        return { ...pitch, votes: pitch.votes + voteDelta, downvotes: (pitch.downvotes ?? 0) + downvoteDelta, userVote: newVote };
      });
      const pitch = updated.find((p) => p.id === id);
      if (pitch) {
        updatePitch(id, { votes: pitch.votes, downvotes: pitch.downvotes, user_vote: pitch.userVote }).catch(() => {});
      }
      return updated;
    });
  }, []);

  const handlePitchSubmit = useCallback((title: string, concept: string, tags: string[], artwork: string | null) => {
    const newPitch: Pitch = {
      id: `pt${Date.now()}`,
      title,
      concept,
      author: profile.displayName,
      authorAvatar: profile.avatar,
      votes: 1,
      downvotes: 0,
      userVote: 'up',
      timeAgo: 'just now',
      tags,
      comments: [],
      artwork,
    };
    setPitches((prev) => [newPitch, ...prev]);
    insertPitch(newPitch).catch(() => {
      setToastMessage('Could not save your pitch to the server.');
      setToastVisible(true);
    });
    setToastMessage('Concept Posted! Your original pitch is now live in the Community Concepts Feed.');
    setToastVisible(true);
  }, [profile.displayName, profile.avatar]);

  const handlePitchComment = useCallback((pitchId: string, text: string, parentId?: string | null, replyTo?: string | null) => {
    const newComment: PostComment = {
      id: `c${Date.now()}`,
      author: 'You',
      authorAvatar: 'YO',
      text,
      timeAgo: 'just now',
      likes: 0,
      parentId: parentId ?? null,
      replyTo: replyTo ?? null,
      createdAt: Date.now(),
    };
    setPitches((prev) => {
      const updated = prev.map((pitch) => {
        if (pitch.id !== pitchId) return pitch;
        const newComments = [...(pitch.comments ?? [])];
        if (parentId) {
          const parentIndex = newComments.findIndex((c) => c.id === parentId);
          if (parentIndex !== -1) {
            newComments.splice(parentIndex + 1, 0, newComment);
          } else {
            newComments.push(newComment);
          }
        } else {
          newComments.push(newComment);
        }
        return { ...pitch, comments: newComments };
      });
      const pitch = updated.find((p) => p.id === pitchId);
      if (pitch) {
        updatePitch(pitchId, { comments: pitch.comments ?? [] }).catch(() => {});
      }
      return updated;
    });
  }, []);

  const currentWeeklyPrompt = useMemo(() => getCurrentWeeklyPrompt(), []);
  const daysRemaining = useMemo(() => getDaysRemainingInWeek(), []);

  const handleContestSubmit = useCallback((promptId: string, title: string, text: string) => {
    const prompt = weeklyPrompts.find((p) => p.id === promptId);
    const newPost: PlotPost = {
      id: `ct${Date.now()}`,
      movieTitle: title,
      year: '2026',
      posterColor: 'from-gold-accent to-amber-700',
      plotHole: prompt ? prompt.prompt : 'Challenge submission',
      rewrite: text,
      author: profile.displayName,
      authorAvatar: profile.avatar,
      sobRating: 0,
      sobRatingCount: 0,
      userSobRating: null,
      votes: 0,
      downvotes: 0,
      userVote: null,
      timeAgo: 'just now',
      createdAt: Date.now(),
      tags: ['Contest', 'Challenge', title],
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    insertPost(newPost).catch(() => {
      setToastMessage('Could not save your entry to the server.');
      setToastVisible(true);
    });
    setProfile((prev) => ({ ...prev, totalSubmissions: prev.totalSubmissions + 1 }));
    setToastMessage('Entry submitted! Your response is now live in the challenge.');
    setToastVisible(true);
  }, [setPosts, setProfile, profile.displayName, profile.avatar]);

  const handleBoost = useCallback((id: string) => {
    setPosts((prev) => setBoostedFlag(prev, id));
    setPitches((prev) => setBoostedFlag(prev, id));
    updatePost(id, { is_boosted: true }).catch(() => {});
    updatePitch(id, { is_boosted: true }).catch(() => {});
    setToastMessage('Pitch boosted! Your card is now pinned to the top of Hot and Top feeds.');
    setToastVisible(true);
  }, []);

  const handleDismissFlag = useCallback((id: string) => {
    setModerationQueue((prev) => prev.filter((f) => f.id !== id));
    setToastMessage('Flag dismissed. The content remains live.');
    setToastVisible(true);
  }, [setModerationQueue]);

  const handleDeleteContent = useCallback((flag: ModerationFlag) => {
    setModerationQueue((prev) => prev.filter((f) => f.id !== flag.id));
    if (flag.postType === 'Pitch') {
      setPitches((prev) => prev.filter((p) => p.id !== flag.postId));
      deletePitch(flag.postId).catch(() => {});
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== flag.postId));
      deletePost(flag.postId).catch(() => {});
    }
    setToastMessage('Content permanently deleted and flag removed from queue.');
    setToastVisible(true);
  }, [setModerationQueue, setPitches, setPosts]);

  const handleShadowban = useCallback((flag: ModerationFlag) => {
    setModerationQueue((prev) => prev.filter((f) => f.id !== flag.id));
    setToastMessage(`User shadowbanned. Their content will be invisible to the community.`);
    setToastVisible(true);
  }, [setModerationQueue]);

  const handleToggleSave = useCallback((id: string) => {
    setSavedPostIdList((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        unsavePost(id).catch(() => {});
        setToastMessage('Removed from your Saved Rewrites.');
        return prev.filter((sid) => sid !== id);
      }
      savePost(id).catch(() => {});
      setToastMessage('Saved! Find it later under Saved Rewrites on your Profile.');
      return [id, ...prev];
    });
    setToastVisible(true);
  }, []);

  const handleAdminDelete = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setPitches((prev) => prev.filter((p) => p.id !== id));
    setSavedPostIdList((prev) => prev.filter((sid) => sid !== id));
    deletePost(id).catch(() => {});
    deletePitch(id).catch(() => {});
    unsavePost(id).catch(() => {});
    setToastMessage('Post deleted from all feeds.');
    setToastVisible(true);
  }, []);

  const handleBuyCharExtension = useCallback((): boolean => {
    return false;
  }, []);

  if (!isAuthenticated) {
    return <LoginScreen onSignIn={handleSignIn} onSkip={handleSkip} />;
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-md cinema-radial">
      {/* Top header */}
      <header className="sticky top-0 z-30 glass-nav border-b border-white/5">
        <div className="flex items-center gap-2.5 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gold-gradient gold-glow">
            <Film className="h-5 w-5 text-cinema-950" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-black tracking-tight text-cinema-50">
              Lost The Plot
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-cinema-400">
              {activeTab === 'feed' && 'Fix the plot holes'}
              {activeTab === 'pitch' && 'Pitch new ideas'}
              {activeTab === 'challenges' && 'Weekly challenge'}
              {activeTab === 'profile' && 'Your writer journey'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-cinema-800/60 px-2.5 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-gold-accent animate-pulse" />
            <span className="text-[10px] font-semibold text-cinema-300">LIVE</span>
          </div>
        </div>
      </header>

      {/* Tab content */}
      <main key={activeTab} className="animate-tab-enter">
        {postsLoading || pitchesLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-accent/30 border-t-gold-accent" />
          </div>
        ) : (
          <>
            {activeTab === 'feed' && (
              <MemoFeed
                posts={posts}
                onVote={handlePostVote}
                onRate={handlePostRate}
                onFlag={handleFlag}
                onComment={handlePostComment}
                onCreate={handleFeedCreate}
                onShareCopied={handleShareCopied}
                onBoost={handleBoost}
                onToggleSave={handleToggleSave}
                savedPostIds={savedPostIds}
                isAdmin={isAdmin}
                onDelete={handleAdminDelete}
              />
            )}
            {activeTab === 'pitch' && (
              <MemoPitchBoard
                pitches={pitches}
                onVote={handlePitchVote}
                onSubmit={handlePitchSubmit}
                onComment={handlePitchComment}
                onShareCopied={handleShareCopied}
                onFlag={handleFlag}
                isAdmin={isAdmin}
                onDelete={handleAdminDelete}
                onBuyCharExtension={handleBuyCharExtension}
              />
            )}
            {activeTab === 'challenges' && (
              <MemoContests
                weeklyPrompt={currentWeeklyPrompt}
                daysRemaining={daysRemaining}
                onSubmit={handleContestSubmit}
                userPosts={challengePosts}
                onVote={handlePostVote}
                onRate={handlePostRate}
                onFlag={handleFlag}
                onComment={handlePostComment}
                onShareCopied={handleShareCopied}
                onBoost={handleBoost}
                onToggleSave={handleToggleSave}
                savedPostIds={savedPostIds}
                isAdmin={isAdmin}
                onDelete={handleAdminDelete}
              />
            )}
            {activeTab === 'profile' && (
              <MemoProfile
                profile={profile}
                userPosts={userPosts}
                savedPosts={savedPosts}
                moderationFlags={moderationQueue}
                isAdmin={isAdmin}
                onVote={handlePostVote}
                onRate={handlePostRate}
                onFlag={handleFlag}
                onComment={handlePostComment}
                onShareCopied={handleShareCopied}
                onToggleSave={handleToggleSave}
                savedPostIds={savedPostIds}
                onDismissFlag={handleDismissFlag}
                onDeleteContent={handleDeleteContent}
                onShadowban={handleShadowban}
              />
            )}
          </>
        )}
      </main>

      {/* Footer with legal links */}
      <footer className="px-4 pb-24 pt-2">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/5 pt-4">
          <button
            onClick={() => setLegalPage('terms')}
            style={{ touchAction: 'manipulation' }}
            className="text-[11px] font-medium text-cinema-500 transition-colors hover:text-gold-accent"
          >
            Terms of Use
          </button>
          <span className="text-cinema-700">•</span>
          <button
            onClick={() => setLegalPage('acceptable-use')}
            style={{ touchAction: 'manipulation' }}
            className="text-[11px] font-medium text-cinema-500 transition-colors hover:text-gold-accent"
          >
            Acceptable Use Policy
          </button>
          <span className="text-cinema-700">•</span>
          <button
            onClick={() => setLegalPage('privacy')}
            style={{ touchAction: 'manipulation' }}
            className="text-[11px] font-medium text-cinema-500 transition-colors hover:text-gold-accent"
          >
            Privacy Policy
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-cinema-600">© 2026 Lost The Plot. All submissions belong to their respective writers.</p>
      </footer>

      {/* Toast notification */}
      <Toast message={toastMessage} show={toastVisible} onDismiss={handleToastDismiss} />

      {/* Bottom navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} isAdmin={isAdmin} onToggleAdmin={() => setIsAdmin((v) => !v)} />

      {/* Legal page overlay */}
      {legalPage && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-cinema-950">
          <LegalPage page={legalPage} onBack={() => setLegalPage(null)} />
        </div>
      )}
    </div>
  );
}
