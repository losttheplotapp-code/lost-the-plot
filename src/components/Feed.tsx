import { Flame, TrendingUp, Clock, Search, X, Plus, Send } from 'lucide-react';
import { toTitleCase } from '@/lib/titleCase';
import { useState, useMemo } from 'react';
import type { PlotPost } from '../types';
import { PostCard } from './PostCard';
import { SpotlightBanner } from './SpotlightBanner';
import { BanishmentVault } from './BanishmentVault';

interface FeedProps {
  posts: PlotPost[];
  onVote: (id: string, direction: 'up' | 'down') => void;
  onRate: (id: string, rating: number) => void;
  onFlag: (flag: Omit<import('../types').ModerationFlag, 'id' | 'timestamp'>) => void;
  onComment: (id: string, text: string, parentId?: string | null, replyTo?: string | null) => void;
  onCreate: (movieTitle: string, plotHole: string, rewrite: string) => void;
  onShareCopied?: () => void;
  onBoost?: (id: string) => void;
  onToggleSave?: (id: string) => void;
  savedPostIds?: Set<string>;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

type SortMode = 'new' | 'hot' | 'top';
type GenreFilter = string;
const MAX_REWRITE = 400;

function parseTimeAgo(timeAgo: string): number {
  const match = timeAgo.match(/(\d+)\s*(h|d|w)/i);
  if (!match) return Date.now();
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = { h: 3600_000, d: 86400_000, w: 604800_000 };
  return Date.now() - value * (multipliers[unit] ?? 3600_000);
}
const genres: GenreFilter[] = ['All', 'Action', 'Sci-Fi', 'Comedy', 'Thriller', 'Horror', 'Adventure', 'Romance', 'Psychological Horror', 'Crime Thriller', 'Mind-Bending', 'Period Drama'];

export function Feed({ posts, onVote, onRate, onFlag, onComment, onCreate, onShareCopied, onBoost, onToggleSave, savedPostIds, isAdmin, onDelete }: FeedProps) {
  const [sortMode, setSortMode] = useState<SortMode>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<GenreFilter>('All');
  const [showCreate, setShowCreate] = useState(false);
  const [createMovie, setCreateMovie] = useState('');
  const [createPlotHole, setCreatePlotHole] = useState('');
  const [createRewrite, setCreateRewrite] = useState('');
  const canCreate = createMovie.trim().length > 0 && createRewrite.trim().length > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    onCreate(createMovie.trim(), createPlotHole.trim(), createRewrite.trim());
    setCreateMovie(''); setCreatePlotHole(''); setCreateRewrite(''); setShowCreate(false);
  };

  const filtered = useMemo(() => {
    let result = [...posts].filter((p) => !p.tags.includes('Challenge'));
    if (activeGenre !== 'All') result = result.filter((p) => p.tags.some((t) => t.toLowerCase() === activeGenre.toLowerCase()));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.movieTitle.toLowerCase().includes(q) || p.plotHole.toLowerCase().includes(q) || p.rewrite.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (sortMode === 'new') result.sort((a, b) => { if (a.isBoosted && !b.isBoosted) return -1; if (!a.isBoosted && b.isBoosted) return 1; return b.createdAt - a.createdAt; });
    else if (sortMode === 'hot') {
      const HOT_WINDOW = 48 * 3600_000; const cutoff = Date.now() - HOT_WINDOW;
      result.sort((a, b) => { if (a.isBoosted && !b.isBoosted) return -1; if (!a.isBoosted && b.isBoosted) return 1; const aRecent = (a.comments ?? []).filter((c) => parseTimeAgo(c.timeAgo) >= cutoff).length; const bRecent = (b.comments ?? []).filter((c) => parseTimeAgo(c.timeAgo) >= cutoff).length; if (bRecent !== aRecent) return bRecent - aRecent; return b.votes - a.votes; });
    } else if (sortMode === 'top') result.sort((a, b) => { if (a.isBoosted && !b.isBoosted) return -1; if (!a.isBoosted && b.isBoosted) return 1; const aScore = a.sobRating * a.sobRatingCount; const bScore = b.sobRating * b.sobRatingCount; if (bScore !== aScore) return bScore - aScore; return b.votes - a.votes; });
    return result;
  }, [posts, activeGenre, searchQuery, sortMode]);

  const sortButtons: { mode: SortMode; label: string; icon: typeof Flame }[] = [
    { mode: 'new', label: 'New', icon: Clock },
    { mode: 'hot', label: 'Hot', icon: Flame },
    { mode: 'top', label: 'Top', icon: TrendingUp },
  ];

