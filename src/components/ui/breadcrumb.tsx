import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`py-6 ${className}`}>
      <div className="max-w-[1160px] mx-auto px-[72px] max-[1100px]:px-9 max-[768px]:px-5">
        <p className="text-[0.76rem] text-cool-gray/80 flex items-center gap-2">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="text-cool-gray/80 hover:text-crimson transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink/70">{item.label}</span>
              )}
              {i < items.length - 1 && <span>/</span>}
            </span>
          ))}
        </p>
      </div>
    </nav>
  )
}
