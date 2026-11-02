import { useState } from 'react';
import { Award, FileText, ThumbsUp, Trophy, Bookmark, PenLine, Eye, Plus, Clapperboard, Shield, TrendingUp, MessageSquare, Lightbulb } from 'lucide-react';
import type { UserProfile, PlotPost, ModerationFlag } from '../types';
import { PostCard } from './PostCard';
import { AdminDashboard } from './AdminDashboard';

interface ProfileProps {
  profile: UserProfile;
  userPosts: PlotPost[];
  savedPosts: PlotPost[];
  moderationFlags: ModerationFlag[];
  isAdmin: boolean;
  onVote: (id: string, direction: 'up' | 'down') => void;
  onRate: (id: string, rating: number) => void;
  onFlag: (flag: Omit<ModerationFlag, 'id' | 'timestamp'>) => void;
  onComment: (id: string, text: string, parentId?: string | null, replyTo?: string | null) => void;
  onToggleSave?: (id: string) => void;
  savedPostIds?: Set<string>;
  onShareCopied?: () => void;
  onDismissFlag: (id: string) => void;
  onDeleteContent: (flag: ModerationFlag) => void;
  onShadowban: (flag: ModerationFlag) => void;
}

type SubTab = 'mine' | 'saved';
type DropdownKey = 'submissions' | 'upvotes' | 'challenges' | null;

const challengesWon = [
  { id: 'cw1', title: 'Inception: The Kick Synchronicity', date: 'Oct 12, 2025' },
  { id: 'cw2', title: 'Titanic: Room for Two on the Door', date: 'Oct 19, 2025' },
];

const submissionsHistory = [
  { id: 'sub1', type: 'Feed Post', icon: MessageSquare, text: 'The Dark Knight Rises — Fixing the Bat-Pod logic gap' },
  { id: 'sub2', type: 'Pitch Board', icon: Lightbulb, text: "Original Concept: 'The Last Frame' (Psychological Horror)" },
];

const upvotesLedger = [
  { id: 'uv1', text: '+42 upvotes on \'Inception: The Kick Synchronicity\'' },
  { id: 'uv2', text: '+18 upvotes on \'Titanic: Room for Two on the Door\'' },
];

const favoriteFilms = [
  { title: 'Blade Runner 2049', year: '2017', color: 'from-amber-600 to-cinema-900' },
  { title: 'Eternal Sunshine', year: '2004', color: 'from-sky-700 to-cinema-900' },
  { title: 'The Prestige', year: '2006', color: 'from-cinema-700 to-cinema-950' },
  { title: 'Inception', year: '2010', color: 'from-slate-600 to-cinema-950' },
];

