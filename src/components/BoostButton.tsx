import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

interface BoostButtonProps {
  isBoosted: boolean;
  onBoost: () => void;
  variant?: 'pill' | 'icon';
  goldActive?: boolean;
  size?: 'sm' | 'xs';
}

export function BoostButton({ isBoosted, onBoost, variant = 'pill', goldActive = false, size = 'sm' }: BoostButtonProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (isBoosted || animating) return;
    setAnimating(true);
    onBoost();
    setTimeout(() => setAnimating(false), 1800);
  };

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={isBoosted || animating}
          style={{ touchAction: 'manipulation' }}
          className={`spring-tap flex items-center gap-1 justify-center rounded-full text-[12px] font-bold transition-all duration-100 border-[0.5px] shadow-sm ${
            size === 'xs' ? 'h-7 px-3 text-xs' : 'h-7 px-3.5 text-[12px]'
          } ${
            isBoosted
              ? goldActive
                ? 'border-gold-accent gold-gradient text-cinema-950 scale-105'
                : 'bg-gold-accent/20 text-gold-accent border-gold-accent/50'
              : 'bg-amber-400 border-amber-300 text-black'
          }`}
          aria-label="Boost post"
        >
          <Flame className={size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'} fill="currentColor" />
          <span className="font-bold">Boost</span>
        </button>
        <AnimatePresence>
          {animating && (
            <motion.div
              initial={{ opacity: 0, x: '-50%', y: 0, scale: 0.5 }}
              animate={{ opacity: 1, x: '-50%', y: -100, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="pointer-events-none fixed left-1/2 top-1/2 z-[70]"
            >
              <div className="flex items-center gap-1.5 rounded-full bg-gold-accent px-3 py-1.5 text-xs font-black text-cinema-950 shadow-2xl gold-glow">
                <Flame className="h-3.5 w-3.5" />
                BOOSTED!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (isBoosted) {
    return (
      <span className="flex items-center gap-1 rounded-lg border border-gold-accent/40 bg-gold-accent/10 px-2 py-1.5 text-xs font-bold text-gold-accent">
        <Flame className="h-3.5 w-3.5" />
        BOOSTED
      </span>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={animating}
        style={{ touchAction: 'manipulation' }}
        className="spring-tap flex items-center gap-1 rounded-lg border border-gold-accent/30 bg-gold-accent/5 px-2 py-1.5 text-xs font-semibold text-gold-accent transition-all duration-150 hover:border-gold-accent/50 hover:bg-gold-accent/10 hover:shadow-[0_0_10px_rgba(255,184,28,0.25)]"
        aria-label="Boost pitch"
      >
        <Flame className="h-3.5 w-3.5" />
        Boost
      </button>
      <AnimatePresence>
        {animating && (
          <motion.div
            initial={{ opacity: 0, x: '-50%', y: 0, scale: 0.5 }}
            animate={{ opacity: 1, x: '-50%', y: -100, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="pointer-events-none fixed left-1/2 top-1/2 z-[70]"
          >
            <div className="flex items-center gap-1.5 rounded-full bg-gold-accent px-3 py-1.5 text-xs font-black text-cinema-950 shadow-2xl gold-glow">
              <Flame className="h-3.5 w-3.5" />
              BOOSTED!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
