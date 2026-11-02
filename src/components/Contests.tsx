import { useState, useEffect } from 'react';
import { toTitleCase } from '@/lib/titleCase';
import { Trophy, Send, Zap, Film, Crown, Clock } from 'lucide-react';
import type { PlotPost, ModerationFlag, WeeklyPrompt } from '../types';
import { PostCard } from './PostCard';

interface ContestsProps {
  weeklyPrompt: WeeklyPrompt;
  onSubmit: (promptId: string, title: string, text: string) => void;
  userPosts: PlotPost[];
  onVote: (id: string, direction: 'up' | 'down') => void;
  onRate: (id: string, rating: number) => void;
  onFlag: (flag: Omit<ModerationFlag, 'id' | 'timestamp'>) => void;
  onComment: (id: string, text: string, parentId?: string | null, replyTo?: string | null) => void;
  onShareCopied?: () => void;
  onBoost?: (id: string) => void;
  onToggleSave?: (id: string) => void;
  savedPostIds?: Set<string>;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  daysRemaining: number;
}

const MAX_CHARS = 300;

export function Contests({ weeklyPrompt, onSubmit, userPosts, onVote, onRate, onFlag, onComment, onShareCopied, onBoost, onToggleSave, savedPostIds, isAdmin, onDelete, daysRemaining }: ContestsProps) {
  const [entryText, setEntryText] = useState('');
  const [entryTitle, setEntryTitle] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const computeTimeLeft = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const daysUntilSunday = (7 - dayOfWeek) % 7;
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
      nextSunday.setHours(0, 0, 0, 0);
      const diff = nextSunday.getTime() - now.getTime();
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    computeTimeLeft();
    const timer = setInterval(computeTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const canSubmit = entryText.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const title = entryTitle.trim() || weeklyPrompt.movie;
    onSubmit(weeklyPrompt.id, title, entryText.trim());
    setEntryText('');
    setEntryTitle('');
  };

  const challengeSubmissions = userPosts.filter((p) => p.tags.includes('Challenge'));
  const sortedSubmissions = [...challengeSubmissions].sort((a, b) => b.votes - a.votes);

  return (
    <div className="pb-28 pt-4 flex flex-col gap-4">
      {/* Header */}
      <div className="mx-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-5 w-5 text-gold-accent" />
          <h2 className="text-lg font-bold tracking-tight text-cinema-50">Weekly Challenges</h2>
        </div>
      </div>

      <div className="mx-4 rounded-xl border border-gold-accent/30 bg-gold-accent/5 p-3 text-center">
        <p className="text-xs text-cinema-300">
          <span className="font-bold text-gold-accent">Weekly Winner</span> is decided by community votes — the submission with the highest net score takes the crown when the challenge closes.
        </p>
      </div>

      <div className="mx-4 rounded-xl border border-amber-500/30 bg-cinema-900/40 p-3">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Clock className="h-4 w-4 text-gold-accent" style={{ filter: 'drop-shadow(0 0 4px rgba(255, 184, 28, 0.5))' }} />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-accent/80">Challenge Closes In</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Min', value: timeLeft.minutes },
            { label: 'Sec', value: timeLeft.seconds },
          ].map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="text-lg font-black tabular-nums text-gold-accent" style={{ textShadow: '0 0 10px rgba(255, 184, 28, 0.3)' }}>
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-cinema-500">{unit.label}</span>
              </div>
              {i < 3 && <span className="text-sm font-bold text-gold-accent/40">:</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Prompt card */}
      <div
        className="mx-4 overflow-hidden rounded-2xl border border-amber-500/70 glass animate-slide-up"
        style={{
          borderColor: 'rgba(245, 158, 11, 0.7)',
          boxShadow: '0 0 40px rgba(255, 184, 28, 0.08), inset 0 1px 0 rgba(255, 184, 28, 0.06)',
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 184, 28, 0.12) 0%, rgba(255, 184, 28, 0.02) 100%)',
            borderBottom: '1px solid rgba(255, 184, 28, 0.18)',
          }}
        >
          <Zap className="h-4 w-4 text-gold-accent" style={{ filter: 'drop-shadow(0 0 6px rgba(255, 184, 28, 0.7))' }} />
          <h2
            className="text-sm font-bold uppercase tracking-wider text-gold-accent"
            style={{ textShadow: '0 0 12px rgba(255, 184, 28, 0.5)' }}
          >
            This Week's Challenge
          </h2>
        </div>

        <div className="px-4 py-4">
          <div className="mb-2 flex items-center gap-2">
            <Film className="h-4 w-4 flex-shrink-0 text-gold-accent" />
            <h3 className="text-lg font-bold tracking-tight text-cinema-50">
              {weeklyPrompt.movie}
            </h3>
          </div>

          <div className="mb-3 rounded-xl border border-amber-500/30 bg-cinema-900/40 p-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gold-accent/80">Prompt</p>
            <p className="text-sm leading-relaxed text-cinema-200">
              {weeklyPrompt.prompt}
            </p>
          </div>

          <div className="animate-slide-up">
            <input
              value={entryTitle}
              onChange={(e) => setEntryTitle(toTitleCase(e.target.value.slice(0, 60)))}
              placeholder={weeklyPrompt.movie}
              maxLength={60}
              style={{ fontSize: '16px', touchAction: 'manipulation' }}
              className="input-focus-glow mb-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-cinema-50 placeholder:text-white/30 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20"
            />
            <textarea
              value={entryText}
              onChange={(e) => setEntryText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Write your entry here (max 300 characters)..."
              rows={4}
              style={{ fontSize: '16px', touchAction: 'manipulation' }}
              className="input-focus-glow w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-cinema-50 placeholder:text-white/30 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20"
            />
            <div className="mt-1.5 flex items-center justify-between">
              <span className={`text-[10px] tracking-wide transition-colors duration-200 ${
                entryText.length > MAX_CHARS - 20
                  ? 'text-red-400'
                  : entryText.length > MAX_CHARS - 50
                    ? 'text-gold-accent'
                    : 'text-cinema-500'
              }`}>
                {entryText.length} / {MAX_CHARS}
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{ touchAction: 'manipulation' }}
              className={`spring-tap mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
                canSubmit
                  ? 'gold-gradient text-cinema-950 hover:opacity-90 gold-glow'
                  : 'cursor-not-allowed bg-cinema-800/50 text-cinema-600'
              }`}
            >
              <Send className="h-4 w-4" />
              Submit Entry
            </button>
          </div>
        </div>
      </div>

      {sortedSubmissions.length > 0 && (
        <>
          <div className="mx-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold-accent" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-cinema-300">This Week's Submissions</h2>
            <div className="h-px flex-1 bg-cinema-700/50" />
            {sortedSubmissions[0]?.votes > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-gold-accent/60 bg-cinema-900 px-2.5 py-0.5 text-[9px] font-bold text-gold-accent shadow-lg whitespace-nowrap">
                <Crown className="h-3.5 w-3.5" /> CURRENT LEADER
              </span>
            )}
          </div>
          <div className="mx-4 flex flex-col gap-4">
            {sortedSubmissions.map((post, index) => (
              <div key={post.id}>
                <PostCard
                  post={post}
                  postType="Challenge"
                  onVote={onVote}
                  onRate={onRate}
                  onFlag={onFlag}
                  onComment={onComment}
                  onShareCopied={onShareCopied}
                  isSaved={savedPostIds?.has(post.id)}
                  onToggleSave={onToggleSave}
                  isAdmin={isAdmin}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
