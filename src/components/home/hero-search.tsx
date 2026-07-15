'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getAnonymousId } from '@/lib/anonymous-id'
import { SearchDropdown } from './search-dropdown'

interface SearchResult {
  slug: string
  name: string
  source: string
  score: number
  hasCache?: boolean
}

export function HeroSearch() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasAIFallback, setHasAIFallback] = useState(false)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  // 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(text.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [text])

  // debouncedQuery 变化时 → 调用搜索 API
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      setShowDropdown(false)
      return
    }
    setLoading(true)
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&anonymousId=${getAnonymousId()}`)
      .then(async (res) => {
        const data = await res.json()
        setResults(data.results ?? [])
        setHasAIFallback(data.hasAIFallback ?? false)
        setShowDropdown(true)
      })
      .catch(() => {
        setResults([])
        setShowDropdown(false)
      })
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  const handleSelect = useCallback((result: SearchResult) => {
    setShowDropdown(false)
    if (result.hasCache) {
      router.push(`/analysis/${result.slug}`)
    } else if (result.source === 'static' || result.source === 'card') {
      router.push(`/industry/${result.slug}`)
    } else {
      router.push(`/analyze?q=${encodeURIComponent(result.name)}`)
    }
  }, [router])

  const handleGenerateAI = useCallback(() => {
    setShowDropdown(false)
    const q = text.trim() || debouncedQuery
    if (q) {
      router.push(`/analyze?q=${encodeURIComponent(q)}`)
    }
  }, [text, debouncedQuery, router])

  function submit() {
    const q = text.trim()
    if (!q || loading) return
    setShowDropdown(false)
    router.push(`/analyze?q=${encodeURIComponent(q)}`)
  }

  function handleClose() {
    setShowDropdown(false)
  }

  return (
    <div className="flex justify-center mt-8">
      <div ref={containerRef} className="relative w-[480px] max-w-[90vw]">
        <div className="inline-flex items-center border-b-2 border-rule-gray px-1 py-2 w-full transition-colors focus-within:border-crimson">
          <span className="text-cool-gray text-base mr-2 shrink-0">
            {loading ? (
              <span className="inline-flex gap-0.5">
                <span className="w-1.5 h-1.5 bg-crimson rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-crimson rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-1.5 h-1.5 bg-crimson rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </span>
            ) : (
              '🔍'
            )}
          </span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
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

        {/* 搜索结果下拉面板 */}
        {showDropdown && (
          <SearchDropdown
            results={results}
            query={debouncedQuery}
            hasAIFallback={hasAIFallback}
            onSelect={handleSelect}
            onGenerateAI={handleGenerateAI}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  )
}
