import type { IndustryCard as IndustryCardType } from '@/types'
import { IndustryCard } from './industry-card'

interface IndustryGridProps {
  industries: IndustryCardType[]
}

export function IndustryGrid({ industries }: IndustryGridProps) {
  // Separate live and upcoming industries so "coming soon" always appear last
  const live = industries.filter((i) => i.status === 'live')
  const upcoming = industries.filter((i) => i.status === 'coming_soon')

  // Build sorted list: live first, then coming_soon
  const sorted = [...live, ...upcoming]

  return (
    <>
      <h2 className="text-[0.84rem] font-semibold tracking-[0.08em] text-cool-gray uppercase text-center mb-7">
        浏览行业 ({live.length} 个可查看)
      </h2>
      <div className="grid grid-cols-3 gap-px bg-rule-gray border border-rule-gray max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1">
        {sorted.map((ind) => (
          <IndustryCard key={ind.slug} industry={ind} />
        ))}
      </div>
    </>
  )
}
