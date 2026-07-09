import type { ValueChain, ValueChainLayer } from '@/types'
import { AI_PENETRATION_LABELS } from '@/lib/utils'

interface ValueChainMapProps {
  valueChain: ValueChain
}

function LayerColumn({ layer }: { layer: ValueChainLayer }) {
  const penBadge =
    layer.aiPenetration === 'very_high' || layer.aiPenetration === 'high'
      ? 'bg-crimson/10 text-crimson'
      : 'bg-cool-gray/10 text-cool-gray'

  return (
    <div className="flex-1 min-w-0 border border-rule-light bg-white/60 p-5 hover:border-crimson/40 transition-colors">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <h4 className="font-serif text-[0.95rem] font-bold text-ink">{layer.name}</h4>
        <span className={`text-[0.64rem] font-semibold px-2 py-0.5 rounded ${penBadge}`}>
          AI渗透: {AI_PENETRATION_LABELS[layer.aiPenetration]}
        </span>
      </div>
      <ul className="space-y-3 mb-4">
        {layer.nodes.map((node, i) => (
          <li key={i} className="text-[0.82rem] text-warm-gray leading-snug flex justify-between gap-2">
            <span>{node.name}</span>
            <span className="text-ink font-semibold shrink-0">{node.valueShare}%</span>
          </li>
        ))}
      </ul>
      {(() => {
        const minMargin = Math.min(...layer.nodes.map((n) => n.marginRange[0]))
        const maxMargin = Math.max(...layer.nodes.map((n) => n.marginRange[1]))
        return (
          <div className="text-[0.72rem] text-cool-gray pt-3 border-t border-rule-light">
            毛利率: {minMargin}–{maxMargin}%
          </div>
        )
      })()}
    </div>
  )
}

export function ValueChainMap({ valueChain }: ValueChainMapProps) {
  return (
    <div className="mt-8 mb-10">
      <h3 className="font-serif text-[1.15rem] font-bold text-ink mb-5">产业链价值地图</h3>
      <div className="flex gap-0 max-[768px]:flex-col">
        <LayerColumn layer={valueChain.upstream} />
        <div className="flex items-center justify-center px-2 text-cool-gray text-[1.5rem] font-serif max-[768px]:py-2 max-[768px]:px-0 max-[768px]:rotate-90">
          →
        </div>
        <LayerColumn layer={valueChain.midstream} />
        <div className="flex items-center justify-center px-2 text-cool-gray text-[1.5rem] font-serif max-[768px]:py-2 max-[768px]:px-0 max-[768px]:rotate-90">
          →
        </div>
        <LayerColumn layer={valueChain.downstream} />
      </div>
    </div>
  )
}
