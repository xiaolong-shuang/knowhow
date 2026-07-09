interface StageBadgeProps {
  stage: string
  className?: string
}

export function StageBadge({ stage, className = '' }: StageBadgeProps) {
  return (
    <span className={`inline-block font-sans text-[0.68rem] font-semibold tracking-[0.06em] text-crimson border border-crimson px-[10px] py-[3px] ${className}`}>
      {stage}
    </span>
  )
}
