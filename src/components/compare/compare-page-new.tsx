'use client'

import { useState, useCallback, useRef } from 'react'
import type { HeadlineMetric, AIOpportunity } from '@/types'
import { SourceFooter } from '@/components/industry/source-footer'
import { CompareMetricCards } from './compare-metric-cards'
import { CompareOpportunities } from './compare-opportunities'
import { CompareVerdict, CompareDecision } from './compare-verdicts'
import { FeedbackBar } from '@/components/shared/feedback-bar'

interface CompareData {
  industryA: {
    name: string
    emoji: string
    oneLiner: string
    stage: string
    headlineMetrics: HeadlineMetric[]
    topPlayers: string[]
    aiOpportunities: AIOpportunity[]
  } | null
  industryB: {
    name: string
    emoji: string
    oneLiner: string
    stage: string
    headlineMetrics: HeadlineMetric[]
    topPlayers: string[]
    aiOpportunities: AIOpportunity[]
  } | null
  comparison: {
    marketSize: { verdict: string; winner: string }
    growthSpeed: { verdict: string; winner: string }
    aiReadiness: { verdict: string; winner: string }
    barrierHeight: { verdict: string; winner: string }
    overallVerdict: string
  }
  pickAReasons: string[]
  pickBReasons: string[]
  decisionMatrix: Record<string, { winner: string; reason: string }>
  sources: string[]
}

export function ComparePageNew() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [data, setData] = useState<CompareData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const mountedRef = useRef(true)

  const run = useCallback(async () => {
    if (!a.trim() || !b.trim()) return
    setData(null)
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industryA: a.trim(), industryB: b.trim() }),
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      if (!mountedRef.current) return
      setData(json.data)
    } catch (e: any) {
      if (!mountedRef.current) return
      setError(e.message ?? '未知错误')
    } finally {
      setLoading(false)
    }
  }, [a, b])

  const left = data?.industryA
  const right = data?.industryB

  return (
    <div className="max-w-[1160px] mx-auto px-[72px] py-14 max-[1100px]:px-9 max-[768px]:px-5">
      <h1 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] font-black text-ink mb-8">
        行业对比
      </h1>
      <p className="text-[0.95rem] text-warm-gray mb-10 max-w-[560px] leading-relaxed">
        输入任意两个行业，AI 自动生成 5 维度对比分析——核心数据、AI 机会、决策矩阵、选型建议，帮你在赛道选择上做出更明智的判断
      </p>

      {/* Inputs */}
      <div className="flex items-center gap-4 mb-10 max-[768px]:flex-col max-[768px]:items-stretch">
        <input
          value={a}
          onChange={(e) => setA(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="行业 A，如：新能源"
          className="flex-1 border border-rule-gray px-4 py-3 text-[0.88rem] outline-none bg-cream focus:border-crimson transition-colors font-sans"
        />
        <span className="font-serif text-[1.5rem] font-black text-crimson shrink-0">VS</span>
        <input
          value={b}
          onChange={(e) => setB(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="行业 B，如：半导体"
          className="flex-1 border border-rule-gray px-4 py-3 text-[0.88rem] outline-none bg-cream focus:border-crimson transition-colors font-sans"
        />
        <button
          onClick={run}
          disabled={loading || !a.trim() || !b.trim()}
          className="bg-crimson text-cream px-6 py-3 text-[0.82rem] font-semibold tracking-[0.04em] hover:bg-crimson-dark transition-colors cursor-pointer font-sans border-none disabled:opacity-50 shrink-0"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-cream rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-cream rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1.5 h-1.5 bg-cream rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              对比中…
            </span>
          ) : '对比分析'}
        </button>
      </div>

      {/* Loading */}
      {loading && !data && (
        <div className="text-center py-16 text-cool-gray text-sm">
          正在对比「{a.trim()}」和「{b.trim()}」，AI 正在生成深度分析…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="border-l-4 border-crimson bg-msg-ai px-5 py-3 text-sm text-ink mb-6">
          <strong>对比失败：</strong>{error}。请检查 API 配置或稍后重试。
        </div>
      )}

      {/* Results */}
      {data && left && right && (
        <div>
          {/* Header — two industry heroes side by side */}
          <div className="grid grid-cols-2 gap-6 mb-10 max-[768px]:grid-cols-1">
            <div className="border border-rule-light bg-white/60 p-6">
              <div className="text-2xl mb-2">{left.emoji}</div>
              <h2 className="font-serif text-[1.3rem] font-black text-ink mb-1.5">{left.name}</h2>
              <p className="text-[0.85rem] text-warm-gray leading-relaxed mb-3">{left.oneLiner}</p>
              {left.topPlayers.length > 0 && (
                <p className="text-[0.72rem] text-cool-gray">
                  代表玩家：{left.topPlayers.join(' / ')}
                </p>
              )}
            </div>
            <div className="border border-rule-light bg-white/60 p-6">
              <div className="text-2xl mb-2">{right.emoji}</div>
              <h2 className="font-serif text-[1.3rem] font-black text-ink mb-1.5">{right.name}</h2>
              <p className="text-[0.85rem] text-warm-gray leading-relaxed mb-3">{right.oneLiner}</p>
              {right.topPlayers.length > 0 && (
                <p className="text-[0.72rem] text-cool-gray">
                  代表玩家：{right.topPlayers.join(' / ')}
                </p>
              )}
            </div>
          </div>

          {/* Metrics */}
          <CompareMetricCards
            leftMetrics={left.headlineMetrics}
            rightMetrics={right.headlineMetrics}
            leftName={left.name}
            rightName={right.name}
          />

          {/* Verdict comparison */}
          <CompareVerdict
            comparison={data.comparison}
            leftName={left.name}
            rightName={right.name}
          />

          {/* AI Opportunities */}
          <CompareOpportunities
            leftOpps={left.aiOpportunities}
            rightOpps={right.aiOpportunities}
            leftName={left.name}
            rightName={right.name}
          />

          {/* Decision */}
          <CompareDecision
            pickAReasons={data.pickAReasons}
            pickBReasons={data.pickBReasons}
            decisionMatrix={data.decisionMatrix}
            leftName={left.name}
            rightName={right.name}
          />

          {/* Sources */}
          {data.sources.length > 0 && (
            <div className="py-4">
              <SourceFooter sources={data.sources} />
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 pt-4 border-t border-rule-light">
            <p className="text-[0.75rem] text-cool-gray">
              ⚠️ 以上内容由 AI 生成，数据仅供参考，请以官方来源为准。
            </p>
          </div>

          <FeedbackBar
            query={`compare:${a.trim().replace(/\s+/g, '-').toLowerCase()}:${b.trim().replace(/\s+/g, '-').toLowerCase()}`}
            cacheHit={false}
          />
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && !error && (
        <p className="text-[0.88rem] text-cool-gray text-center py-16">
          输入两个行业名称开始对比
        </p>
      )}
    </div>
  )
}
