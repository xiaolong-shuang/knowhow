import { create } from 'zustand'
import type { ChatMessage } from '@/types'

interface ChatState {
  isOpen: boolean
  messages: ChatMessage[]
  isLoading: boolean
  isStreaming: boolean
  /** 当前页面行业上下文数据（压缩后的文本摘要），null = 无上下文 */
  industryContext: string | null
  open: () => void
  close: () => void
  toggle: () => void
  addMessage: (msg: ChatMessage) => void
  setLoading: (v: boolean) => void
  setStreaming: (v: boolean) => void
  updateLastMessage: (content: string) => void
  setIndustryContext: (ctx: string | null) => void
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  isStreaming: false,
  industryContext: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setLoading: (v) => set({ isLoading: v }),
  setStreaming: (v) => set({ isStreaming: v }),
  updateLastMessage: (content) =>
    set((s) => {
      const msgs = [...s.messages]
      if (msgs.length > 0) {
        msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content }
      }
      return { messages: msgs }
    }),
  setIndustryContext: (ctx) => set({ industryContext: ctx }),
}))