import { create } from 'zustand'
import type { IndustrySchema } from '@/types'

interface AnalyzeState {
  /** AI 分析页当前加载的行业数据，null = 暂无数据 */
  data: IndustrySchema | null
  setData: (d: IndustrySchema | null) => void
}

export const useAnalyzeStore = create<AnalyzeState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}))
