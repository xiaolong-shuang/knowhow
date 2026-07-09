import type { Metadata } from 'next'
import { AnalyzeContent } from './analyze-content'

export const metadata: Metadata = {
  title: 'AI 行业分析 · KnowHow',
  description: '输入任意行业名称，AI 自动生成 L1/L2/L3 三层深度分析报告',
}

export default async function AnalyzePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return <AnalyzeContent initialQuery={q ?? ''} />
}
