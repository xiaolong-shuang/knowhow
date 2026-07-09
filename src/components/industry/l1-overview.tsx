import type { HeadlineMetric } from '@/types'
import { SectionBlock, SectionBlockIntro, SectionBlockLabelRow } from '@/components/ui/section-block'
import { SectionLabel } from '@/components/ui/section-label'
import { BigNumberCard } from '@/components/industry/big-number-card'

interface L1OverviewProps {
  oneLiner: string
  headlineMetrics: HeadlineMetric[]
}

export function L1Overview({ oneLiner, headlineMetrics }: L1OverviewProps) {
  return (
    <SectionBlock>
      <SectionBlockLabelRow>
        <SectionLabel>L1 · 宏观概览</SectionLabel>
      </SectionBlockLabelRow>
      <SectionBlockIntro>{oneLiner}</SectionBlockIntro>
      <div className="grid grid-cols-5 gap-6 mt-10 max-[1100px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
        {headlineMetrics.map((m, i) => (
          <BigNumberCard key={i} metric={m} />
        ))}
      </div>
    </SectionBlock>
  )
}
