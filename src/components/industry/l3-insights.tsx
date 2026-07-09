import type { AIOpportunity, PortersForce, Trend, Myth } from '@/types'
import { SectionBlock, SectionBlockLabelRow } from '@/components/ui/section-block'
import { SectionLabel } from '@/components/ui/section-label'
import { MetricBar } from '@/components/industry/metric-bar'
import { TrendItem } from '@/components/industry/trend-item'
import { VERDICT_STYLES } from '@/lib/utils'

interface L3InsightsProps {
  aiOpportunities: AIOpportunity[]
  portersFive: PortersForce[]
  trends: Trend[]
  myths: Myth[]
}

export function L3Insights({ aiOpportunities, portersFive, trends, myths }: L3InsightsProps) {
  return (
    <SectionBlock>
      <SectionBlockLabelRow>
        <SectionLabel>L3 · 深度洞察</SectionLabel>
      </SectionBlockLabelRow>

      {/* AI Opportunity Matrix */}
      <div className="mt-8 mb-12">
        <h3 className="font-serif text-[1.15rem] font-bold text-ink mb-5">AI 机会矩阵</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.82rem]">
            <thead>
              <tr className="border-b border-rule-gray text-cool-gray text-[0.72rem] uppercase tracking-[0.06em]">
                <th className="text-left py-3 pr-4 font-semibold">机会领域</th>
                <th className="text-center py-3 px-3 font-semibold w-[120px]">成熟度</th>
                <th className="text-center py-3 px-3 font-semibold w-[120px]">天花板</th>
                <th className="text-left py-3 pl-4 font-semibold w-[110px]">判断</th>
              </tr>
            </thead>
            <tbody>
              {aiOpportunities.map((opp, i) => {
                const verdict = VERDICT_STYLES[opp.verdict] ?? { label: opp.verdict, color: 'text-cool-gray' }
                return (
                  <tr key={i} className="border-b border-rule-light hover:bg-parchment/50 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-ink">{opp.title}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 justify-center">
                        <MetricBar score={opp.maturityScore} />
                        <span className="text-[0.72rem] text-cool-gray w-6">{opp.maturityScore}/5</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 justify-center">
                        <MetricBar score={opp.valueCeilingScore} />
                        <span className="text-[0.72rem] text-cool-gray w-6">{opp.valueCeilingScore}/5</span>
                      </div>
                    </td>
                    <td className={`py-3 pl-4 text-[0.78rem] font-semibold ${verdict.color}`}>
                      {verdict.label}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Porter Five Forces */}
      <div className="mb-12">
        <h3 className="font-serif text-[1.15rem] font-bold text-ink mb-5">波特五力模型</h3>
        <div className="grid grid-cols-5 gap-4 max-[1100px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
          {portersFive.map((force, i) => (
            <div key={i} className="border border-rule-light bg-white/60 p-5">
              <h4 className="font-serif text-[0.88rem] font-bold text-ink mb-3">{force.force}</h4>
              <div className="flex items-center gap-2 mb-3">
                <MetricBar score={force.intensity} />
                <span className="text-[0.72rem] text-cool-gray">{force.intensity}/5</span>
              </div>
              <p className="text-[0.78rem] text-warm-gray leading-relaxed">{force.rationale}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trends */}
      <div className="mb-12">
        <h3 className="font-serif text-[1.15rem] font-bold text-ink mb-5">趋势信号</h3>
        <div className="space-y-8">
          {trends.map((t, i) => (
            <TrendItem key={i} trend={t} index={i} />
          ))}
        </div>
      </div>

      {/* Myths */}
      <div>
        <h3 className="font-serif text-[1.15rem] font-bold text-ink mb-5">常见误区</h3>
        <div className="grid grid-cols-3 gap-5 max-[768px]:grid-cols-1">
          {myths.map((m, i) => (
            <div key={i} className="border border-rule-light bg-white/60 p-5">
              <p className="text-[0.85rem] font-semibold text-crimson mb-2 leading-snug">
                「{m.myth}」
              </p>
              <p className="text-[0.8rem] text-warm-gray leading-relaxed">{m.reality}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionBlock>
  )
}
