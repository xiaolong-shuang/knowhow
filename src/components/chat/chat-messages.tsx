'use client'

import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChatStore } from '@/stores/chat'

const WELCOME_MSG = {
  id: 'welcome',
  role: 'assistant' as const,
  content: '你好！我是 KnowHow 的 AI 行业分析助手。\n\n我可以帮你：\n\n· 深入分析某个行业的 AI 机会\n\n· 对比不同赛道的优劣\n\n· 解答产业链、竞争格局相关问题\n\n· 推荐值得关注的创业公司\n\n请直接提问，或者点击下方的快捷提问 👇',
  sources: [] as { title: string; excerpt: string }[],
}

export function ChatMessages() {
  const messages = useChatStore((s) => s.messages)
  const isLoading = useChatStore((s) => s.isLoading)
  const isStreaming = useChatStore((s) => s.isStreaming)
  const bottomRef = useRef<HTMLDivElement>(null)
  const allMessages = messages.length === 0 ? [WELCOME_MSG] : messages

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
      {allMessages.map((msg, idx) => {
        const isLast = idx === allMessages.length - 1
        const isStreamingLast = isLast && isStreaming && msg.role === 'assistant'

        return (
          <div
            key={msg.id}
            className={`max-w-[85%] text-sm leading-relaxed px-4 py-3 ${
              msg.role === 'user'
                ? 'self-end bg-ink text-cream'
                : 'self-start bg-msg-ai text-ink border-l-2 border-crimson'
            }`}
          >
            {msg.role === 'user' ? (
              <div className="whitespace-pre-wrap">{msg.content}</div>
            ) : isStreamingLast ? (
              /* Streaming: plain text only, no markdown parsing to avoid layout jitter */
              <div className="whitespace-pre-wrap">{msg.content}</div>
            ) : (
              /* Done streaming: render with full markdown */
              <div className="markdown-chat">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}
            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-2 pt-2 border-t border-rule-light/50 text-[0.68rem] text-cool-gray/80">
                {msg.sources.map((s, i) => (
                  <div key={i} className="italic">—— {s.title}: {s.excerpt}</div>
                ))}
              </div>
            )}
          </div>
        )
      })}
      {isLoading && (
        <div className="self-start bg-msg-ai text-ink border-l-2 border-crimson px-4 py-3 text-sm">
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 bg-cool-gray rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-cool-gray rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="w-1.5 h-1.5 bg-cool-gray rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
