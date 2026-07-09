'use client'

import { useChatStore } from '@/stores/chat'

interface QuickPromptsProps {
  prompts: string[]
}

export function QuickPrompts({ prompts }: QuickPromptsProps) {
  const addMessage = useChatStore((s) => s.addMessage)
  const setLoading = useChatStore((s) => s.setLoading)
  const setStreaming = useChatStore((s) => s.setStreaming)
  const updateLastMessage = useChatStore((s) => s.updateLastMessage)

  let nextId = 100

  async function handleClick(text: string) {
    const userMsg = { id: `u${nextId++}`, role: 'user' as const, content: text }
    addMessage(userMsg)
    setLoading(true)
    setStreaming(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      })

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
      addMessage({ id: `a${nextId++}`, role: 'assistant', content: '抱歉，AI 服务暂时不可用。请稍后重试。' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-5 py-2.5 flex flex-wrap gap-2 border-t border-rule-light shrink-0">
      {prompts.map((p) => (
        <button
          key={p}
          onClick={() => handleClick(p)}
          className="text-[0.72rem] px-3 py-1.5 border border-rule-gray text-cool-gray hover:border-crimson hover:text-crimson transition-all bg-transparent cursor-pointer font-sans"
        >
          {p}
        </button>
      ))}
    </div>
  )
}
