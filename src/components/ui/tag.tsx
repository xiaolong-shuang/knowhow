import type { TagVariant } from '@/types'

interface TagProps {
  label: string
  variant?: TagVariant | 'hot'
  className?: string
}

const variantStyles: Record<string, string> = {
  hot: 'border-crimson text-crimson',
  default: 'border-rule-gray text-cool-gray',
}

export function Tag({ label, variant, className = '' }: TagProps) {
  const style = variantStyles[variant ?? 'default'] ?? variantStyles.default
  return (
    <span className={`inline-block text-[0.65rem] font-semibold tracking-[0.05em] border px-2 py-[2px] ${style} ${className}`}>
      {label}
    </span>
  )
}
