import Link from 'next/link'
import type { IndustryCard as IndustryCardType } from '@/types'
import { Tag } from '@/components/ui/tag'

interface IndustryCardProps {
  industry: IndustryCardType
}

export function IndustryCard({ industry }: IndustryCardProps) {
  if (industry.status === 'coming_soon') {
    return (
      <div className="bg-cream p-8 opacity-50 pointer-events-none">
        <div className="text-2xl mb-3.5">{industry.emoji}</div>
        <h3 className="font-serif text-xl font-bold mb-1.5">{industry.name}</h3>
        <p className="text-[0.82rem] text-cool-gray leading-relaxed line-clamp-2">{industry.description}</p>
        <div className="mt-3.5 flex gap-3 flex-wrap">
          <Tag label="即将上线" />
        </div>
      </div>
    )
  }

  return (
    <Link
      href={`/industry/${industry.slug}`}
      className="block bg-cream p-8 transition-all duration-250 hover:bg-parchment hover:-translate-y-0.5 group relative overflow-hidden"
    >
      <div className="text-2xl mb-3.5">{industry.emoji}</div>
      <h3 className="font-serif text-xl font-bold mb-1.5">{industry.name}</h3>
      <p className="text-[0.82rem] text-cool-gray leading-relaxed line-clamp-2">{industry.description}</p>
      <div className="mt-3.5 flex gap-3 flex-wrap">
        {industry.tags.map((tag, i) => (
          <Tag key={i} label={tag.label} variant={tag.variant} />
        ))}
      </div>
      <span className="absolute bottom-5 right-7 text-[0.72rem] font-semibold text-crimson tracking-[0.04em] opacity-0 group-hover:opacity-100 transition-opacity">
        查看详情 →
      </span>
    </Link>
  )
}
