'use client'

interface CompareVerdictProps {
  comparison: {
    marketSize: { verdict: string; winner: string }
    growthSpeed: { verdict: string; winner: string }
    aiReadiness: { verdict: string; winner: string }
    barrierHeight: { verdict: string; winner: string }
    overallVerdict: string
  }
  leftName: string
  rightName: string
}

interface DecisionItem {
  winner: string
  reason: string
}

interface DecisionMatrix {
  [key: string]: DecisionItem
}

interface CompareDecisionProps {
  pickAReasons: string[]
  pickBReasons: string[]
  decisionMatrix: DecisionMatrix
  leftName: string
  rightName: string
}

function WinnerBadge({ winner, leftName, rightName }: { winner: string; leftName: string; rightName: string }) {
  if (winner === 'A') return <span className="text-[0.7rem] font-bold text-crimson bg-crimson/5 px-1.5 py-0.5">{leftName} 胜出</span>
  if (winner === 'B') return <span className="text-[0.7rem] font-bold text-green bg-green/5 px-1.5 py-0.5">{rightName} 胜出</span>
  return <span className="text-[0.7rem] font-bold text-cool-gray bg-cool-gray/5 px-1.5 py-0.5">平分秋色</span>
}

export function CompareVerdict({ comparison, leftName, rightName }: CompareVerdictProps) {
  const dims = [
    { key: 'marketSize', label: '市场规模' },
    { key: 'growthSpeed', label: '增长速度' },
    { key: 'aiReadiness', label: 'AI 就绪度' },
    { key: 'barrierHeight', label: '壁垒强度' },
  ] as const

  return (
    <div className="mb-12">
      <h3 className="font-serif text-[1.15rem] font-bold text-ink mb-5">维度对比</h3>
      <div className="grid grid-cols-4 gap-3 max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1">
        {dims.map((dim) => {
          const d = comparison[dim.key]
          return (
            <div key={dim.key} className="border border-rule-light bg-white/60 p-4">
              <div className="text-[0.72rem] text-cool-gray uppercase tracking-[0.06em] mb-2">{dim.label}</div>
              <p className="text-[0.82rem] text-ink leading-snug mb-2">{d?.verdict || '-'}</p>
              <WinnerBadge winner={d?.winner || 'tie'} leftName={leftName} rightName={rightName} />
            </div>
          )
        })}
      </div>
      {comparison.overallVerdict && (
        <div className="mt-4 border-l-4 border-crimson bg-parchment px-5 py-3">
          <p className="text-[0.85rem] text-ink font-semibold leading-relaxed">{comparison.overallVerdict}</p>
        </div>
      )}
    </div>
  )
}

export function CompareDecision({ pickAReasons, pickBReasons, decisionMatrix, leftName, rightName }: CompareDecisionProps) {
  return (
    <>
      {/* Pick reasons */}
      <div className="mb-12">
        <h3 className="font-serif text-[1.15rem] font-bold text-ink mb-5">AI PM 选型建议</h3>
        <div className="grid grid-cols-2 gap-5 max-[768px]:grid-cols-1">
          <div className="border border-rule-light bg-white/60 p-5">
            <h4 className="font-serif text-[0.95rem] font-bold text-crimson mb-3">选 {leftName}，如果…</h4>
            <ul className="space-y-2">
              {pickAReasons.map((r, i) => (
                <li key={i} className="text-[0.82rem] text-warm-gray leading-relaxed flex gap-2">
                  <span className="text-crimson shrink-0 mt-0.5">▸</span>
                  <span>{r}</span>
                </li>
              ))}
              {pickAReasons.length === 0 && (
                <li className="text-[0.78rem] text-cool-gray">请配置API Key后重新对比</li>
              )}
            </ul>
          </div>
          <div className="border border-rule-light bg-white/60 p-5">
            <h4 className="font-serif text-[0.95rem] font-bold text-green mb-3">选 {rightName}，如果…</h4>
            <ul className="space-y-2">
              {pickBReasons.map((r, i) => (
                <li key={i} className="text-[0.82rem] text-warm-gray leading-relaxed flex gap-2">
                  <span className="text-green shrink-0 mt-0.5">▸</span>
                  <span>{r}</span>
                </li>
              ))}
              {pickBReasons.length === 0 && (
                <li className="text-[0.78rem] text-cool-gray">请配置API Key后重新对比</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Decision Matrix */}
      {Object.keys(decisionMatrix).length > 0 && (
        <div className="mb-12">
          <h3 className="font-serif text-[1.15rem] font-bold text-ink mb-5">决策矩阵</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[0.82rem]">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="text-left py-3 pr-4 font-serif font-bold text-ink">决策维度</th>
                  <th className="text-center py-3 px-4 font-serif font-bold text-ink w-[100px]">优胜方</th>
                  <th className="text-left py-3 pl-4 font-serif font-bold text-ink">原因</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(decisionMatrix).map(([key, val]: [string, any]) => {
                  const winner = val?.winner ?? 'tie'
                  const reason = val?.reason ?? ''
                  return (
                    <tr key={key} className="border-b border-rule-light">
                      <td className="py-3 pr-4 font-semibold text-ink">{key}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={
                          winner === 'A' ? 'text-crimson font-semibold text-[0.75rem]' :
                          winner === 'B' ? 'text-green font-semibold text-[0.75rem]' :
                          'text-cool-gray text-[0.75rem]'
                        }>
                          {winner === 'A' ? leftName : winner === 'B' ? rightName : '持平'}
                        </span>
                      </td>
                      <td className="py-3 pl-4 text-warm-gray leading-relaxed">{reason}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
