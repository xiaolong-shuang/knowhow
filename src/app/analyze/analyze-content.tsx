'use client'

import { useState, useCallback, useEffect } from 'react'
import type { IndustrySchema } from '@/types'
import { STAGE_LABELS } from '@/lib/utils'
import { useAnalyzeStore } from '@/stores/analyze'
import { getAnonymousId } from '@/lib/anonymous-id'
import { IndustryHero } from '@/components/industry/industry-hero'
import { L1Overview } from '@/components/industry/l1-overview'
import { L2Structure } from '@/components/industry/l2-structure'
import { L3Insights } from '@/components/industry/l3-insights'
import { QuizSection } from '@/components/industry/quiz-section'
import { SourceFooter } from '@/components/industry/source-footer'
import { FeedbackBar } from '@/components/shared/feedback-bar'
import { Rule } from '@/components/ui/rule'
import { SectionTabs } from '@/components/layout/section-tabs'
import { Breadcrumb } from '@/components/ui/breadcrumb'

interface Props {
  initialQuery: string
}

type Phase = 'idle' | 'generating' | 'done' | 'error'

const SECTION_TABS = [
  { id: 'l1-overview', label: 'L1 概览' },
  { id: 'l2-structure', label: 'L2 结构' },
  { id: 'l3-insights', label: 'L3 洞察' },
  { id: 'quiz', label: '测验' },
]

const PHASES = [
  { key: 'l1', label: 'L1 概览数据' },
  { key: 'l2', label: 'L2 产业链结构' },
  { key: 'l3', label: 'L3 深度洞察' },
  { key: 'quiz', label: '知识测验' },
]

