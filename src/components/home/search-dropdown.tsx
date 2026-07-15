'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/events'
import { getAnonymousId } from '@/lib/anonymous-id'

interface SearchResult {
  slug: string
  name: string
  source: string
  score: number
  hasCache?: boolean
}

interface SearchDropdownProps {
  results: SearchResult[]
  query: string
  hasAIFallback: boolean
  onSelect: (result: SearchResult) => void
  onGenerateAI: () => void
  onClose: () => void
}

/**
 * 搜索结果下拉面板。显示本地匹配 + AI 推测的行业结果。
 * 点击面板外部自动关闭。
 */
export function SearchDropdown({
  results,
  query,
  hasAIFallback,
  onSelect,
  onGenerateAI,
  onClose,
}: SearchDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // 点击面板外部关闭
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [onClose])

  function handleSelect(result: SearchResult) {
    trackEvent({
      type: 'search_click',
      anonymousId: getAnonymousId(),
      payload: { query, clickedSlug: result.slug, clickedName: result.name }
    })
    onSelect(result)
  }

  if (results.length === 0) {
    return (
      <div
        ref={panelRef}
        className="absolute top-full left-0 right-0 mt-2 bg-cream border border-rule-gray shadow-[0_4px_16px_rgba(0,0,0,0.08)] z-50"
      >
        <div className="px-4 py-3 text-[0.82rem] text-cool-gray text-center">
          未找到匹配的行业
        </div>
        <div className="border-t border-rule-light" />
        <button
          onClick={onGenerateAI}
          className="w-full text-left px-4 py-2.5 text-[0.82rem] text-crimson font-semibold hover:underline cursor-pointer bg-transparent border-none font-sans"
        >
          用 AI 为「{query}」生成完整行业分析 →
        </button>
      </div>
    )
  }

  return (
    <div
      ref={panelRef}
      className="absolute top-full left-0 right-0 mt-2 bg-cream border border-rule-gray shadow-[0_4px_16px_rgba(0,0,0,0.08)] z-50"
    >
      {results.map((r, i) => (
        <button
          key={r.slug + r.source}
          onClick={() => handleSelect(r)}
          className={`w-full text-left px-4 py-2.5 flex items-center justify-between cursor-pointer bg-transparent border-none font-sans transition-colors hover:bg-warm-bg ${
            i > 0 ? 'border-t border-rule-light' : ''
          }`}
        >
          <span className="text-[0.85rem] text-ink font-medium">
            {r.name}
            {hasAIFallback && r.score === 50 && (
              <span className="ml-1.5 text-cool-gray/60 italic text-[0.65rem] font-normal">AI 推测</span>
            )}
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 border font-sans ${
              r.source === 'static' || r.source === 'card'
                ? 'text-crimson border-crimson'
                : 'text-cool-gray border-rule-gray'
            }`}
          >
            {r.source === 'static' ? '已收录' : r.source === 'card' ? '精选' : 'AI 可分析'}
            {r.hasCache && (
              <span className="text-green text-[0.65rem] ml-1">可缓存</span>
            )}
          </span>
        </button>
      ))}
      {/* 底部 AI 生成按钮 */}
      <div className="border-t border-rule-light" />
      <button
        onClick={onGenerateAI}
        className="w-full text-left px-4 py-2.5 text-[0.82rem] text-crimson font-semibold hover:underline cursor-pointer bg-transparent border-none font-sans"
      >
        用 AI 为「{query}」生成完整行业分析 →
      </button>
    </div>
  )
}
