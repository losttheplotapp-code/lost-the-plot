import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
  onDismiss: () => void;
}

export function Toast({ message, show, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show, onDismiss]);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(16px)',
      }}
    >
      <div className="flex items-center gap-2.5 rounded-xl border border-gold-accent/30 glass px-4 py-3 shadow-2xl gold-glow">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg gold-gradient">
          <CheckCircle2 className="h-4 w-4 text-cinema-950" />
        </div>
        <p className="text-sm font-medium text-cinema-50">{message}</p>
      </div>
    </div>
  );
}
