import { kvGet, isKVEnabled } from '@/lib/kv'
import type { Metadata } from 'next'
import { STAGE_LABELS } from '@/lib/utils'
import { IndustryHero } from '@/components/industry/industry-hero'
import { L1Overview } from '@/components/industry/l1-overview'
import { L2Structure } from '@/components/industry/l2-structure'
import { L3Insights } from '@/components/industry/l3-insights'
import { QuizSection } from '@/components/industry/quiz-section'
import { SourceFooter } from '@/components/industry/source-footer'
import { FeedbackBar } from '@/components/shared/feedback-bar'

export const revalidate = 3600
export const dynamicParams = true

interface AnalysisPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: AnalysisPageProps): Promise<Metadata> {
  const { slug } = await params
  const cached = await kvGet<{ data: { name?: string; oneLiner?: string } }>(`cache:${slug}`)
  if (!cached) return { title: '分析未找到 · KnowHow' }
  const d = cached.data
  return {
    title: `${d.name ?? slug} · KnowHow 行业分析`,
    description: d.oneLiner ?? 'AI 生成的行业深度分析报告',
    openGraph: {
      title: `${d.name ?? slug} · KnowHow 行业分析`,
      description: d.oneLiner ?? '',
      type: 'article',
    },
  }
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { slug } = await params
  const cached = await kvGet<{ data: any; timestamp: number }>(`cache:${slug}`)

  // 缓存不存在 → 降级页（不用 notFound()，防止 ISR 永久 404）
  if (!cached) {
    return (
      <div className="max-w-[1160px] mx-auto px-[72px] py-24 text-center max-[768px]:px-5">
        <h1 className="font-serif text-[2rem] font-black text-ink mb-4">分析正在生成中</h1>
        <p className="text-warm-gray mb-6">该行业分析尚未缓存或正在重新生成。</p>
        <a href={`/analyze?q=${encodeURIComponent(slug)}`}
           className="text-crimson font-semibold hover:underline">
          通过首页搜索获取最新分析 →
        </a>
      </div>
    )
  }

  const industry = cached.data
  const upvotes = await kvGet<number>(`feedback:${slug}:upvotes`).then(v => v ?? 0)
  const downvotes = await kvGet<number>(`feedback:${slug}:downvotes`).then(v => v ?? 0)
  const rating = upvotes + downvotes > 0 ? Math.round((upvotes / (upvotes + downvotes)) * 100) : null
  const isVerified = rating !== null && rating >= 80 && upvotes >= 3

  return (
    <div className="max-w-[1160px] mx-auto px-[72px] max-[1100px]:px-9 max-[768px]:px-5">
      {isVerified && (
        <div className="bg-green/5 border border-green/30 text-green text-[0.78rem] px-4 py-2 mt-6 mb-2">
          社区验证 · 好评率 {rating}%（{upvotes} 人认可）
        </div>
      )}
      {!isVerified && isKVEnabled() && (
        <div className="bg-amber/5 border border-amber/30 text-amber text-[0.78rem] px-4 py-2 mt-6 mb-2">
          AI 生成内容 · 仅供参考 ·{' '}
          <a href={`/analyze?q=${encodeURIComponent(industry.name ?? slug)}`} className="underline">
            查看最新分析
          </a>
        </div>
      )}
      <IndustryHero
        name={industry.name ?? slug}
        stage={STAGE_LABELS[industry.stage] ?? industry.stage ?? '成长中期'}
        heroDeck={industry.heroDeck ?? ''}
        heroHook={industry.heroHook ?? ''}
      />
      <hr className="border-rule-gray" />
      <L1Overview oneLiner={industry.oneLiner ?? ''} headlineMetrics={industry.headlineMetrics ?? []} />
      <hr className="border-rule-gray" />
      <L2Structure valueChain={industry.valueChain} playerCategories={industry.playerCategories ?? []} />
      <hr className="border-rule-gray" />
      <L3Insights
        aiOpportunities={industry.aiOpportunities ?? []}
        portersFive={industry.portersFive ?? []}
        trends={industry.trends ?? []}
        myths={industry.myths ?? []}
      />
      {industry.quiz && industry.quiz.length > 0 && (
        <>
          <hr className="border-rule-gray" />
          <QuizSection quiz={industry.quiz} />
        </>
      )}
      <SourceFooter sources={industry.sources ?? []} />
      {/* 反馈条——query 用 slug（=缓存键），与 feedback API 归一化后一致，
          保证 promote 升级候选页能读到这些反馈 */}
      <FeedbackBar query={slug} cacheHit />
    </div>
  )
}
