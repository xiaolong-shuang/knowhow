'use client'

import type { AIOpportunity } from '@/types'
import { MetricBar } from '@/components/industry/metric-bar'
import { VERDICT_STYLES } from '@/lib/utils'

interface CompareOpportunitiesProps {
  leftOpps: AIOpportunity[]
  rightOpps: AIOpportunity[]
  leftName: string
  rightName: string
}

export function CompareOpportunities({ leftOpps, rightOpps, leftName, rightName }: CompareOpportunitiesProps) {
  return (
    <div className="mb-12">
      <h3 className="font-serif text-[1.15rem] font-bold text-ink mb-5">AI 机会矩阵对比</h3>
      <div className="grid grid-cols-2 gap-5 max-[768px]:grid-cols-1">
        {[
          { name: leftName, opps: leftOpps },
          { name: rightName, opps: rightOpps },
        ].map((col, ci) => (
          <div key={ci}>
            <h4 className="text-[0.85rem] font-bold text-ink mb-3 pb-2 border-b border-rule-light">{col.name}</h4>
            {col.opps.length === 0 ? (
              <p className="text-[0.78rem] text-cool-gray">暂无数据</p>
            ) : (
              <div className="space-y-2.5">
                {col.opps.map((opp, i) => {
                  const verdict = VERDICT_STYLES[opp.verdict] ?? { label: opp.verdict, color: 'text-cool-gray' }
                  return (
                    <div key={i} className="border border-rule-light bg-white/60 p-3">
                      <div className="text-[0.82rem] font-semibold text-ink mb-1.5">{opp.title}</div>
                      <div className="flex items-center gap-3 text-[0.7rem]">
                        <span className="flex items-center gap-1">
                          <span className="text-cool-gray">成熟度</span>
                          <MetricBar score={opp.maturityScore} />
                          <span>{opp.maturityScore}/5</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-cool-gray">天花板</span>
                          <MetricBar score={opp.valueCeilingScore} />
                          <span>{opp.valueCeilingScore}/5</span>
                        </span>
                        <span className={`font-semibold ${verdict.color} ml-auto`}>{verdict.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