export function AnalyzeContent({ initialQuery }: Props) {
  const [q, setQ] = useState(initialQuery)
  const [phase, setPhase] = useState<Phase>('idle')
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [data, setData] = useState<IndustrySchema | null>(null)
  const [error, setError] = useState('')
  const [isFallback, setIsFallback] = useState(false)
  const [cacheHit, setCacheHit] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const setAnalyzeData = useAnalyzeStore((s) => s.setData)

  const run = useCallback(async (industry: string) => {
    if (!industry.trim()) return
    setQ(industry.trim())
    setData(null)
    setError('')
    setPhase('generating')
    setPhaseIndex(0)
    setIsFallback(false)
    setHasStarted(true)

    // Progress animation
    const progressTimer = setInterval(() => {
      setPhaseIndex((prev) => Math.min(prev + 1, PHASES.length - 1))
    }, 2500)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: industry.trim(), anonymousId: getAnonymousId() }),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(errBody.error ?? `API error ${res.status}`)
      }

      const json = await res.json()

      if (json.error) throw new Error(json.error)

      const parsed = json.data as IndustrySchema
      setData(parsed)
      setAnalyzeData(parsed)
      if (json.fallback) setIsFallback(true)
      if (json.cacheHit) setCacheHit(true)
      setPhase('done')
      setPhaseIndex(PHASES.length)
    } catch (e: any) {
      setError(e.message ?? '未知错误')
      setPhase('error')
    } finally {
      clearInterval(progressTimer)
    }
  }, [])

  // Auto-start on mount — only once
  useEffect(() => {
    if (initialQuery && !hasStarted) {
      setHasStarted(true)
      setPhase('generating')
      run(initialQuery)
    }
  }, [initialQuery, hasStarted, run])

  if (!hasStarted && !initialQuery) {
    // Empty state — no query at all
    return (
      <div className="max-w-[860px] mx-auto px-5 py-12">
        <div className="text-[0.78rem] text-cool-gray mb-8 font-sans">
          <a href="/" className="hover:text-crimson transition-colors">首页</a>
          <span className="mx-2">/</span>
          <span className="text-ink">AI 行业分析</span>
        </div>
        <div className="text-center py-20">
          <h1 className="font-serif text-[2rem] font-black mb-4">AI 行业分析</h1>
          <p className="text-warm-gray mb-8">
            输入任意行业名称，AI 自动生成 L1/L2/L3 三层深度分析
          </p>
          <AnalzeForm initial="" onSubmit={run} loading={false} />
        </div>
      </div>
    )
  }

  if (q && data && phase === 'done') {
    /* === Rendered Result === */
    return (
      <>
        <Breadcrumb
          items={[
            { label: '首页', href: '/' },
            { label: 'AI 分析', href: '/analyze' },
            { label: data.name },
          ]}
        />

        <IndustryHero
          name={data.name}
          stage={STAGE_LABELS[data.stage] ?? data.stage}
          heroDeck={data.heroDeck}
          heroHook={data.heroHook}
        />

        <SectionTabs tabs={SECTION_TABS} />

        <div className="max-w-[1160px] mx-auto px-[72px] max-[1100px]:px-9 max-[768px]:px-5 py-3 bg-cream/95 border-b border-rule-light">
          <AnalzeForm initial={q} onSubmit={run} loading={false} compact />
        </div>

        <div className="max-w-[1160px] mx-auto px-[72px] max-[1100px]:px-9 max-[768px]:px-5">
          {isFallback && (
            <div className="border-l-4 border-amber-400 bg-amber-50 px-5 py-3 text-sm text-ink mb-6">
              ⚠️ 当前为降级模式：未检测到有效的 LLM API Key。请在 <code className="bg-amber-100 px-1">.env.local</code> 中配置 <code className="bg-amber-100 px-1">LLM_PROVIDER</code> 和 <code className="bg-amber-100 px-1">LLM_API_KEY</code> 后重新分析。
            </div>
          )}

          {cacheHit && (
            <p className="text-[0.7rem] text-cool-gray mb-3 border border-rule-light bg-warm-bg/50 px-3 py-1.5 inline-block">
              ⚡ 缓存命中 · 该分析在 14 天内生成，无需重新调用 AI
            </p>
          )}

          {data.headlineMetrics.length > 0 && (
            <>
              <section id="l1-overview">
                <L1Overview oneLiner={data.oneLiner} headlineMetrics={data.headlineMetrics} />
              </section>
              <Rule />
            </>
          )}

          <section id="l2-structure">
            <L2Structure valueChain={data.valueChain} playerCategories={data.playerCategories} />
          </section>

          <Rule />

          <section id="l3-insights">
            <L3Insights
              aiOpportunities={data.aiOpportunities}
              portersFive={data.portersFive}
              trends={data.trends}
              myths={data.myths}
            />
          </section>

          {data.quiz.length > 0 && (
            <>
              <Rule />
              <section id="quiz">
                <QuizSection quiz={data.quiz} />
              </section>
            </>
          )}

          <Rule />

          <SourceFooter sources={data.sources} />

          <FeedbackBar query={q} cacheHit={cacheHit} />

          <div className="mt-8 pt-6 border-t border-rule-light mb-12">
            <div className="text-[0.75rem] text-cool-gray mb-4">
              ⚠️ 以上内容由 AI 生成，数据仅供参考，请以官方来源为准。
            </div>
            <AnalzeForm initial={q} onSubmit={run} loading={false} />
          </div>
        </div>
      </>
    )
  }

  /* === Loading / error state === */
  return (
    <div className="max-w-[860px] mx-auto px-5 py-12">
      <div className="text-[0.78rem] text-cool-gray mb-8 font-sans">
        <a href="/" className="hover:text-crimson transition-colors">首页</a>
        <span className="mx-2">/</span>
        <span className="text-ink">AI 行业分析</span>
        {q && <><span className="mx-2">/</span><span className="text-crimson font-semibold">{q}</span></>}
      </div>

      <div className="mb-10">
        <h1 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] font-black text-ink mb-2">
          {q || '...'} 行业深度分析
        </h1>
        <p className="text-[0.88rem] text-cool-gray">
          由 AI 自动生成 · L1 概览 → L2 结构 → L3 洞察
        </p>
      </div>

      {/* Progress indicator */}
      {phase === 'generating' && (
        <div className="py-10">
          <p className="text-[0.82rem] font-semibold text-ink mb-6 font-serif">
            AI 正在分析「{q}」行业，请稍候…
          </p>
          <div className="space-y-3">
            {PHASES.map((p, i) => {
              let state: 'done' | 'active' | 'pending' = 'pending'
              if (i < phaseIndex) state = 'done'
              else if (i === phaseIndex) state = 'active'
              return (
                <div key={p.key} className="flex items-center gap-3">
                  {state === 'done' ? (
                    <span className="w-6 h-6 flex items-center justify-center bg-green/10 text-green text-xs rounded-full shrink-0">✓</span>
                  ) : state === 'active' ? (
                    <span className="w-6 h-6 flex items-center justify-center shrink-0">
                      <span className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 bg-crimson rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-crimson rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-1.5 h-1.5 bg-crimson rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </span>
                    </span>
                  ) : (
                    <span className="w-6 h-6 flex items-center justify-center border border-rule-light rounded-full text-[0.65rem] text-cool-gray/40 shrink-0">{i + 1}</span>
                  )}
                  <span className={
                    state === 'done' ? 'text-[0.85rem] text-green font-medium' :
                    state === 'active' ? 'text-[0.85rem] text-crimson font-semibold' :
                    'text-[0.85rem] text-cool-gray/60'
                  }>
                    {p.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Error */}
      {phase === 'error' && (
        <>
          <div className="border-l-4 border-crimson bg-msg-ai px-5 py-3 text-sm text-ink mb-6">
            <strong>分析失败：</strong>{error}。请检查 API 配置或稍后重试。
          </div>
          <div className="mt-8">
            <AnalzeForm initial={q} onSubmit={run} loading={false} />
          </div>
        </>
      )}
    </div>
  )
}

function AnalzeForm({ initial, onSubmit, loading, compact }: { initial: string; onSubmit: (v: string) => void; loading: boolean; compact?: boolean }) {
  const [v, setV] = useState(initial)
  return (
    <div className={`flex items-center gap-2 ${compact ? 'justify-end' : ''}`}>
      {compact && <span className="text-[0.78rem] text-cool-gray mr-1">换一个行业：</span>}
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && v.trim() && onSubmit(v.trim())}
        placeholder={compact ? '输入行业名…' : '输入行业名称，如：新能源、半导体、跨境电商…'}
        className={compact
          ? 'w-[160px] border border-rule-gray px-2.5 py-1.5 text-[0.78rem] outline-none bg-cream focus:border-crimson transition-colors font-sans'
          : 'flex-1 border border-rule-gray px-4 py-2.5 text-sm outline-none bg-cream focus:border-crimson transition-colors font-sans'
        }
      />
      <button
        onClick={() => v.trim() && onSubmit(v.trim())}
        disabled={loading || !v.trim()}
        className={compact
          ? 'bg-crimson text-cream px-3 py-1.5 text-[0.75rem] font-semibold tracking-[0.04em] hover:bg-crimson-dark transition-colors cursor-pointer font-sans border-none disabled:opacity-50'
          : 'bg-crimson text-cream px-5 py-2.5 text-[0.82rem] font-semibold tracking-[0.04em] hover:bg-crimson-dark transition-colors cursor-pointer font-sans border-none disabled:opacity-50'
        }
      >
        {loading ? '...' : '分析'}
      </button>
    </div>
  )
}
