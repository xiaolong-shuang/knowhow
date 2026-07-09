'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function HeroSearch() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function submit() {
    const q = text.trim()
    if (!q || loading) return
    setLoading(true)
    router.push(`/analyze?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="flex justify-center mt-8">
      <div className="inline-flex items-center border-b-2 border-rule-gray px-1 py-2 w-[480px] max-w-[90vw] transition-colors focus-within:border-crimson">
        <span className="text-cool-gray text-base mr-2 shrink-0">🔍</span>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="输入任意行业名称，AI 自动生成深度分析…"
          className="flex-1 border-none bg-transparent text-[0.95rem] text-ink outline-none font-sans placeholder:text-rule-gray"
          autoFocus
        />
        <button
          onClick={submit}
          disabled={loading}
          className="shrink-0 bg-crimson text-cream px-4 py-1.5 text-[0.78rem] font-semibold tracking-[0.04em] hover:bg-crimson-dark transition-colors cursor-pointer font-sans border-none ml-2"
        >
          {loading ? '...' : '分析'}
        </button>
      </div>
    </div>
  )
}
