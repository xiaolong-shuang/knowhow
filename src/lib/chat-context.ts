import type { IndustrySchema } from '@/types'

/**
 * 将完整的 IndustrySchema 压缩为约 1000 字以内的文本摘要，
 * 供 Chat 系统 prompt 的 industryContext 使用。
 *
 * 硬截断优先级（字符串拼接后逐级应用）：
 *   1. 拼接完整字符串
 *   2. 如果 > 1000 字：每个 metric 的 insight 截断到 15 字
 *   3. 如果仍超：只保留前 4 个 headlineMetrics
 *   4. 如果仍超：去掉 trends 段落
 *   5. 如果仍超：valueChain 的 node 只保留名字
 *
 * 注意：如果某个模块数据为空（如 trends 为空数组），跳过该段落。
 */
export function compressIndustryForChat(schema: IndustrySchema): string {
  const { name, headlineMetrics, valueChain, portersFive, trends } = schema

  // ── 核心指标 ──
  let metricsText = ''
  for (const m of headlineMetrics) {
    const parts: string[] = []
    parts.push(`${m.label}: ${m.value}${m.unit ?? ''}（${m.year}）`)
    parts.push(`${m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→'}`)
    if (m.source) parts.push(`来源: ${m.source}`)
    if (m.insight) parts.push(m.insight)
    metricsText += `- ${parts.join('，')}\n`
  }

  // ── 产业链 ──
  const vcText = [
    `上游(${valueChain.upstream.aiPenetration}): ${valueChain.upstream.name}`,
    `中游(${valueChain.midstream.aiPenetration}): ${valueChain.midstream.name}`,
    `下游(${valueChain.downstream.aiPenetration}): ${valueChain.downstream.name}`,
  ].join('\n')

  // ── 波特五力 ──
  let pfText = ''
  for (const f of portersFive) {
    pfText += `${f.force}: ${f.intensity}/5\n`
  }

  // ── 关键趋势（前 3 条） ──
  let trendsText = ''
  if (trends.length > 0) {
    const topTrends = trends.slice(0, 3)
    for (const t of topTrends) {
      trendsText += `- ${t.title}\n`
    }
  }

  // 组装完整字符串
  let full = `「${name}」行业数据摘要：\n\n`

  full += `【核心指标】\n${metricsText}\n`
  full += `【产业链】\n${vcText}\n`
  if (pfText) full += `\n【波特五力】\n${pfText}\n`
  if (trendsText) full += `\n【关键趋势】\n${trendsText}\n`

  // ── 硬截断规则 ──
  full = full.trim()

  // 单字计数（中文字符 ≈ 1 字，英文单词 ≈ 1 字估算）
  if (full.length > 1000) {
    // Level 1: 每个 metric 的 insight 截断到 15 字
    let rebuilt = `「${name}」行业数据摘要：\n\n`
    rebuilt += `【核心指标】\n`
    for (const m of headlineMetrics) {
      const insightShort = m.insight ? m.insight.slice(0, 15) + (m.insight.length > 15 ? '...' : '') : ''
      rebuilt += `- ${m.label}: ${m.value}${m.unit ?? ''}（${m.year}），${m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→'}，来源: ${m.source}。${insightShort}\n`
    }
    rebuilt += `\n【产业链】\n${vcText}\n`
    if (pfText) rebuilt += `\n【波特五力】\n${pfText}\n`
    if (trendsText) rebuilt += `\n【关键趋势】\n${trendsText}\n`
    full = rebuilt.trim()
  }

  if (full.length > 1000) {
    // Level 2: 只保留前 4 个 headlineMetrics
    const top4 = headlineMetrics.slice(0, 4)
    let rebuilt = `「${name}」行业数据摘要：\n\n`
    rebuilt += `【核心指标】\n`
    for (const m of top4) {
      const insightShort = m.insight ? m.insight.slice(0, 15) + (m.insight.length > 15 ? '...' : '') : ''
      rebuilt += `- ${m.label}: ${m.value}${m.unit ?? ''}（${m.year}），${m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→'}，来源: ${m.source}。${insightShort}\n`
    }
    rebuilt += `\n【产业链】\n${vcText}\n`
    if (pfText) rebuilt += `\n【波特五力】\n${pfText}\n`
    if (trendsText) rebuilt += `\n【关键趋势】\n${trendsText}\n`
    full = rebuilt.trim()
  }

  if (full.length > 1000) {
    // Level 3: 去掉 trends 段落
    let rebuilt = `「${name}」行业数据摘要：\n\n`
    rebuilt += `【核心指标】\n`
    const top4 = headlineMetrics.slice(0, 4)
    for (const m of top4) {
      const insightShort = m.insight ? m.insight.slice(0, 15) + (m.insight.length > 15 ? '...' : '') : ''
      rebuilt += `- ${m.label}: ${m.value}${m.unit ?? ''}（${m.year}），${m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→'}，来源: ${m.source}。${insightShort}\n`
    }
    rebuilt += `\n【产业链】\n${vcText}\n`
    if (pfText) rebuilt += `\n【波特五力】\n${pfText}\n`
    full = rebuilt.trim()
  }

  if (full.length > 1000) {
    // Level 4: valueChain 的 node 只保留名字
    const vcShort = [
      `上游(${valueChain.upstream.aiPenetration}): ${valueChain.upstream.name}`,
      `中游(${valueChain.midstream.aiPenetration}): ${valueChain.midstream.name}`,
      `下游(${valueChain.downstream.aiPenetration}): ${valueChain.downstream.name}`,
    ].join('\n')
    let rebuilt = `「${name}」行业数据摘要：\n\n`
    rebuilt += `【核心指标】\n`
    const top4 = headlineMetrics.slice(0, 4)
    for (const m of top4) {
      rebuilt += `- ${m.label}: ${m.value}${m.unit ?? ''}（${m.year}）...\n`
    }
    rebuilt += `\n【产业链】\n${vcShort}\n`
    if (pfText) rebuilt += `\n【波特五力】\n${pfText}\n`
    full = rebuilt.trim()
  }

  return full
}
