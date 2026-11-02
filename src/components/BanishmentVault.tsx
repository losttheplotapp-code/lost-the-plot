import { useState } from 'react';
import { ChevronDown, Skull } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface BanishedPost {
  id: string;
  movieTitle: string;
  author: string;
  rewrite: string;
  downvotes: number;
  reason: string;
}

const banishedPosts: BanishedPost[] = [
  {
    id: 'bv1',
    movieTitle: 'The Matrix',
    author: 'CinemaSinsBot',
    rewrite: 'Neo should have just called IT support. The Oracle is clearly just a chatbot. Agent Smith is a glorified antivirus popup. The red pill is obviously just ibuprofen. The whole movie would be solved in 10 minutes if anyone had just rebooted their computer.',
    downvotes: 342,
    reason: 'Absolute Nonsense',
  },
  {
    id: 'bv2',
    movieTitle: 'Inception',
    author: 'DreamKrasher',
    rewrite: 'The totem is pointless because Cobb could just set an alarm clock. If you\'re dreaming, the alarm would be in the dream too, so it doesn\'t matter. Also, why not just text your wife? Saito has enough money to buy a phone company. The entire heist is unnecessary if they just send an email.',
    downvotes: 287,
    reason: 'Absolute Nonsense',
  },
];

export function BanishmentVault() {
  const [isOpen, setIsOpen] = useLocalStorage<boolean>('ltp_vault_open', false);

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ touchAction: 'manipulation', borderColor: 'rgba(245, 158, 11, 0.7)' }}
        className="spring-tap flex w-full items-center gap-2.5 rounded-2xl border border-amber-500/70 bg-cinema-900/40 p-4 text-left transition-all duration-200 hover:bg-cinema-800/30"
      >
        <Skull className="h-5 w-5 flex-shrink-0 text-red-400/70" />
        <div className="min-w-0 flex-1">
          <p className="break-words whitespace-pre-wrap text-sm font-bold text-cinema-400">
            Enter the Banishment Vault
          </p>
          <p className="text-[11px] text-cinema-600">
            Worst movie takes archive
          </p>
        </div>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-cinema-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 flex flex-col gap-3 animate-slide-up">
          {banishedPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-red-900/30 bg-cinema-900/30 p-4 opacity-60"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="break-words whitespace-pre-wrap text-sm font-bold text-cinema-400">
                    {post.movieTitle}
                  </h3>
                  <p className="text-[10px] text-cinema-600">by {post.author}</p>
                </div>
                <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-red-950/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400">
                  {post.downvotes} downvotes
                </span>
              </div>

              <p className="mb-3 break-words whitespace-pre-wrap text-[11px] leading-relaxed text-cinema-500">
                {post.rewrite}
              </p>

              <div className="flex items-center gap-1.5 rounded-lg bg-red-950/20 px-2.5 py-1.5">
                <Skull className="h-3 w-3 flex-shrink-0 text-red-400" />
                <span className="break-words whitespace-pre-wrap text-[10px] font-bold uppercase tracking-wider text-red-400">
                  Banishment Reason: {post.reason}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
