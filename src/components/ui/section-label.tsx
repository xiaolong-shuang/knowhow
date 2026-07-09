interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span className={`font-sans text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-crimson ${className}`}>
      {children}
    </span>
  )
}
