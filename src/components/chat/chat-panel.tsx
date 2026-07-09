'use client'

import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useChatStore } from '@/stores/chat'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { QuickPrompts } from './quick-prompts'

// Industry-slug → quick prompts mapping (extensible)
const PROMPTS_BY_INDUSTRY: Record<string, string[]> = {
  healthcare: [
    '医疗AI最大的机会在哪？',
    '三类证审批要多久？',
    'AI药物研发有哪些玩家？',
    '对比医疗AI vs 金融AI',
  ],
  education: [
    '教育行业AI渗透率有多高？',
    '个性化学习的技术瓶颈在哪？',
    '教育AI有哪些头部玩家？',
    '对比教育AI vs 医疗AI',
  ],
  finance: [
    '金融风控用到了哪些AI技术？',
    '量化交易的AI应用成熟度如何？',
    '金融AI有哪些创业机会？',
    '对比金融AI vs 医疗AI',
  ],
}

// Generic prompts when no industry context is available
const GENERIC_PROMPTS = [
  '当前行业最大的AI机会在哪？',
  '核心竞争壁垒是什么？',
  '产业链哪个环节利润最高？',
  '对比这个行业 vs 医疗AI',
]

function buildDynamicPrompts(
  industryName: string,
  basePrompts: string[],
): string[] {
  return basePrompts.map((p) => {
    // Replace "医疗AI" / "金融AI" / "教育AI" with the actual industry
    let result = p
    if (industryName && !p.includes(industryName)) {
      // Keep the question structure but insert context
      result = result.replace(/医疗AI|金融AI|教育AI/g, industryName)
    }
    return result
  })
}

export function ChatPanel() {
  const isOpen = useChatStore((s) => s.isOpen)
  const close = useChatStore((s) => s.close)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const prompts = useMemo(() => {
    // Case 1: On a static industry detail page — /industry/healthcare
    const industryMatch = pathname.match(/^\/industry\/(\w+)/)
    if (industryMatch) {
      const slug = industryMatch[1]
      const industryName = { healthcare: '医疗', education: '教育', finance: '金融' }[slug] ?? slug
      const basePrompts = PROMPTS_BY_INDUSTRY[slug]
      if (basePrompts) return basePrompts
      // Unknown industry slug — generate on the fly
      return [
        `${industryName}行业AI最大的机会在哪？`,
        `${industryName}行业的核心壁垒是什么？`,
        `${industryName}产业链有哪些关键玩家？`,
        `对比${industryName}AI vs 其他行业`,
      ]
    }

    // Case 2: On analyze page — /analyze?q=锂电池
    if (pathname === '/analyze') {
      const q = searchParams.get('q')
      if (q) {
        const name = q.replace(/^AI\s*\+\s*/, '').trim()
        return [
          `${name}行业AI最大的机会在哪？`,
          `${name}产业链哪个环节利润最高？`,
          `${name}行业有哪些值得关注的创业公司？`,
          `${name}行业的进入壁垒是什么？`,
        ]
      }
    }

    // Case 3: No context — generic
    return GENERIC_PROMPTS
  }, [pathname, searchParams])

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/25 z-[2000] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />
      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[460px] max-w-[100vw] bg-cream z-[2001] flex flex-col shadow-[-2px_0_20px_rgba(0,0,0,0.06)] transition-transform duration-350 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-rule-gray flex items-center justify-between shrink-0">
          <h2 className="font-serif text-base font-bold">AI 行业助手</h2>
          <button
            onClick={close}
            className="w-8 h-8 flex items-center justify-center border border-rule-gray text-cool-gray hover:border-ink hover:text-ink transition-all bg-transparent cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <ChatMessages />

        {/* Quick prompts */}
        <QuickPrompts prompts={prompts} />

        {/* Input */}
        <ChatInput />
      </div>
    </>
  )
}
