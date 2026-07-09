type RuleVariant = 'thin' | 'thick' | 'accent' | 'short'

interface RuleProps {
  variant?: RuleVariant
  className?: string
}

const styles: Record<RuleVariant, string> = {
  thin: 'border-rule-gray border-t',
  thick: 'border-ink border-t-2',
  accent: 'border-crimson border-t w-[56px]',
  short: 'border-crimson border-t w-[40px]',
}

export function Rule({ variant = 'thin', className = '' }: RuleProps) {
  return <hr className={`${styles[variant]} ${className}`} />
}
