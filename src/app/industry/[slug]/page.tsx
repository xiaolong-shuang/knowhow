import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getIndustrySchema, getLiveIndustrySlugs } from '@/lib/content'
import { STAGE_LABELS } from '@/lib/utils'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Rule } from '@/components/ui/rule'
import { SectionTabs } from '@/components/layout/section-tabs'
import { IndustryHero } from '@/components/industry/industry-hero'
import { L1Overview } from '@/components/industry/l1-overview'
import { L2Structure } from '@/components/industry/l2-structure'
import { L3Insights } from '@/components/industry/l3-insights'
import { QuizSection } from '@/components/industry/quiz-section'
import { SourceFooter } from '@/components/industry/source-footer'

interface IndustryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getLiveIndustrySlugs().map((slug) => ({ slug }))
}

export const dynamicParams = false // 404 on unknown slugs

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const industry = await getIndustrySchema(slug)
    return {
      title: `${industry.emoji} ${industry.name} · KnowHow 行业深度`,
      description: industry.oneLiner,
      openGraph: {
        title: `${industry.name} · KnowHow 行业深度分析`,
        description: industry.oneLiner,
        type: 'article',
        publishedTime: new Date().toISOString().split('T')[0],
      },
    }
  } catch {
    return { title: '行业未找到 · KnowHow' }
  }
}

const SECTION_TABS = [
  { id: 'l1-overview', label: 'L1 概览' },
  { id: 'l2-structure', label: 'L2 结构' },
  { id: 'l3-insights', label: 'L3 洞察' },
  { id: 'quiz', label: '测验' },
]

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params

  let industry
  try {
    industry = await getIndustrySchema(slug)
  } catch {
    notFound()
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: '首页', href: '/' },
          { label: industry.name },
        ]}
      />

      <IndustryHero
        name={industry.name}
        stage={STAGE_LABELS[industry.stage]}
        heroDeck={industry.heroDeck}
        heroHook={industry.heroHook}
      />

      <SectionTabs tabs={SECTION_TABS} />

      <div className="max-w-[1160px] mx-auto px-[72px] max-[1100px]:px-9 max-[768px]:px-5">
        <section id="l1-overview">
          <L1Overview
            oneLiner={industry.oneLiner}
            headlineMetrics={industry.headlineMetrics}
          />
        </section>

        <Rule />

        <section id="l2-structure">
          <L2Structure
            valueChain={industry.valueChain}
            playerCategories={industry.playerCategories}
          />
        </section>

        <Rule />

        <section id="l3-insights">
          <L3Insights
            aiOpportunities={industry.aiOpportunities}
            portersFive={industry.portersFive}
            trends={industry.trends}
            myths={industry.myths}
          />
        </section>

        <Rule />

        <section id="quiz">
          <QuizSection quiz={industry.quiz} />
        </section>

        <Rule />

        <SourceFooter sources={industry.sources} />
      </div>
    </>
  )
}