  return (
    <div className="px-4 pb-28 pt-4">
      <SpotlightBanner />
      <div className="mb-4">
        {!showCreate ? (
          <button onClick={() => setShowCreate(true)} style={{ touchAction: 'manipulation', borderColor: 'rgba(245, 158, 11, 0.7)' }} className="flex w-full items-center gap-3 rounded-2xl border border-amber-500/70 bg-gold-accent/5 p-4 text-left hover:bg-gold-accent/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-gradient"><Plus className="h-5 w-5 text-cinema-950" /></div>
            <div><p className="text-sm font-bold text-cinema-50">Lost the plot?</p><p className="text-xs text-cinema-400">Found a plot hole? Fix it.</p></div>
          </button>
        ) : (
          <div className="rounded-2xl border border-amber-500/70 glass p-4 animate-slide-up" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
            <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold text-cinema-50">New Plot Hole</h3><button onClick={() => setShowCreate(false)} className="rounded-lg p-1 text-cinema-400 hover:bg-cinema-800 hover:text-cinema-200"><X className="h-4 w-4" /></button></div>
            <input value={createMovie} onChange={(e) => setCreateMovie(toTitleCase(e.target.value))} placeholder="Movie / Show title" maxLength={60} style={{ fontSize: '16px' }} className="input-focus-glow mb-3 w-full rounded-xl border border-amber-500/70 bg-cinema-900/50 px-3 py-2.5 text-sm text-cinema-50 outline-none" />
            <textarea value={createPlotHole} onChange={(e) => setCreatePlotHole(e.target.value)} placeholder="Describe the plot hole (optional)..." rows={2} style={{ fontSize: '16px' }} className="input-focus-glow mb-3 w-full resize-none rounded-xl border border-amber-500/70 bg-cinema-900/50 px-3 py-2.5 text-sm outline-none" />
            <textarea value={createRewrite} onChange={(e) => setCreateRewrite(e.target.value.slice(0, MAX_REWRITE))} placeholder="Your rewrite (max 400)..." rows={4} style={{ fontSize: '16px' }} className="input-focus-glow w-full resize-none rounded-xl border border-amber-500/70 bg-cinema-900/50 px-3 py-2.5 text-sm outline-none" />
            <div className="mt-1.5 flex items-center justify-between"><span className="text-[11px] text-cinema-500">Make it count.</span><span className={`text-[11px] ${createRewrite.length >= 380 ? 'text-amber-500 font-bold' : 'text-cinema-500'}`}>{createRewrite.length}/{MAX_REWRITE}</span></div>
            <button onClick={handleCreate} disabled={!canCreate} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold ${canCreate ? 'gold-gradient text-cinema-950 gold-glow' : 'bg-cinema-800/50 text-cinema-600'}`}><Send className="h-4 w-4" />Post a Plot Hole</button>
          </div>
        )}
      </div>
      <div className="sticky top-0 z-20 -mx-4 mb-3 bg-cinema-950/90 px-4 pb-2 pt-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-cinema-900/50 px-3 py-2.5 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400/30"><Search className="h-4 w-4 text-cinema-500" /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search movies, plot holes..." style={{ fontSize: '16px' }} className="flex-1 bg-transparent text-sm text-cinema-50 outline-none" />{searchQuery && <button onClick={() => setSearchQuery('')} className="rounded-md p-0.5 text-cinema-500"><X className="h-4 w-4" /></button>}</div>
        <div className="relative mt-3"><div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4">{genres.map((genre) => (<button key={genre} onClick={() => setActiveGenre(genre)} style={{ touchAction: 'manipulation' }} className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 ${activeGenre === genre ? 'gold-gradient text-cinema-950' : 'border border-cinema-700/50 bg-cinema-800/40 text-cinema-400 active:bg-cinema-700/60'}`}>{genre}</button>))}</div><div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-cinema-950 to-transparent" /></div>
      </div>
      <div className="mb-4 flex gap-2 rounded-xl border border-white/10 bg-cinema-900/50 p-1.5">{sortButtons.map(({ mode, label, icon: Icon }) => (<button key={mode} onClick={() => setSortMode(mode)} style={{ touchAction: 'manipulation' }} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-150 active:scale-95 ${sortMode === mode ? 'gold-gradient text-cinema-950' : 'text-white/60 hover:text-white/80 active:bg-cinema-800/60'}`}><Icon className="h-4 w-4" />{label}</button>))}</div>
      <div className="flex flex-col gap-4">
        {filtered.length > 0 ? filtered.map((post) => (<div key={post.id}><PostCard post={post} onVote={onVote} onRate={onRate} onFlag={onFlag} onComment={onComment} onShareCopied={onShareCopied} onBoost={onBoost} isSaved={savedPostIds?.has(post.id)} onToggleSave={onToggleSave} isAdmin={isAdmin} onDelete={onDelete} /></div>)) : (<div className="rounded-2xl border border-amber-500/70 glass p-8 text-center"><Search className="mx-auto mb-2 h-8 w-8 text-cinema-600" /><p className="text-sm font-medium text-cinema-300">No plot holes found</p><p className="mt-1 text-xs text-cinema-500">Try a different search term.</p></div>)}
      </div>
      {filtered.length > 0 && <p className="mt-6 text-center text-xs text-cinema-600">You've reached the end of the feed.</p>}
      <BanishmentVault />
    </div>
  );
}
