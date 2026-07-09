'use client'

import { useChatStore } from '@/stores/chat'

export function AIChatFab() {
  const open = useChatStore((s) => s.open)
  const isOpen = useChatStore((s) => s.isOpen)

  return (
    <button
      onClick={open}
      className={`fixed bottom-8 right-8 z-[1999] font-sans text-[0.8rem] font-semibold text-ink bg-cream border border-ink px-5 py-2.5 cursor-pointer tracking-[0.04em] transition-all duration-250 hover:bg-ink hover:text-cream shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] ${
        isOpen ? 'opacity-0 pointer-events-none' : ''
      }`}
    >
      提问 AI
    </button>
  )
}
