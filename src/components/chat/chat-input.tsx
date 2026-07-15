'use client'

import { useState } from 'react'
import { useChatStore } from '@/stores/chat'
import { getAnonymousId } from '@/lib/anonymous-id'

let nextId = 1

interface ChatInputProps {
  /** 当前页面的行业上下文，从 ChatPanel 传入 */
  industryContext?: string | null
}

export function ChatInput({ industryContext }: ChatInputProps) {
  const [text, setText] = useState('')
  const addMessage = useChatStore((s) => s.addMessage)
  const setLoading = useChatStore((s) => s.setLoading)
  const setStreaming = useChatStore((s) => s.setStreaming)
  const updateLastMessage = useChatStore((s) => s.updateLastMessage)

  async function send() {
    const content = text.trim()
    if (!content) return
    setText('')

    const userMsg = { id: `u${nextId++}`, role: 'user' as const, content }
    addMessage(userMsg)
    setLoading(true)
    setStreaming(true)

    try {
      const allMessages = useChatStore.getState().messages
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: content,
          history: allMessages.slice(-7, -1), // 最近 3 轮（6条）不含当前消息
          industryContext: industryContext ?? undefined,
          anonymousId: getAnonymousId(),
        }),
      })

      if (!res.ok) throw new Error('API error')

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream')

      const decoder = new TextDecoder()
      let full = ''
      const assistMsg = { id: `a${nextId++}`, role: 'assistant' as const, content: '' }
      addMessage(assistMsg)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        updateLastMessage(full)
      }

      // Streaming done — trigger final re-render with markdown
      setStreaming(false)
    } catch {
      addMessage({ id: `a${nextId++}`, role: 'assistant', content: '抱歉，AI 服务暂时不可用。请检查网络连接或稍后重试。' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-5 py-3.5 border-t border-rule-gray flex gap-2 shrink-0">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && send()}
        placeholder="输入你的问题..."
        className="flex-1 border border-rule-gray px-3.5 py-2.5 text-sm font-sans outline-none bg-cream focus:border-crimson transition-colors"
      />
      <button
        onClick={send}
        className="bg-crimson text-cream px-[18px] py-2.5 text-[0.82rem] font-semibold tracking-[0.04em] hover:bg-crimson-dark transition-colors cursor-pointer font-sans border-none"
      >
        发送
      </button>
    </div>
  )
}
