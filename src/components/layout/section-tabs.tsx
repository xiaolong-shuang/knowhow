'use client'

import { useEffect, useRef, useState } from 'react'

interface SectionTabsProps {
  tabs: { id: string; label: string }[]
  className?: string
}

export function SectionTabs({ tabs, className = '' }: SectionTabsProps) {
  // Use client-side only flag to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const sections = tabs
      .map((t) => document.getElementById(t.id))
      .filter(Boolean) as HTMLElement[]

    function onScroll() {
      const scrollY = window.scrollY + 130
      let activeId = sections[0]?.id ?? ''
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollY) {
          activeId = sections[i].id
          break
        }
      }
      tabsRef.current?.querySelectorAll('button').forEach((btn) => {
        const target = btn.getAttribute('data-scroll-to')
        const isActive = target === activeId
        if (isActive) {
          btn.classList.add('text-crimson', 'border-crimson')
          btn.classList.remove('text-cool-gray', 'border-transparent')
        } else {
          btn.classList.remove('text-crimson', 'border-crimson')
          btn.classList.add('text-cool-gray', 'border-transparent')
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [tabs, mounted])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 110
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={tabsRef}
      className={`sticky top-[50px] z-[99] bg-cream/96 backdrop-blur-[8px] border-b border-rule-gray ${className}`}
    >
      <div className="max-w-[1160px] mx-auto px-[72px] max-[1100px]:px-9 max-[768px]:px-4 flex gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-scroll-to={tab.id}
            onClick={() => scrollTo(tab.id)}
            className="px-5 py-3 text-[0.78rem] font-semibold tracking-[0.04em] text-cool-gray border-b-2 border-transparent hover:text-warm-gray transition-all bg-transparent cursor-pointer font-sans max-[768px]:px-3 max-[768px]:text-[0.7rem]"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
