'use client'

import { useState } from 'react'
import type { HeadlineMetric } from '@/types'
import { cn, TREND_LABELS } from '@/lib/utils'

interface BigNumberCardProps {
  metric: HeadlineMetric
}

export function BigNumberCard({ metric }: BigNumberCardProps) {
  const [expanded, setExpanded] = useState(false)

  const trendColor =
    metric.trend === 'up' ? 'text-green' : metric.trend === 'down' ? 'text-crimson' : 'text-cool-gray'

  return (
    <div
      className={cn(
        'group cursor-pointer border border-rule-light bg-white/60 p-5 transition-all hover:border-crimson/40',
        expanded && 'border-crimson/60 bg-parchment'
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="font-serif text-[2rem] font-black leading-none tracking-[-0.02em] text-ink max-[768px]:text-[1.6rem]">
        {metric.value}
        {metric.unit && (
          <span className="text-[1.1rem] font-normal ml-0.5 text-warm-gray">{metric.unit}</span>
        )}
      </div>
      <p className="text-[0.8rem] text-warm-gray mt-2 leading-snug">{metric.label}</p>
      <hr className="border-rule-gray border-t my-3" />
      <div className="flex items-center justify-between text-[0.72rem]">
        <span className={cn('font-semibold', trendColor)}>{TREND_LABELS[metric.trend]}</span>
        {metric.growthRate != null && (
          <span className="text-cool-gray">{metric.growthRate > 0 ? '+' : ''}{(metric.growthRate * 100).toFixed(0)}%</span>
        )}
      </div>
      <p className="text-[0.68rem] text-cool-gray/70 mt-1">{metric.source}</p>

      <div
        className={cn(
          'grid transition-all duration-200',
          expanded ? 'grid-rows-[1fr] mt-3 opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <p className="text-[0.78rem] text-warm-gray leading-relaxed pt-2 border-t border-rule-light">
            {metric.insight}
          </p>
        </div>
      </div>
    </div>
  )
}
