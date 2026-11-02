import { useState } from 'react';

interface SobRatingProps {
  communityAvg: number;
  ratingCount: number;
  userRating: number | null;
  onChange: (rating: number) => void;
}

const levels = [
  { value: 1, label: 'Makes sense' },
  { value: 2, label: 'Mild stretch' },
  { value: 3, label: 'Suspicious' },
  { value: 4, label: 'Heavy lifting' },
  { value: 5, label: 'Outrageous' },
];

export function SobRating({ communityAvg, ratingCount, userRating, onChange }: SobRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const selectedRating = userRating ?? 0;
  const activeLevel = levels.find((l) => l.value === selectedRating);
  const avgDisplay = communityAvg.toFixed(1);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold uppercase tracking-wider text-gold-accent whitespace-nowrap">
          Suspension of Disbelief
        </span>
        <span className="text-[11px] font-medium text-gold-accent whitespace-nowrap text-right">
          {activeLevel ? (
            `${activeLevel.value} - ${activeLevel.label}`
          ) : 'Not yet rated'}
        </span>
      </div>

      <p className="text-[10px] italic leading-relaxed text-cinema-500">
        Logic Scale: believable or massive stretch?
      </p>

      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((level) => {
          const isSelected = selectedRating === level;
          const isHovered = hoverRating === level && hoverRating !== 0;
          return (
            <button
              key={level}
              onClick={() => onChange(level)}
              onMouseEnter={() => setHoverRating(level)}
              onMouseLeave={() => setHoverRating(0)}
              style={{ touchAction: 'manipulation' }}
              className={`spring-tap flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition-all duration-200 ${
                isSelected
                  ? 'border-gold-accent gold-gradient text-cinema-950 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                  : isHovered
                    ? 'border-gold-accent/50 bg-gold-accent/10 text-gold-accent shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                    : 'border-cinema-700 bg-cinema-800/50 text-cinema-500'
              }`}
              aria-label={`Rate ${level}`}
              aria-pressed={isSelected}
            >
              {level}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-cinema-500">
        <span>
          Community avg: <span className="font-semibold text-cinema-300">{avgDisplay}</span> / 5
        </span>
        <span>{ratingCount} rating{ratingCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}
