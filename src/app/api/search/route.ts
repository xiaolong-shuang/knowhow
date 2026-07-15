import { NextResponse } from 'next/server'
import searchIndex from '@/data/search-index.json'
import { generateAIResponseText, getLLMConfig } from '@/lib/ai'
import { trackEvent, incrementStat } from '@/lib/events'
import { kvGet } from '@/lib/kv'
import { normalizeQuery } from '@/lib/normalize'

interface SearchEntry {
  slug: string
  name: string
  aliases: string[]
  searchKeywords: string[]
  source: string
}

/**
 * 查询与搜索词条目的匹配度评分。
 * 精确匹配 > 别名精确匹配 > 名称包含 > 别名包含 > 关键词匹配
 */
function matchScore(query: string, entry: SearchEntry): number {
  const q = query.toLowerCase()
  if (entry.name.toLowerCase() === q) return 100
  if (entry.aliases.some(a => a.toLowerCase() === q)) return 95
  if (entry.name.toLowerCase().includes(q)) return 70
  if (entry.aliases.some(a => a.toLowerCase().includes(q))) return 65
  if (entry.searchKeywords?.some(k =>
    k.toLowerCase().includes(q) || q.includes(k.toLowerCase())
  )) return 60
  return 0
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const anonymousId = searchParams.get('anonymousId') ?? ''
  if (!q) return NextResponse.json({ results: [], query: '' })

  console.log(`[search] anon=${anonymousId?.slice(0, 8)}... q=${q}`)

  const index = searchIndex as SearchEntry[]

  // Step 1：本地匹配
  const scored = index
    .map(entry => {
      const score = matchScore(q, entry)
      return { slug: entry.slug, name: entry.name, source: entry.source, score }
    })
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)

  // Step 2：如果本地结果 < 3，尝试 AI 查询理解
  let hasAIFallback = false
  if (scored.length < 3) {
    const config = getLLMConfig()
    if (config.apiKey) {
      try {
        const industryNames = index.map(e => e.name).join('、')
        const systemPrompt =
          `你是一个搜索助手。已知行业列表（共${index.length}个）：${industryNames}。` +
          `用户搜索了一个关键词，请判断用户最可能想找哪几个行业。` +
          `只返回JSON数组，如["行业名1","行业名2"]。最多5个。不要在数组外输出任何内容。`
        const text = await generateAIResponseText(q, systemPrompt)
        // 容错：先用正则提取数组部分，防止 LLM 在数组外加说明文字
        const arrayMatch = text.match(/\[([\s\S]*?)\]/)
        const arrayText = arrayMatch ? arrayMatch[0] : text
        const matched = JSON.parse(arrayText) as string[]
        for (const name of matched) {
          if (!scored.some(s => s.name === name)) {
            const entry = index.find(e => e.name === name)
            if (entry) {
              scored.push({ slug: entry.slug, name: entry.name, source: entry.source, score: 50 })
            }
          }
        }
        hasAIFallback = true
      } catch {
        // AI 降级——返回已有的 scored（即使 < 3 条，不强凑）
      }
    }
  }

  trackEvent({ type: 'search', anonymousId, payload: { query: q, resultCount: scored.length, hasAIFallback } })
  incrementStat('searches', q)

  // 并行检查 KV 缓存——用归一化 name 作键（与 analyze 写缓存的键一致），
  // 而非 search-index 的英文 slug（两者键空间不同会导致 hasCache 永假）
  const resultsWithCache = await Promise.all(
    scored.map(async (r) => {
      const cached = await kvGet(`cache:${normalizeQuery(r.name)}`)
      return { ...r, hasCache: cached !== null }
    })
  )

  return NextResponse.json({
    results: resultsWithCache,
    hasAIFallback,
    query: q,
  })
}
