import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Undo2 } from 'lucide-react';

const STORAGE_PREFIX = 'ltp_char_ext_';
const EXTRA_CHARS_AMOUNT = 200;

export function useCharExtension(fieldKey: string, baseLimit: number) {
  const storageKey = `${STORAGE_PREFIX}${fieldKey}`;
  const [extended, setExtended] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(extended));
    } catch {
      // ignore
    }
  }, [storageKey, extended]);

  const effectiveLimit = extended ? baseLimit + EXTRA_CHARS_AMOUNT : baseLimit;
  const showUpsellThreshold = Math.round(baseLimit * 0.9);

  const buyExtension = useCallback(() => {
    setExtended(true);
  }, []);

  const revertExtension = useCallback(() => {
    setExtended(false);
  }, []);

  return {
    extended,
    effectiveLimit,
    showUpsellThreshold,
    buyExtension,
    revertExtension,
    extraAmount: EXTRA_CHARS_AMOUNT,
  };
}

interface CharExtensionBarProps {
  charCount: number;
  baseLimit: number;
  effectiveLimit: number;
  extended: boolean;
  showUpsellThreshold: number;
  extraAmount: number;
  onBuy: () => void;
  onRevert: () => void;
}

export function CharExtensionBar({
  charCount,
  baseLimit,
  effectiveLimit,
  extended,
  showUpsellThreshold,
  extraAmount,
  onBuy,
  onRevert,
}: CharExtensionBarProps) {
  const showUpsell = !extended && charCount >= showUpsellThreshold;

  return (
    <>
      <span
        className={`text-[11px] transition-colors duration-200 ${
          extended
            ? 'text-gold-accent'
            : charCount > effectiveLimit - 20
              ? 'text-red-400'
              : charCount > effectiveLimit - 50
                ? 'text-gold-accent'
                : 'text-cinema-500'
        }`}
      >
        {charCount} / {effectiveLimit}
        {extended && <span className="ml-1 text-[9px] font-semibold uppercase tracking-wider">(extended)</span>}
      </span>

      <AnimatePresence>
        {showUpsell && !extended && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <button
              onClick={onBuy}
              style={{ touchAction: 'manipulation' }}
              className="spring-tap flex w-full items-center gap-2 rounded-lg border border-gold-accent/30 bg-gold-accent/[0.06] px-3 py-2 text-left transition-all hover:bg-gold-accent/[0.1]"
            >
              <Zap className="h-3.5 w-3.5 flex-shrink-0 text-gold-accent" />
              <span className="flex-1 text-[11px] font-semibold text-gold-accent">
                Need more room? +{extraAmount} chars
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {extended && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <button
              onClick={onRevert}
              style={{ touchAction: 'manipulation' }}
              className="flex w-full items-center gap-2 rounded-lg border border-cinema-700/40 bg-cinema-900/40 px-3 py-1.5 text-left transition-all hover:bg-cinema-800/40"
            >
              <Undo2 className="h-3 w-3 flex-shrink-0 text-cinema-500" />
              <span className="text-[10px] font-medium text-cinema-500">
                Revert to {baseLimit}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
