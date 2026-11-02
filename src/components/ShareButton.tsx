import { Share } from 'lucide-react';

interface ShareButtonProps {
  postId: string;
  onCopied?: () => void;
  size?: 'default' | 'sm' | 'xs';
}

export function ShareButton({ postId, onCopied, size = 'default' }: ShareButtonProps) {
  const handleShare = async () => {
    const baseUrl =
      window.location.href.includes('localhost') || !window.location.href
        ? 'https://losttheplot.xyz'
        : window.location.href;
    const shareUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}post=${postId}`;
    const shareData = {
      title: 'Lost The Plot | Movie Plot Hole Exposed',
      text: 'Check out this movie breakdown and rewrite on Lost The Plot!',
      url: shareUrl,
    };

    let shared = false;
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        shared = true;
      } catch {
        shared = false;
      }
    }

    if (!shared) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        onCopied?.();
      } catch {
        onCopied?.();
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      style={{ touchAction: 'manipulation' }}
      className={`spring-tap flex items-center justify-center rounded-full bg-[#252530] border-[0.5px] border-white/15 text-white/80 transition-all duration-100 hover:text-white ${
        size === 'xs' ? 'h-7 w-7' : size === 'sm' ? 'w-7 h-7' : 'h-10 w-10'
      }`}
      aria-label="Share post"
    >
      <Share className={size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'} strokeWidth={2} />
    </button>
  );
}
