'use client'

import type { HeadlineMetric } from '@/types'
import { TREND_LABELS } from '@/lib/utils'

interface CompareMetricCardsProps {
  leftMetrics: HeadlineMetric[]
  rightMetrics: HeadlineMetric[]
  leftName: string
  rightName: string
}

const TREND_COLOR: Record<string, string> = {
  up: 'text-green',
  down: 'text-crimson',
  flat: 'text-cool-gray',
}

// We pair left and right metrics by index.
// If lengths differ, we still render all — unmatched ones show alone.
// Each "pair" becomes one card with two sides.
export function CompareMetricCards({ leftMetrics, rightMetrics, leftName, rightName }: CompareMetricCardsProps) {
  const maxLen = Math.max(leftMetrics.length, rightMetrics.length)
  const pairs: { left: HeadlineMetric | null; right: HeadlineMetric | null }[] = []
  for (let i = 0; i < maxLen; i++) {
    pairs.push({ left: leftMetrics[i] ?? null, right: rightMetrics[i] ?? null })
  }

  return (
    <div className="mb-12">
      <h3 className="font-serif text-[1.15rem] font-bold text-ink mb-5">核心数据对比</h3>
      <div className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1">
        {pairs.map((pair, i) => (
          <div key={i} className="border border-rule-light bg-white/60 p-4">
            {/* Left side value */}
            <div className="mb-3">
              {pair.left ? (
                <>
                  <div className="font-serif text-[1.4rem] font-black leading-none text-ink">
                    {pair.left.value}{pair.left.unit && <span className="text-[0.8rem] font-normal text-warm-gray">{pair.left.unit}</span>}
                  </div>
                  <div className="text-[0.72rem] text-cool-gray mt-0.5">{pair.left.label}</div>
                </>
              ) : (
                <div className="text-[0.78rem] text-cool-gray/60 italic">—</div>
              )}
            </div>

            <div className="border-t border-rule-light my-2" />

            {/* Trend row: left name + trend | right name + trend */}
            <div className="flex justify-between items-start gap-1">
              <div className="min-w-0 flex-1">
                <div className="text-[0.65rem] text-cool-gray/60 truncate">{leftName}</div>
                {pair.left && (
                  <div className={`text-[0.68rem] font-semibold ${TREND_COLOR[pair.left.trend] ?? 'text-cool-gray'}`}>
                    {TREND_LABELS[pair.left.trend] ?? pair.left.trend}{' '}
                    {pair.left.source && <span className="font-normal text-cool-gray/70">· {pair.left.source}</span>}
                  </div>
                )}
              </div>
              <span className="text-[0.6rem] text-rule-gray shrink-0 pt-0.5">│</span>
              <div className="min-w-0 flex-1 text-right">
                <div className="text-[0.65rem] text-cool-gray/60 truncate">{rightName}</div>
                {pair.right ? (
                  <div className={`text-[0.68rem] font-semibold ${TREND_COLOR[pair.right.trend] ?? 'text-cool-gray'}`}>
                    {TREND_LABELS[pair.right.trend] ?? pair.right.trend}{' '}
                    {pair.right.source && <span className="font-normal text-cool-gray/70">· {pair.right.source}</span>}
                  </div>
                ) : (
                  <div className="text-[0.68rem] text-cool-gray/50 italic">—</div>
                )}
              </div>
            </div>

            {/* Right side value */}
            <div className="border-t border-rule-light my-2" />
            <div className="text-right">
              {pair.right ? (
                <>
                  <div className="font-serif text-[1.4rem] font-black leading-none text-ink">
                    {pair.right.value}{pair.right.unit && <span className="text-[0.8rem] font-normal text-warm-gray">{pair.right.unit}</span>}
                  </div>
                  <div className="text-[0.72rem] text-cool-gray mt-0.5">{pair.right.label}</div>
                </>
              ) : (
                <div className="text-[0.78rem] text-cool-gray/60 italic">—</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
