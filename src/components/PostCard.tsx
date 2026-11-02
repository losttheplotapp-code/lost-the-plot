import { useState, useRef, useEffect, memo } from 'react';
import { ArrowBigUp, ArrowBigDown, Eye, PenLine, Tag, Flag, Copy, AlertOctagon, Ban, ChevronLeft, Send, Flame, Trash2, Bookmark } from 'lucide-react';
import { ShareButton } from './ShareButton';
import { BoostButton } from './BoostButton';
import type { PlotPost, ModerationFlag } from '../types';
import { SobRating } from './SobRating';
import { ReplySection } from './ReplySection';

interface PostCardProps {
  post: PlotPost;
  postType?: 'Feed' | 'Pitch' | 'Challenge' | 'Profile';
  onVote: (id: string, direction: 'up' | 'down') => void;
  onRate: (id: string, rating: number) => void;
  onFlag: (flag: Omit<ModerationFlag, 'id' | 'timestamp'>) => void;
  onComment: (id: string, text: string, parentId?: string | null, replyTo?: string | null) => void;
  onShareCopied?: () => void;
  onBoost?: (id: string) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const flagOptions = [
  { label: 'Report Plagiarism', icon: Copy },
  { label: 'Inappropriate Content', icon: AlertOctagon },
  { label: 'Spam', icon: Ban },
];

const MAX_CONTEXT = 150;

export const PostCard = memo(function PostCard({ post, postType = 'Feed', onVote, onRate, onFlag, onComment, onShareCopied, onBoost, isSaved, onToggleSave, isAdmin, onDelete }: PostCardProps) {
  const [flagOpen, setFlagOpen] = useState(false);
  const [reportStep, setReportStep] = useState<'category' | 'details'>('category');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [context, setContext] = useState('');
  const flagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!flagOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (flagRef.current && !flagRef.current.contains(e.target as Node)) {
        closeFlagMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [flagOpen]);

  const closeFlagMenu = () => {
    setFlagOpen(false);
    setReportStep('category');
    setSelectedCategory('');
    setContext('');
  };

  const handleCategorySelect = (label: string) => {
    setSelectedCategory(label);
    setReportStep('details');
  };

  const handleSubmitReport = () => {
    closeFlagMenu();
    onFlag({
      postId: post.id,
      postType: postType === 'Profile' ? 'Feed' : postType,
      reason: selectedCategory,
      userContext: context,
      flaggedTextSnippet: post.rewrite.slice(0, 200),
    });
  };

  const remaining = MAX_CONTEXT - context.length;

  return (
    <article className="overflow-hidden rounded-2xl border border-orange-400/25 bg-[#16161f] p-4 animate-slide-up relative">

      {isAdmin && onDelete && (
        <button
          onClick={() => onDelete(post.id)}
          style={{ touchAction: 'manipulation' }}
          className="absolute left-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/70 bg-red-950/60 text-red-400 transition-colors hover:bg-red-900/60"
          aria-label="Delete post"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
      {/* Header: Movie poster thumbnail + title */}
      <div className="mb-3 flex items-start gap-3">
        {/* Vertical movie poster thumbnail */}
        <div
          className={`relative flex h-20 w-14 flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${post.posterColor} shadow-xl`}
        >
          <Eye className="h-6 w-6 text-white/80" />
          <span className="mt-1.5 px-1 text-center text-[8px] font-bold uppercase leading-tight tracking-wide text-white/70">
            {post.movieTitle.slice(0, 18)}
          </span>
          {/* Subtle film grain overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex w-full items-start justify-between gap-4">
            <h2 className="flex-1 min-w-0 text-xl font-bold leading-tight line-clamp-2 text-cinema-50">{post.movieTitle}</h2>
            {post.isBoosted && postType !== 'Challenge' && (
              <span className="ml-auto flex-shrink-0 self-start mt-1 whitespace-nowrap inline-flex items-center gap-1 rounded-full border border-gold-accent/40 bg-gold-accent/15 px-2.5 py-1 text-[10px] font-bold text-gold-accent shadow-lg">
                <Flame className="h-3 w-3" />
                BOOSTED
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-white/50">
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[11px] font-medium tracking-wide text-white/60">{post.year}</span>
            <span className="ml-1.5">·</span>
            <span className="ml-1.5">by {post.author}</span>
            <span className="ml-1.5">·</span>
            <span className="ml-1.5">{post.timeAgo}</span>
          </p>
        </div>

        {/* Flag menu — top-right of header */}
        <div className="relative flex-shrink-0 self-start" ref={flagRef}>
          <button
            onClick={() => {
              if (flagOpen) closeFlagMenu();
              else setFlagOpen(true);
            }}
            style={{ touchAction: 'manipulation' }}
            className={`spring-tap flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-150 ${
              flagOpen
                ? 'border-gold-accent/50 bg-gold-accent/10 text-gold-accent'
                : 'border-white/10 bg-white/10 text-white/60 hover:text-white/90'
            }`}
            aria-label="Flag post"
          >
            <Flag className="h-4 w-4" strokeWidth={2} />
          </button>

          {flagOpen && (
            <div
              className="expand-smooth absolute right-0 top-9 z-50 w-56 overflow-hidden rounded-xl glass-panel shadow-2xl"
            >
              {reportStep === 'category' && (
                <>
                  <div className="border-b border-white/5 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-cinema-400">
                      Report this post
                    </p>
                  </div>
                  {flagOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleCategorySelect(option.label)}
                      style={{ touchAction: 'manipulation' }}
                      className="spring-tap flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-cinema-200 transition-colors duration-150 hover:bg-white/5"
                    >
                      <option.icon className="h-4 w-4 flex-shrink-0 text-cinema-500" />
                      {option.label}
                    </button>
                  ))}
                </>
              )}

              {reportStep === 'details' && (
                <div className="p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <button
                      onClick={() => setReportStep('category')}
                      style={{ touchAction: 'manipulation' }}
                      className="spring-tap flex items-center justify-center rounded-md p-1 text-cinema-500 transition-colors hover:text-cinema-200"
                      aria-label="Back to categories"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-cinema-400">
                        {selectedCategory}
                      </p>
                    </div>
                  </div>

                  <p className="mb-2 text-xs text-cinema-300">
                    Optional: Provide more context (max 150 characters)
                  </p>

                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value.slice(0, MAX_CONTEXT))}
                    placeholder="Add details about the issue..."
                    rows={3}
                    style={{ fontSize: '16px', touchAction: 'manipulation' }}
                    className="input-focus-glow w-full resize-none rounded-lg border border-amber-500/70 bg-cinema-900/60 px-3 py-2 text-sm text-cinema-50 placeholder-cinema-500 outline-none"
                  />

                  <div className="mt-1 text-right text-[10px] text-cinema-600">
                    {remaining} characters left
                  </div>

                  <button
                    onClick={handleSubmitReport}
                    style={{ touchAction: 'manipulation' }}
                    className="spring-tap mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg gold-gradient py-2 text-sm font-bold text-cinema-950 transition-all hover:opacity-90 gold-glow"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Submit Report
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {postType === 'Challenge' ? (
        <div className="mb-3 rounded-xl border border-amber-500/30 bg-cinema-900/40 p-3">
          <p className="break-words whitespace-pre-wrap text-sm leading-relaxed text-white/85">{post.rewrite}</p>
        </div>
      ) : (
        <>
          {/* Plot Hole */}
          <div className="mb-3 rounded-xl border border-red-500/25 bg-[#1a1216] p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-red-400/80">
                The Plot Hole
              </span>
            </div>
            <p className="break-words whitespace-pre-wrap text-sm leading-relaxed text-white/85">{post.plotHole}</p>
          </div>

          {/* Rewrite */}
          <div className="mb-3 rounded-xl border border-orange-400/30 bg-[#161210] p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-400/80">
                The Rewrite
              </span>
            </div>
            <p className="break-words whitespace-pre-wrap text-sm leading-relaxed font-mono italic text-cinema-100">{post.rewrite}</p>
          </div>

          {/* Vertical divider */}
          <div className="mb-3 flex justify-center">
            <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />
          </div>

          {/* SOB Rating */}
          <div className="mb-3 rounded-xl border border-orange-400/30 bg-cinema-900/30 p-2.5">
            <SobRating
              communityAvg={post.sobRating}
              ratingCount={post.sobRatingCount}
              userRating={post.userSobRating}
              onChange={(r) => onRate(post.id, r)}
            />
          </div>
        </>
      )}

      {/* Tags */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-medium tracking-wide text-white/65"
          >
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>

      {/* Vote bar */}
      <div className="flex flex-row items-center gap-2 w-full pt-1 justify-start">
        <button
          onClick={() => onVote(post.id, 'up')}
          style={{ touchAction: 'manipulation' }}
          className={`spring-tap flex h-7 items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition-all duration-100 border-[0.5px] shadow-sm ${
            post.userVote === 'up'
              ? 'border-gold-accent gold-gradient text-cinema-950 scale-105'
              : 'bg-orange-500/20 border-orange-400/30 text-white hover:border-orange-400/50'
          }`}
        >
          <ArrowBigUp className="h-3.5 w-3.5" fill={post.userVote === 'up' ? 'currentColor' : 'none'} />
          {post.votes > 0 ? '+' : ''}{post.votes}
        </button>
        <button
          onClick={() => onVote(post.id, 'down')}
          style={{ touchAction: 'manipulation' }}
          className={`spring-tap flex h-7 items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition-all duration-100 border-[0.5px] shadow-sm ${
            post.userVote === 'down'
              ? 'border-red-500 bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-[0_0_15px_rgba(239,68,68,0.6)]'
              : 'bg-red-500/20 border-red-400/30 text-white hover:border-red-400/50'
          }`}
          aria-label="Downvote"
          aria-pressed={post.userVote === 'down'}
        >
          <ArrowBigDown className="h-3.5 w-3.5" fill={post.userVote === 'down' ? 'currentColor' : 'none'} />
          {post.downvotes ?? 0}
        </button>
        <ShareButton postId={post.id} onCopied={onShareCopied} size="sm" />
        {onToggleSave && (
          <button
            onClick={() => onToggleSave(post.id)}
            style={{ touchAction: 'manipulation' }}
            className={`spring-tap flex w-7 h-7 items-center justify-center rounded-full transition-all duration-100 border-[0.5px] ${
              isSaved
                ? 'bg-yellow-500/25 border-yellow-500/40 text-yellow-400'
                : 'bg-[#252530] border-white/15 text-white/80 hover:text-white'
            }`}
            aria-label={isSaved ? 'Unsave post' : 'Save post'}
            aria-pressed={isSaved}
          >
            <Bookmark className="h-3.5 w-3.5" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
        {onBoost && (
          <div className="ml-auto">
            <BoostButton isBoosted={!!post.isBoosted} onBoost={() => onBoost(post.id)} variant="icon" goldActive size="sm" />
          </div>
        )}
      </div>

      {/* Replies */}
      <ReplySection
        threadId={post.id}
        replies={post.comments ?? []}
        onComment={onComment}
        statusLabel={post.votes > 500 ? 'Hot' : post.votes > 0 ? 'Rising' : 'New'}
        statusColor={post.votes > 500 ? 'bg-green-400' : post.votes > 0 ? 'bg-gold-accent' : 'bg-cinema-600'}
      />
    </article>
  );
});
