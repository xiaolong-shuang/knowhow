'use client'

import { Suspense } from 'react'
import { ChatPanel } from '@/components/chat/chat-panel'
import { AIChatFab } from '@/components/chat/ai-chat-fab'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <ChatPanel />
      </Suspense>
      <AIChatFab />
    </>
  )
}