export function Profile({ profile, userPosts, savedPosts, moderationFlags, isAdmin, onVote, onRate, onFlag, onComment, onToggleSave, savedPostIds, onShareCopied, onDismissFlag, onDeleteContent, onShadowban }: ProfileProps) {
  const [subTab, setSubTab] = useState<SubTab>('mine');
  const [showAdmin, setShowAdmin] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);

  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  if (showAdmin) {
    return (
      <AdminDashboard
        flags={moderationFlags}
        isAdmin={isAdmin}
        onDismiss={onDismissFlag}
        onDeleteContent={onDeleteContent}
        onBack={() => setShowAdmin(false)}
      />
    );
  }

  const stats = [
    { key: 'submissions' as const, label: 'Submissions', value: profile.totalSubmissions, icon: FileText, clickable: true },
    { key: 'upvotes' as const, label: 'Upvotes Received', value: profile.totalUpvotes, icon: ThumbsUp, clickable: true },
    { key: 'challenges' as const, label: 'Challenges Won', value: profile.contestsWon, icon: Trophy, clickable: true },
  ];

  const activePosts = subTab === 'mine' ? userPosts : savedPosts;

  return (
    <div className="px-4 pb-28 pt-4">
      {/* Profile header */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-amber-500/70 glass animate-slide-up" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
        <div className="h-20 bg-gradient-to-r from-cinema-800 via-cinema-700 to-amber-900/40" />

        <div className="px-4 pb-4">
          <div className="-mt-10 mb-3 flex items-end gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-cinema-900 bg-gradient-to-br from-gold-accent to-amber-700 text-xl font-black text-cinema-950 shadow-xl gold-glow">
              {profile.avatar}
            </div>
            <div className="mb-1 flex-1">
              <h2 className="text-lg font-bold leading-tight text-cinema-50">{profile.displayName}</h2>
              <p className="text-xs text-cinema-400">Member since Oct 2025</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 px-3 py-1.5 text-xs font-black text-black"
              style={{ boxShadow: '0 0 12px rgba(251,191,36,0.4)' }}
            >
              <span className="text-sm">⭐</span>
              {profile.title} (Level {profile.level})
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-[#1a1a2e] px-3 py-1.5 text-xs font-bold text-amber-300">
              <span>🌟</span> Rising Star
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-[#1a1a2e] px-3 py-1.5 text-xs font-bold text-amber-300">
              <span>🏆</span> Showdown Winner
            </span>
          </div>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-white/60">
              <span>Level {profile.level}</span>
              <span>620 / 800 XP to Level {profile.level + 1}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 transition-all duration-500"
                style={{ width: '77.5%' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2.5">
        {stats.map((stat) => {
          const isOpen = openDropdown === stat.key;
          return (
            <div
              key={stat.label}
              onClick={() => stat.clickable && toggleDropdown(stat.key)}
              style={stat.clickable ? { touchAction: 'manipulation' } : undefined}
              className={`flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 animate-slide-up transition-all duration-200 ${
                stat.clickable ? 'cursor-pointer hover:bg-white/[0.07]' : ''
              } ${stat.clickable && isOpen ? 'bg-white/[0.07]' : ''}`}
            >
              <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                <stat.icon className="h-4.5 w-4.5 text-black" />
              </div>
              <span className="text-xl font-black text-white">{stat.value}</span>
              <span className="mt-0.5 text-center text-[10px] font-medium uppercase tracking-wide leading-tight text-white/50">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Submissions dropdown */}
      {openDropdown === 'submissions' && (
        <div className="expand-smooth mb-5 overflow-hidden rounded-2xl border border-amber-500/70 backdrop-blur-md bg-cinema-900/70" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <FileText className="h-4 w-4 text-gold-accent" />
            <h3 className="text-sm font-bold tracking-wide text-cinema-100">Submission History</h3>
            <span className="ml-auto text-[10px] font-semibold text-cinema-400">
              {submissionsHistory.length} posts
            </span>
          </div>
          <div className="flex flex-col">
            {submissionsHistory.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gold-accent/[0.04] ${
                  idx < submissionsHistory.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cinema-800">
                  <item.icon className="h-4 w-4 text-gold-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cinema-500">{item.type}</span>
                  <p className="break-words whitespace-pre-wrap text-sm font-semibold leading-snug text-cinema-100">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upvotes dropdown */}
      {openDropdown === 'upvotes' && (
        <div className="expand-smooth mb-5 overflow-hidden rounded-2xl border border-amber-500/70 backdrop-blur-md bg-cinema-900/70" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <TrendingUp className="h-4 w-4 text-gold-accent" />
            <h3 className="text-sm font-bold tracking-wide text-cinema-100">Upvote Ledger</h3>
            <span className="ml-auto text-[10px] font-semibold text-cinema-400">
              {profile.totalUpvotes} total
            </span>
          </div>
          <div className="flex flex-col">
            {upvotesLedger.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gold-accent/[0.04] ${
                  idx < upvotesLedger.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold-accent/20 to-amber-700/20">
                  <ThumbsUp className="h-4 w-4 text-gold-accent" />
                </div>
                <p className="break-words whitespace-pre-wrap text-sm font-semibold leading-snug text-cinema-100">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenges Won dropdown */}
      {openDropdown === 'challenges' && (
        <div className="expand-smooth mb-5 overflow-hidden rounded-2xl border border-amber-500/70 backdrop-blur-md bg-cinema-900/70" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <Trophy className="h-4 w-4 text-gold-accent" />
            <h3 className="text-sm font-bold tracking-wide text-cinema-100">Winning History</h3>
            <span className="ml-auto text-[10px] font-semibold text-cinema-400">
              {challengesWon.length} wins
            </span>
          </div>
          <div className="flex flex-col">
            {challengesWon.map((challenge, idx) => (
              <div
                key={challenge.id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gold-accent/[0.04] ${
                  idx < challengesWon.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold-accent to-amber-700 text-xs font-black text-cinema-950">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-cinema-100">{challenge.title}</p>
                  <p className="text-[10px] tracking-wide text-cinema-500">{challenge.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Cinema Shelf */}
      <div className="mb-5 animate-slide-up">
        <div className="mb-3 flex items-center gap-2">
          <Clapperboard className="h-4 w-4 text-gold-accent" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-cinema-200">My Cinema Shelf</h2>
        </div>
        <p className="mb-3 text-[11px] text-cinema-500">Top Favorite Films</p>

        <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {favoriteFilms.map((film) => (
            <div
              key={film.title}
              className="group relative flex h-44 w-32 flex-shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 shadow-xl transition-transform duration-200 active:scale-95"
            >
              <div className={`relative flex flex-1 items-center justify-center bg-gradient-to-br ${film.color}`}>
                <div className="flex items-center justify-center rounded-full bg-white/5 p-3">
                  <Clapperboard className="h-5 w-5 text-white/30" />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/5" />
              </div>
              <div className="bg-cinema-900/90 px-2 py-1.5">
                <p className="truncate text-xs font-bold leading-tight text-white">{film.title}</p>
                <p className="text-[10px] text-white/50">{film.year}</p>
              </div>
            </div>
          ))}

          <button
            onClick={() => {}}
            style={{ touchAction: 'manipulation' }}
            className="spring-tap flex h-44 w-32 flex-shrink-0 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-white/[0.03] text-white/40 transition-all duration-200 hover:bg-white/[0.05] hover:text-white/70"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold">Add Film</span>
          </button>
        </div>
      </div>

      {/* Sub-tab toggle */}
      <div className="mb-4 flex gap-2 rounded-xl border border-amber-500/70 glass p-1.5" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
        <button
          onClick={() => setSubTab('mine')}
          style={{ touchAction: 'manipulation' }}
          className={`spring-tap flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
            subTab === 'mine'
              ? 'gold-gradient text-cinema-950'
              : 'text-cinema-400 hover:text-cinema-200'
          }`}
        >
          <PenLine className="h-4 w-4" />
          My Rewrites
        </button>
        <button
          onClick={() => setSubTab('saved')}
          style={{ touchAction: 'manipulation' }}
          className={`spring-tap flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
            subTab === 'saved'
              ? 'gold-gradient text-cinema-950'
              : 'text-cinema-400 hover:text-cinema-200'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          Saved Rewrites
        </button>
      </div>

      {/* Content */}
      <div key={subTab} className="flex flex-col gap-4 animate-tab-enter">
        {activePosts.length === 0 ? (
          <div className="rounded-2xl border border-amber-500/70 glass p-8 text-center" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
            <Eye className="mx-auto mb-2 h-8 w-8 text-cinema-600" />
            <p className="text-sm text-cinema-400">
              {subTab === 'mine'
                ? 'No rewrites yet. Head to the Feed and fix your first plot hole!'
                : 'No saved rewrites yet. Bookmark posts you love from the Feed.'}
            </p>
          </div>
        ) : (
          activePosts.map((post) => (
            <PostCard key={post.id} post={post} postType="Profile" onVote={onVote} onRate={onRate} onFlag={onFlag} onComment={onComment} onShareCopied={onShareCopied} isSaved={savedPostIds?.has(post.id)} onToggleSave={onToggleSave} />
          ))
        )}
      </div>

      {/* Admin Dashboard link */}
      <div className="mt-6 border-t border-white/5 pt-4">
        <button
          onClick={() => setShowAdmin(true)}
          style={{ touchAction: 'manipulation' }}
          className="spring-tap flex w-full items-center justify-center gap-1.5 text-[11px] font-medium text-cinema-600 transition-colors hover:text-cinema-400"
        >
          <Shield className={`h-3.5 w-3.5 ${isAdmin ? 'text-red-400' : ''}`} />
          {isAdmin ? 'Admin Moderation Queue' : 'Report Status Tracker'}
          {moderationFlags.length > 0 && (
            <span className="ml-1 rounded-full bg-red-900/40 px-1.5 py-0.5 text-[9px] font-bold text-red-400">
              {moderationFlags.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
