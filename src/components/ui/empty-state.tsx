interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  className?: string
}

export function EmptyState({ icon = '📭', title, description, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-20 ${className}`}>
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
      {description && <p className="text-cool-gray text-sm">{description}</p>}
    </div>
  )
}
