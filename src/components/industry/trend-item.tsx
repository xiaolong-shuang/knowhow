import type { Trend } from '@/types'

interface TrendItemProps {
  trend: Trend
  index: number
}

export function TrendItem({ trend, index }: TrendItemProps) {
  return (
    <div className="flex gap-5 max-[768px]:flex-col max-[768px]:gap-3">
      <div className="text-[3rem] font-serif font-black text-rule-light leading-none shrink-0 w-[48px] max-[768px]:text-[2rem]">
        {(index + 1).toString().padStart(2, '0')}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-[1.05rem] font-bold text-ink mb-2">{trend.title}</h4>
        <p className="text-[0.85rem] text-warm-gray leading-relaxed mb-4">{trend.body}</p>
        <div className="border-l-[3px] border-crimson bg-parchment px-4 py-3 text-[0.82rem] text-warm-gray leading-relaxed">
          <span className="font-semibold text-ink">对 AI PM 意味着什么：</span>
          {trend.callout}
        </div>
      </div>
    </div>
  )
}
