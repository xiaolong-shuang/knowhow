'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useChatStore } from '@/stores/chat'

export function MastheadNav() {
  const pathname = usePathname()
  const openChat = useChatStore((s) => s.open)

  const links = [
    { href: '/', label: '首页', pattern: /^\/$/ },
    { href: '/industry/healthcare', label: '行业', pattern: /^\/industry/ },
    { href: '/compare', label: '对比', pattern: /^\/compare/ },
  ]

  const isActive = (pattern: RegExp) => pattern.test(pathname)

  return (
    <nav>
      <ul className="flex items-center gap-[26px] max-[768px]:gap-3 list-none">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`text-[0.8rem] font-medium tracking-[0.02em] transition-colors ${
                isActive(link.pattern) ? 'text-crimson' : 'text-warm-gray/80 hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={openChat}
            className="text-[0.8rem] font-semibold text-crimson tracking-[0.02em] border border-crimson px-[14px] py-[5px] hover:bg-crimson hover:text-cream transition-all cursor-pointer font-sans"
          >
            问 AI
          </button>
        </li>
      </ul>
    </nav>
  )
}
