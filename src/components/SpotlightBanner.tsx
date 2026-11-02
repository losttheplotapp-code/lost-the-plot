import { Sparkles, X } from 'lucide-react';

export function SpotlightBanner() {
  return (
    <div className="relative mb-4 overflow-hidden rounded-2xl border border-amber-500/70 animate-slide-up" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
      <div className="glass relative overflow-hidden p-4">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-900/20 via-cinema-900/40 to-amber-900/10" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-16 w-12 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-cinema-900 shadow-lg">
            <Sparkles className="h-5 w-5 text-amber-300/80" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-gold-accent/30 bg-gold-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gold-accent">
                <Sparkles className="h-2.5 w-2.5" />
                Spotlight
              </span>
            </div>
            <p className="text-sm font-bold leading-tight text-cinema-50">
              Now Streaming: Enter the 2026 Script Pipeline Contest
            </p>
            <p className="mt-0.5 text-[11px] text-cinema-400">Submissions Open — Crowdfunding Spotlight: Back 'The Last Reel' on Kickstarter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
