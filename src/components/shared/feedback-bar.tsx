'use client'
import { useState } from 'react'
import { getAnonymousId } from '@/lib/anonymous-id'

interface FeedbackBarProps { query: string; cacheHit?: boolean }

export function FeedbackBar({ query, cacheHit = false }: FeedbackBarProps) {
  const [voted, setVoted] = useState<'up' | 'down' | null>(() => {
    if (typeof window === 'undefined') return null
    const previous = localStorage.getItem(`fb:${query}`)
    return previous === 'up' || previous === 'down' ? previous : null
  })
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleVote(rating: 'up' | 'down') {
    if (voted) return
    setVoted(rating)
    localStorage.setItem(`fb:${query}`, rating)
    if (rating === 'down') setShowComment(true)
    await fetch('/api/feedback', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, rating, anonymousId: getAnonymousId() }),
    })
  }

  async function submitComment() {
    if (!comment.trim()) return
    await fetch('/api/feedback', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, rating: 'down', comment: comment.trim(), anonymousId: getAnonymousId() }),
    })
    setSubmitted(true)
  }

  return (
    <div className="border-t border-rule-light pt-4 mt-6">
      {!voted ? (
        <div className="flex items-center gap-3">
          <span className="text-[0.78rem] text-cool-gray">这个分析对你有帮助吗？</span>
          <button onClick={() => handleVote('up')} className="text-[0.85rem] px-2 py-1 border border-rule-gray hover:border-green hover:text-green transition-colors bg-transparent cursor-pointer font-sans">👍</button>
          <button onClick={() => handleVote('down')} className="text-[0.85rem] px-2 py-1 border border-rule-gray hover:border-crimson hover:text-crimson transition-colors bg-transparent cursor-pointer font-sans">👎</button>
        </div>
      ) : (
        <div>
          <p className="text-[0.78rem] text-cool-gray mb-2">
            {voted === 'up' ? '👍 感谢反馈！' : '👎 感谢反馈，我们会优化分析质量。'}
          </p>
          {showComment && !submitted && (
            <div className="mt-3">
              <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="哪里不准确？（选填）" maxLength={200}
                className="w-full border border-rule-gray px-3 py-2 text-[0.82rem] font-sans outline-none bg-cream focus:border-crimson transition-colors resize-none h-16" />
              <button onClick={submitComment}
                className="mt-2 text-[0.78rem] text-crimson font-semibold border border-crimson px-3 py-1 hover:bg-crimson hover:text-cream transition-colors bg-transparent cursor-pointer font-sans">提交</button>
            </div>
          )}
        </div>
      )}
      {cacheHit && <p className="text-[0.65rem] text-cool-gray/60 mt-2">缓存结果 · 14天内生成</p>}
    </div>
  )
}
