import { useState, useRef, useEffect } from 'react';
import { toTitleCase } from '@/lib/titleCase';
import { Lightbulb, ArrowBigUp, ArrowBigDown, Send, Tag, X, Image as ImageIcon, Trash2, Flag, Copy, AlertOctagon, Ban, ChevronLeft } from 'lucide-react';
import { ShareButton } from './ShareButton';
import type { Pitch, ModerationFlag } from '../types';
import { ReplySection } from './ReplySection';
import { useCharExtension, CharExtensionBar } from './CharExtension';

const flagOptions = [
  { label: 'Report Plagiarism', icon: Copy },
  { label: 'Inappropriate Content', icon: AlertOctagon },
  { label: 'Spam', icon: Ban },
];

const MAX_CONTEXT = 150;

interface PitchBoardProps {
  pitches: Pitch[];
  onVote: (id: string, direction: 'up' | 'down') => void;
  onSubmit: (title: string, concept: string, tags: string[], artwork: string | null) => void;
  onComment: (id: string, text: string, parentId?: string | null, replyTo?: string | null) => void;
  onShareCopied?: () => void;
  onFlag?: (flag: Omit<ModerationFlag, 'id' | 'timestamp'>) => void;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onBuyCharExtension: () => boolean;
}

const MAX_CHARS = 700;
const MAX_IMAGE_DIM = 800;
const tagOptions = ['Action', 'Sci-Fi', 'Psychological Horror', 'Crime Thriller', 'Mind-Bending', 'Period Drama', 'Comedy', 'Romance', 'Mystery', 'Fantasy', 'TV Shows'];

function resizeImage(file: File, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const CINEMATIC_PLACEHOLDER =
  'data:image/svg+xml;base64,' + btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a1208"/><stop offset="0.5" stop-color="#2a1f10"/><stop offset="1" stop-color="#0a0a0a"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><circle cx="400" cy="250" r="80" fill="#ffb828" opacity="0.15"/><text x="400" y="320" font-family="sans-serif" font-size="28" fill="#ffb828" opacity="0.4" text-anchor="middle">Concept Art</text></svg>'
  );

