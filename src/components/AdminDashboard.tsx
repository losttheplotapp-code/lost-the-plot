import { Shield, Trash2, ChevronLeft, Flag, Clock, CheckCircle2, XCircle, Ban } from 'lucide-react';
import type { ModerationFlag } from '../types';

interface AdminDashboardProps {
  flags: ModerationFlag[];
  isAdmin: boolean;
  onDismiss: (id: string) => void;
  onDeleteContent: (flag: ModerationFlag) => void;
  onBack: () => void;
}

export function AdminDashboard({ flags, isAdmin, onDismiss, onDeleteContent, onBack }: AdminDashboardProps) {
  return (
    <div className="px-4 pb-28 pt-4">
      <div className="mb-5 flex items-center gap-2">
        <button
          onClick={onBack}
          style={{ touchAction: 'manipulation' }}
          className="spring-tap flex items-center gap-1 text-xs font-semibold text-cinema-400 transition-colors hover:text-cinema-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Profile
        </button>
      </div>

      <div className="mb-5 flex items-center gap-2">
        <Shield className={`h-5 w-5 ${isAdmin ? 'text-red-400' : 'text-gold-accent'}`} />
        <h2 className="text-lg font-bold tracking-tight text-cinema-50">
          {isAdmin ? 'Admin Moderation Queue' : 'Report Status Tracker'}
        </h2>
      </div>

      {flags.length === 0 ? (
        <div className="rounded-2xl border border-amber-500/70 glass p-8 text-center animate-slide-up" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-accent/10">
            <CheckCircle2 className="h-6 w-6 text-gold-accent" />
          </div>
          <p className="text-sm font-semibold text-cinema-200">
            {isAdmin ? 'Clear Skies! No pending flags in the moderation queue.' : 'No reports submitted yet.'}
          </p>
          <p className="mt-1 text-xs text-cinema-500">
            {isAdmin ? 'All reported content has been reviewed.' : 'Posts you flag will appear here for status tracking.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {flags.map((flag) => (
            <div key={flag.id} className="rounded-2xl border border-amber-500/70 glass p-4 animate-slide-up" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-red-900/30 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-400">
                      {flag.postType}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-cinema-500">
                      <Clock className="h-3 w-3" />
                      {new Date(flag.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-cinema-200">{flag.reason}</p>
                </div>
              </div>

              {flag.userContext && (
                <p className="mb-2 rounded-lg bg-cinema-900/40 p-2 text-xs italic text-cinema-400">
                  &ldquo;{flag.userContext}&rdquo;
                </p>
              )}

              <p className="mb-3 rounded-lg bg-cinema-900/30 p-2 text-xs leading-relaxed text-cinema-300">
                {flag.flaggedTextSnippet}
              </p>

              {isAdmin ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onDismiss(flag.id)}
                    style={{ touchAction: 'manipulation' }}
                    className="spring-tap flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-cinema-800/60 py-2 text-xs font-semibold text-cinema-300 transition-colors hover:bg-cinema-700/60"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Dismiss Flag
                  </button>
                  <button
                    onClick={() => onDeleteContent(flag)}
                    style={{ touchAction: 'manipulation' }}
                    className="spring-tap flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-900/40 py-2 text-xs font-bold text-red-400 transition-colors hover:bg-red-900/60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Banish Post
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cinema-500">
                  <Flag className="h-3.5 w-3.5 text-gold-accent" />
                  <span>Report submitted — pending review</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
