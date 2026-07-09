interface MetricBarProps {
  score: number
  maxScore?: number
}

export function MetricBar({ score, maxScore = 5 }: MetricBarProps) {
  const pct = Math.min(Math.max(score / maxScore, 0), 1) * 100

  return (
    <span className="inline-block w-[72px] h-[6px] bg-rule-light flex-shrink-0">
      <span
        className="block h-full bg-crimson transition-all"
        style={{ width: `${pct}%` }}
      />
    </span>
  )
}