export function PitchBoard({ pitches, onVote, onSubmit, onComment, onShareCopied, onFlag, isAdmin, onDelete, onBuyCharExtension }: PitchBoardProps) {
  const charExt = useCharExtension('pitch_concept', MAX_CHARS);
  const [title, setTitle] = useState('');
  const [concept, setConcept] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [flagPitchId, setFlagPitchId] = useState<string | null>(null);
  const [reportStep, setReportStep] = useState<'category' | 'details'>('category');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [flagContext, setFlagContext] = useState('');
  const flagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!flagPitchId) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (flagRef.current && !flagRef.current.contains(e.target as Node)) {
        closeFlagMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [flagPitchId]);

  const closeFlagMenu = () => {
    setFlagPitchId(null);
    setReportStep('category');
    setSelectedCategory('');
    setFlagContext('');
  };

  const handleCategorySelect = (label: string) => {
    setSelectedCategory(label);
    setReportStep('details');
  };

  const handleSubmitReport = (pitch: Pitch) => {
    const pitchId = pitch.id;
    closeFlagMenu();
    onFlag?.({
      postId: pitchId,
      postType: 'Pitch',
      reason: selectedCategory,
      userContext: flagContext,
      flaggedTextSnippet: pitch.concept.slice(0, 200),
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canSubmit = title.trim().length > 0 && concept.trim().length > 0;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    try {
      const dataUrl = await resizeImage(file, MAX_IMAGE_DIM);
      setArtworkPreview(dataUrl);
    } catch {
      // ignore failed reads
    }
    e.target.value = '';
  };

  const handleRemoveArtwork = () => {
    setArtworkPreview(null);
  };

  const handleArtClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(title.trim(), concept.trim(), selectedTags, artworkPreview);
    setTitle('');
    setConcept('');
    setSelectedTags([]);
    setArtworkPreview(null);
    setShowForm(false);
  };

  return (
    <div className="px-4 pb-28 pt-4">
      {/* Pitch composer */}
      <div className="mb-5">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex w-full items-center gap-3 rounded-2xl border border-amber-500/70 bg-gold-accent/5 p-4 text-left transition-all duration-200 hover:bg-gold-accent/10"
            style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl gold-gradient">
              <Lightbulb className="h-5 w-5 text-cinema-950" />
            </div>
            <div>
              <p className="text-sm font-bold text-cinema-50">Pitch a new concept</p>
              <p className="text-xs text-cinema-400">Got an original idea? Share it with the community.</p>
            </div>
          </button>
        ) : (
          <div className="rounded-2xl border border-amber-500/70 glass p-4 animate-slide-up" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-cinema-50">New Pitch</h3>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 text-cinema-400 hover:bg-cinema-800 hover:text-cinema-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(toTitleCase(e.target.value))}
              placeholder="Title (e.g., 'The Last Projectionist')"
              maxLength={60}
              style={{ fontSize: '16px', touchAction: 'manipulation' }}
              className="input-focus-glow mb-3 w-full rounded-xl border border-amber-500/70 bg-cinema-900/50 px-3 py-2.5 text-sm text-cinema-50 placeholder-cinema-500 outline-none"
            />

            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value.slice(0, charExt.effectiveLimit))}
              placeholder="Describe your movie concept (max 700 characters)..."
              rows={5}
              style={{ fontSize: '16px', touchAction: 'manipulation' }}
              className="input-focus-glow w-full resize-none rounded-xl border border-amber-500/70 bg-cinema-900/50 px-3 py-2.5 text-sm text-cinema-50 placeholder-cinema-500 outline-none"
            />

            <div className="mt-1.5 flex flex-col">
              <div className="flex justify-between text-[11px]">
                <span className="text-cinema-500">Be bold. Be original.</span>
                <CharExtensionBar
                  charCount={concept.length}
                  baseLimit={MAX_CHARS}
                  effectiveLimit={charExt.effectiveLimit}
                  extended={charExt.extended}
                  showUpsellThreshold={charExt.showUpsellThreshold}
                  extraAmount={charExt.extraAmount}
                  onBuy={() => { if (onBuyCharExtension()) charExt.buyExtension(); }}
                  onRevert={() => {
                    charExt.revertExtension();
                    setConcept((prev) => prev.slice(0, MAX_CHARS));
                  }}
                />
              </div>
            </div>

            {/* Art upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {artworkPreview ? (
              <div className="relative mb-3 mt-3 overflow-hidden rounded-xl border border-gold-accent/30">
                <img
                  src={artworkPreview}
                  alt="Concept art preview"
                  className="h-44 w-full object-cover"
                />
                <button
                  onClick={handleRemoveArtwork}
                  style={{ touchAction: 'manipulation' }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-cinema-950/80 text-cinema-200 transition-colors hover:bg-cinema-950 hover:text-white"
                  aria-label="Remove artwork"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleArtClick}
                style={{ touchAction: 'manipulation' }}
                className="spring-tap mb-3 mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold-accent/30 bg-gold-accent/[0.03] py-5 transition-all duration-200 hover:border-gold-accent/50 hover:bg-gold-accent/[0.06]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold-accent/20 bg-gold-accent/10">
                  <ImageIcon className="h-5 w-5 text-gold-accent" />
                </div>
                <span className="text-sm font-semibold text-gold-accent">Upload Concept Art / Mood Board</span>
                <span className="text-[11px] text-cinema-500">Optional</span>
              </button>
            )}

            {/* Tag selector */}
            <div className="mt-3">
              <div className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-cinema-400">
                <Tag className="h-3 w-3" /> Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tagOptions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{ touchAction: 'manipulation' }}
                    className={`spring-tap rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'gold-gradient text-cinema-950'
                        : 'bg-cinema-800/60 text-cinema-400 hover:bg-cinema-700/60'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
                canSubmit
                  ? 'gold-gradient text-cinema-950 hover:opacity-90 gold-glow'
                  : 'cursor-not-allowed bg-cinema-800/50 text-cinema-600'
              }`}
            >
              <Send className="h-4 w-4" />
              Post Concept
            </button>
          </div>
        )}
      </div>

      {/* Community Concepts Feed */}
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cinema-300">Community Concepts Feed</h2>
        <div className="h-px flex-1 bg-cinema-700/50" />
      </div>

      <div className="flex flex-col gap-4">
        {pitches.map((pitch) => (
          <div key={pitch.id} className="max-w-full overflow-hidden rounded-2xl border border-gold-accent/20 bg-white/[0.03] p-4 animate-slide-up relative shadow-[0_0_12px_rgba(255,184,28,0.08)] transition-shadow duration-300 hover:shadow-[0_0_18px_rgba(255,184,28,0.15)]">
            {isAdmin && onDelete && (
              <button
                onClick={() => onDelete(pitch.id)}
                style={{ touchAction: 'manipulation' }}
                className="absolute left-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/70 bg-red-950/60 text-red-400 transition-colors hover:bg-red-900/60"
                aria-label="Delete pitch"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <h3 className="break-words whitespace-pre-wrap text-base font-bold text-cinema-50">{pitch.title}</h3>
                <p className="mt-0.5 text-[11px] text-cinema-500">by {pitch.author} • {pitch.timeAgo}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1.5">
                <button
                  onClick={() => onVote(pitch.id, 'up')}
                  style={{ touchAction: 'manipulation' }}
                  className={`spring-tap flex h-7 items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition-all duration-100 border-[0.5px] shadow-sm ${
                    pitch.userVote === 'up'
                      ? 'border-gold-accent gold-gradient text-cinema-950 scale-105'
                      : 'bg-[#252530] border-white/15 text-white/80 hover:text-white'
                  }`}
                >
                  <ArrowBigUp className="h-3.5 w-3.5" fill={pitch.userVote === 'up' ? 'currentColor' : 'none'} />
                  {pitch.votes}
                </button>
                <button
                  onClick={() => onVote(pitch.id, 'down')}
                  style={{ touchAction: 'manipulation' }}
                  className={`spring-tap flex h-7 items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition-all duration-100 border-[0.5px] shadow-sm ${
                    pitch.userVote === 'down'
                      ? 'border-red-500 bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-[0_0_15px_rgba(239,68,68,0.6)]'
                      : 'bg-red-500/20 border-red-400/30 text-white hover:border-red-400/50'
                  }`}
                  aria-label="Downvote"
                >
                  <ArrowBigDown className="h-3.5 w-3.5" fill={pitch.userVote === 'down' ? 'currentColor' : 'none'} />
                  {pitch.downvotes ?? 0}
                </button>
                <ShareButton postId={pitch.id} onCopied={onShareCopied} size="sm" />
                {onFlag && (
                  <div className="relative flex-shrink-0" ref={flagPitchId === pitch.id ? flagRef : undefined}>
                    <button
                      onClick={() => {
                        if (flagPitchId === pitch.id) closeFlagMenu();
                        else { setFlagPitchId(pitch.id); setReportStep('category'); setSelectedCategory(''); setFlagContext(''); }
                      }}
                      style={{ touchAction: 'manipulation' }}
                      className={`spring-tap flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-150 ${
                        flagPitchId === pitch.id
                          ? 'border-gold-accent/50 bg-gold-accent/10 text-gold-accent'
                          : 'border-white/10 bg-white/10 text-white/60 hover:text-white/90'
                      }`}
                      aria-label="Flag pitch"
                    >
                      <Flag className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>

                    {flagPitchId === pitch.id && (
                      <div
                        className="expand-smooth absolute right-0 top-9 z-50 w-56 overflow-hidden rounded-xl glass-panel shadow-2xl"
                      >
                        {reportStep === 'category' && (
                          <>
                            <div className="border-b border-white/5 px-3 py-2">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-cinema-400">
                                Report this pitch
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
                              value={flagContext}
                              onChange={(e) => setFlagContext(e.target.value.slice(0, MAX_CONTEXT))}
                              placeholder="Add details about the issue..."
                              rows={3}
                              style={{ fontSize: '16px', touchAction: 'manipulation' }}
                              className="input-focus-glow w-full resize-none rounded-lg border border-amber-500/70 bg-cinema-900/60 px-3 py-2 text-sm text-cinema-50 placeholder-cinema-500 outline-none"
                            />

                            <div className="mt-1 text-right text-[10px] text-cinema-600">
                              {MAX_CONTEXT - flagContext.length} characters left
                            </div>

                            <button
                              onClick={() => handleSubmitReport(pitch)}
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
                )}
              </div>
            </div>

            {pitch.artwork && (
              <div className="mb-3 overflow-hidden rounded-xl border border-white/10">
                <img
                  src={pitch.artwork}
                  alt={`${pitch.title} concept art`}
                  className="h-48 w-full object-cover"
                />
              </div>
            )}

            <p className="break-words whitespace-pre-wrap text-sm leading-relaxed text-cinema-200">{pitch.concept}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {pitch.tags.map((tag) => (
                <span key={tag} className="flex items-center rounded-full border border-white/5 bg-white/[0.06] px-3 py-1 text-xs font-medium tracking-wide text-white/60">
                  {tag}
                </span>
              ))}
            </div>

            <ReplySection
              threadId={pitch.id}
              replies={pitch.comments ?? []}
              onComment={onComment}
              statusLabel={pitch.votes > 500 ? 'Hot' : pitch.votes > 0 ? 'Rising' : 'New'}
              statusColor={pitch.votes > 500 ? 'bg-green-400' : pitch.votes > 0 ? 'bg-gold-accent' : 'bg-cinema-600'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
