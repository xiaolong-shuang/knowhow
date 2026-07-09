'use client'

import { ChatMessages } from '@/components/chat/chat-messages'
import { ChatInput } from '@/components/chat/chat-input'
import { QuickPrompts } from '@/components/chat/quick-prompts'
import { useChatStore } from '@/stores/chat'
import { X } from 'lucide-react'

const QUICK_PROMPTS = [
  '医疗AI最大的机会在哪？',
  '三类证审批要多久？',
  'AI药物研发有哪些玩家？',
  '对比医疗AI vs 金融AI',
  '教育行业AI渗透率有多高？',
  '金融风控用到了哪些AI技术？',
]

export default function AskPage() {
  const close = useChatStore((s) => s.close)

  return (
    <div className="fixed inset-0 bg-cream z-[2000] flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-rule-gray flex items-center justify-between shrink-0">
        <h1 className="font-serif text-base font-bold">AI 行业助手</h1>
        <button
          onClick={() => window.location.href = '/'}
          className="w-8 h-8 flex items-center justify-center border border-rule-gray text-cool-gray hover:border-ink hover:text-ink transition-all bg-transparent cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <ChatMessages />

      {/* Quick prompts */}
      <QuickPrompts prompts={QUICK_PROMPTS} />

      {/* Input */}
      <ChatInput />
    </div>
  )
}
