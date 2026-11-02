import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import type { PostComment } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MAX_CHARS = 400;

interface ReplySectionProps {
  threadId: string;
  replies: PostComment[];
  onComment: (id: string, text: string, parentId?: string | null, replyTo?: string | null) => void;
  statusLabel?: string;
  statusColor?: string;
}

export function ReplySection({ threadId, replies, onComment, statusLabel, statusColor }: ReplySectionProps) {
  const [open, setOpen] = useState(false);
  const [renderContent, setRenderContent] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyToAuthor, setReplyToAuthor] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useLocalStorage<string[]>('ltp_reply_likes', []);
  const likedSet = useMemo(() => new Set(likedIds), [likedIds]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const commentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleToggleOpen = () => {
    if (open) {
      setOpen(false);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => setRenderContent(false), 300);
    } else {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setRenderContent(true);
      setTimeout(() => {
        setOpen(true);
        const textarea = textareaRef.current;
        if (textarea) {
          setTimeout(() => {
            const rect = textarea.getBoundingClientRect();
            const viewport = window.innerHeight;
            const offset = viewport - rect.bottom - 120;
            if (offset < 0) {
              window.scrollBy({ top: -offset, behavior: 'smooth' });
            }
          }, 350);
        }
      }, 20);
    }
  };

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const autoResize = useCallback((el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  const scrollIntoView = useCallback((el: HTMLElement) => {
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }, []);

  const allReplies = useMemo(() => {
    return [...replies].sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
  }, [replies]);

  const topLevel = useMemo(() => allReplies.filter((r) => !r.parentId), [allReplies]);

  const getReplies = (parentId: string): PostComment[] =>
    allReplies
      .filter((r) => r.parentId === parentId)
      .sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return [...next];
    });
  };

  const getLikeCount = (r: PostComment) => (r.likes ?? 0) + (likedSet.has(r.id) ? 1 : 0);

  const handleSubmit = () => {
    if (!replyText.trim()) return;
    onComment(threadId, replyText.trim(), replyingTo, replyToAuthor);
    setReplyText('');
    setReplyingTo(null);
    setReplyToAuthor(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = '36px';
    }
  };

  const handleReplyClick = (comment: PostComment) => {
    const targetParentId = comment.parentId ?? comment.id;
    if (replyingTo === targetParentId && replyToAuthor === comment.author) {
      setReplyingTo(null);
      setReplyToAuthor(null);
      setReplyText('');
    } else {
      setReplyingTo(targetParentId);
      setReplyToAuthor(comment.author);
      setReplyText('');
      const el = commentRefs.current.get(comment.id);
      if (el) scrollIntoView(el);
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyToAuthor(null);
    setReplyText('');
  };

  const renderReplyInput = (inline: boolean) => (
    <div className={inline ? 'mt-2 ml-6 pl-4' : 'mt-3'}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] text-amber-400">Replying to @{replyToAuthor}</span>
        <button
          onClick={cancelReply}
          style={{ touchAction: 'manipulation' }}
          className="text-[10px] text-cinema-500 transition-colors hover:text-cinema-300"
        >
          Cancel
        </button>
      </div>
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={replyText}
          onChange={(e) => { setReplyText(e.target.value.slice(0, MAX_CHARS)); autoResize(e.target); }}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
          placeholder={`Replying to @${replyToAuthor}`}
          rows={1}
          style={{ fontSize: '16px', touchAction: 'manipulation', height: '36px' }}
          className="px-3 py-2 rounded-2xl bg-cinema-800 text-[13px] text-cinema-50 placeholder-cinema-500 outline-none flex-1 resize-none overflow-hidden"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={!replyText.trim()}
          style={{ touchAction: 'manipulation' }}
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
            replyText.trim() ? 'bg-amber-400 text-black' : 'cursor-not-allowed bg-cinema-800/50 text-cinema-600'
          }`}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderComment = (comment: PostComment, isReply: boolean) => (
    <div
      key={comment.id}
      ref={(el) => {
        if (el) commentRefs.current.set(comment.id, el);
        else commentRefs.current.delete(comment.id);
      }}
      className={
        isReply
          ? 'ml-6 pl-4 border-l-[3px] border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)] bg-cinema-900/60 rounded-r-xl mt-2 p-3'
          : 'p-3 bg-cinema-900/40 rounded-xl mt-2'
      }
    >
      {isReply && (
        <div className="text-[11px] font-bold text-amber-400 mb-1">@{comment.replyTo}</div>
      )}
      <div className="flex gap-2">
        <div className="h-6 w-6 flex-shrink-0 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-bold text-black">
          {comment.authorAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-white/85 break-words whitespace-pre-wrap">{comment.text}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[11px] text-cinema-500">{getLikeCount(comment)}</span>
            <button
              onClick={() => toggleLike(comment.id)}
              style={{ touchAction: 'manipulation' }}
              className={`text-[11px] font-semibold transition-colors ${
                likedSet.has(comment.id)
                  ? 'text-amber-400'
                  : 'text-cinema-500 hover:text-amber-400'
              }`}
            >
              {likedSet.has(comment.id) ? 'Liked' : 'Like'}
            </button>
            <button
              onClick={() => handleReplyClick(comment)}
              style={{ touchAction: 'manipulation' }}
              className="text-[11px] font-semibold text-amber-400 transition-colors hover:text-amber-300"
            >
              Reply
            </button>
            <span className="text-[10px] text-cinema-600">{comment.timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={sectionRef} className="mt-3 border-t border-white/5 pt-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleToggleOpen()}
          style={{ touchAction: 'manipulation' }}
          className="flex items-center gap-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white/90"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {allReplies.length} repl{allReplies.length !== 1 ? 'ies' : 'y'}
        </button>
        {statusLabel && (
          <div className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
            <div className={`h-2 w-2 rounded-full ${statusColor}`} />
            <span className="tracking-wide">{statusLabel}</span>
          </div>
        )}
      </div>

      {renderContent && (
        <div
          ref={contentRef}
          className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ maxHeight: open ? '2000px' : '0px', opacity: open ? 1 : 0 }}
        >
        <div className="mt-3">
          {allReplies.length > 0 ? (
            <div className="mb-3 flex flex-col">
              {topLevel.map((top) => {
                const childReplies = getReplies(top.id);
                const showInlineInput = replyingTo === top.id;
                return (
                  <div key={top.id}>
                    {renderComment(top, false)}
                    {childReplies.map((reply) => {
                      const replyHasNested = allReplies.some((r) => r.parentId === reply.id);
                      const showNestedInput = replyingTo === reply.id;
                      return (
                        <div key={reply.id}>
                          {renderComment(reply, true)}
                          {replyHasNested && allReplies
                            .filter((r) => r.parentId === reply.id)
                            .sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0))
                            .map((nested) => renderComment(nested, true))}
                          {showNestedInput && renderReplyInput(true)}
                        </div>
                      );
                    })}
                    {showInlineInput && renderReplyInput(true)}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mb-3 px-1 text-xs italic text-cinema-500">
              No replies yet. Be the first to respond.
            </p>
          )}

          {!replyingTo && (
            <div className="mt-3">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={textareaRef}
                  value={replyText}
                  onChange={(e) => { setReplyText(e.target.value.slice(0, MAX_CHARS)); autoResize(e.target); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                  placeholder="Write a reply..."
                  rows={1}
                  style={{ fontSize: '16px', touchAction: 'manipulation', height: '36px' }}
                  className="px-3 py-2 rounded-2xl bg-cinema-800 text-[13px] text-cinema-50 placeholder-cinema-500 outline-none flex-1 resize-none overflow-hidden"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!replyText.trim()}
                  style={{ touchAction: 'manipulation' }}
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                    replyText.trim() ? 'bg-amber-400 text-black' : 'cursor-not-allowed bg-cinema-800/50 text-cinema-600'
                  }`}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
}
