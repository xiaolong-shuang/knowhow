import { getLLMConfig } from '@/lib/ai'
import { trackEvent, incrementStat } from '@/lib/events'

const COMPARE_SYSTEM_PROMPT = `你是一位资深行业分析顾问，为AI产品经理提供赛道选型决策支持。请对比「{industryA}」和「{industryB}」两个行业，输出一个完整、有判断力的对比JSON报告。

──────────────────────────────

【输出格式 · 必须遵守】

只输出一个纯JSON对象。以 { 开头，以 } 结尾。不要用 \`\`\`json\`\`\` 代码块包裹。字符串用双引号，最后一个元素后不加逗号。

{
  "industryA": {
    "name": "AI + {industryA}",
    "emoji": "🔋",
    "oneLiner": "一句话概括核心逻辑",
    "stage": "growth",
    "headlineMetrics": [
      {"label": "2024年市场规模", "value": "386", "unit": "亿", "trend": "up", "source": "来源"},
      {"label": "CAGR", "value": "38", "unit": "%", "trend": "up", "source": "来源"},
      {"label": "AI渗透率", "value": "15", "unit": "%", "trend": "up", "source": "来源"},
      {"label": "进入壁垒强度", "value": "极高", "unit": "", "trend": "flat", "source": "来源"}
    ],
    "topPlayers": ["玩家1", "玩家2", "玩家3"],
    "aiOpportunities": [
      {"title": "AI机会名称", "maturityScore": 3, "valueCeilingScore": 4, "verdict": "scaling"}
    ]
  },
  "industryB": { /* 同上结构 */ },
  "comparison": {
    "marketSize": {"verdict": "A是B的3.2倍", "winner": "A"},
    "growthSpeed": {"verdict": "B增速更快，CAGR高8个百分点", "winner": "B"},
    "aiReadiness": {"verdict": "两个行业AI渗透率均低于20%，蓝海", "winner": "tie"},
    "barrierHeight": {"verdict": "A的三类证壁垒远高于B的牌照壁垒", "winner": "A"},
    "overallVerdict": "一句话总结哪个赛道更适合AI PM切入，为什么"
  },
  "pickAReasons": [
    "选A的具体理由1（要有判断力）",
    "选A的具体理由2",
    "选A的具体理由3"
  ],
  "pickBReasons": [
    "选B的具体理由1",
    "选B的具体理由2",
    "选B的具体理由3"
  ],
  "decisionMatrix": {
    "确定性": {"winner": "A", "reason": "A市场更成熟，商业模式已验证"},
    "成长天花板": {"winner": "B", "reason": "B处于爆发前夜，潜在空间更大"},
    "技术壁垒": {"winner": "A", "reason": "A有硬科技壁垒，护城河更深"},
    "政策红利": {"winner": "A", "reason": "A享受明确的政策支持窗口期"},
    "AI切入难度": {"winner": "B", "reason": "B的数据基础设施更完善，AI落地更快"}
  },
  "sources": ["来源1", "来源2", "来源3", "来源4"]
}

──────────────────────────────

【全局质量要求】

1. 数字具体，不确定的数据可以估算并标注"(估算)"
2. 结论有判断力，不要"各有利弊""需要观察"这类安全措辞
3. 敢说"A比B强在哪"，也敢说"B比A强在哪"
4. 《经济学人》风格：精炼、锐利、信息密度高
5. 对比要有"AI产品经理视角"——不只是客观数据，而是"这意味着你应该选哪个赛道"

──────────────────────────────

【各板块独有约束】

industryA / industryB — headlineMetrics 恰好4个，覆盖市场规模、CAGR、AI渗透率、进入壁垒
aiOpportunities 3个（可缩短至2个），verdict取自 "hot"|"proven"|"pre-boom"|"steady"|"scaling"|"demand"|"future"|"supplement"|"blue-ocean"
stage 取自 "embryonic"|"growth"|"shakeout"|"mature"|"declining"
topPlayers 恰好3个名字

comparison — 5个维度的verdict都要包含具体数据或对比判断，不能是"A更大""B更快"这种空话
winner 只能取 "A"|"B"|"tie"

pickAReasons / pickBReasons — 恰好各3条，每条是具体的选型理由，不是泛泛的"A市场大"

decisionMatrix — 5个维度固定不变：确定性、成长天花板、技术壁垒、政策红利、AI切入难度
每个维度的reason要写清"为什么"

sources — 至少4个，含政府/监管来源和第三方研究来源，标注(估算)

──────────────────────────────

【再次强调】
只输出纯JSON。以 { 开头，以 } 结尾。不用代码块。不带任何解释文字。`

const VALID_STAGES = ['embryonic', 'growth', 'shakeout', 'mature', 'declining']
const VALID_TRENDS = ['up', 'down', 'flat']
const VALID_VERDICTS = ['hot', 'proven', 'pre-boom', 'steady', 'scaling', 'demand', 'future', 'supplement', 'blue-ocean']

function parseJSONFromLLM(raw: string): any {
  // Layer 1: direct parse
  try { return JSON.parse(raw) } catch {}
  // Layer 2: extract from ```json block
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1]) } catch {}
  }
  // Layer 3: find first { to last }
  const firstBrace = raw.indexOf('{')
  const lastBrace = raw.lastIndexOf('}')
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    try { return JSON.parse(raw.slice(firstBrace, lastBrace + 1)) } catch {}
  }
  // Layer 4: fix common issues
  let fixed = raw.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']').replace(/'/g, '"')
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    fixed = fixed.slice(firstBrace, lastBrace + 1)
  }
  try { return JSON.parse(fixed) } catch {}
  throw new Error('Unable to parse JSON from LLM response')
}

function sanitizeIndustry(raw: any): any {
  if (!raw || typeof raw !== 'object') return null
  return {
    name: String(raw.name ?? ''),
    emoji: String(raw.emoji ?? '📊'),
    oneLiner: String(raw.oneLiner ?? ''),
    stage: VALID_STAGES.includes(raw.stage) ? raw.stage : 'growth',
    headlineMetrics: Array.isArray(raw.headlineMetrics)
      ? raw.headlineMetrics.slice(0, 4).map((m: any) => ({
          label: String(m.label ?? ''),
          value: String(m.value ?? ''),
          unit: m.unit ? String(m.unit) : undefined,
          trend: VALID_TRENDS.includes(m.trend) ? m.trend : 'up',
          source: String(m.source ?? ''),
        }))
      : [],
    topPlayers: Array.isArray(raw.topPlayers) ? raw.topPlayers.slice(0, 3).map(String) : [],
    aiOpportunities: Array.isArray(raw.aiOpportunities)
      ? raw.aiOpportunities.slice(0, 3).map((o: any) => ({
          title: String(o.title ?? ''),
          maturityScore: Math.min(5, Math.max(1, Number(o.maturityScore) || 3)),
          valueCeilingScore: Math.min(5, Math.max(1, Number(o.valueCeilingScore) || 3)),
          verdict: VALID_VERDICTS.includes(o.verdict) ? o.verdict : 'steady',
        }))
      : [],
  }
}

function sanitizeCompare(raw: any): any {
  if (!raw || typeof raw !== 'object') return {}
  return {
    marketSize: { verdict: String(raw.marketSize?.verdict ?? ''), winner: String(raw.marketSize?.winner ?? 'tie') },
    growthSpeed: { verdict: String(raw.growthSpeed?.verdict ?? ''), winner: String(raw.growthSpeed?.winner ?? 'tie') },
    aiReadiness: { verdict: String(raw.aiReadiness?.verdict ?? ''), winner: String(raw.aiReadiness?.winner ?? 'tie') },
    barrierHeight: { verdict: String(raw.barrierHeight?.verdict ?? ''), winner: String(raw.barrierHeight?.winner ?? 'tie') },
    overallVerdict: String(raw.overallVerdict ?? ''),
  }
}

export async function POST(req: Request) {
  try {
    const { industryA, industryB, anonymousId } = await req.json()

    console.log(`[compare] anon=${anonymousId?.slice(0, 8)}... A=${industryA} B=${industryB}`)

    if (!industryA || !industryB || typeof industryA !== 'string' || typeof industryB !== 'string') {
      return Response.json({ error: 'Both industryA and industryB are required' }, { status: 400 })
    }

    const config = getLLMConfig()

    if (!config.apiKey) {
      trackEvent({ type: 'compare', anonymousId, payload: { industryA: industryA.trim(), industryB: industryB.trim(), fallback: true } })
      incrementStat('industries', industryA)
      incrementStat('industries', industryB)
      return Response.json({
        data: buildFallback(industryA.trim(), industryB.trim()),
        fallback: true,
      })
    }

    const systemPrompt = COMPARE_SYSTEM_PROMPT
      .replace(/\{industryA\}/g, industryA.trim())
      .replace(/\{industryB\}/g, industryB.trim())
    const userMessage = `请对比「${industryA.trim()}」和「${industryB.trim()}」两个行业，输出完整的对比JSON报告。直接输出JSON，不要加任何解释。`

    // Collect full LLM response
    let full = ''

    if (config.provider === 'anthropic') {
      const Anthropic = (await import('@anthropic-ai/sdk')).default
      const client = new Anthropic({ apiKey: config.apiKey })
      const stream = await client.messages.create({
        model: config.model,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: Math.max(config.maxTokens, 12288),
        stream: true,
      })
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          full += event.delta.text
        }
      }
    } else {
      const res = await fetch(config.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          ...(config.extraHeaders ?? {}),
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          max_tokens: Math.max(config.maxTokens, 12288),
          stream: true,
        }),
      })

      if (!res.ok) {
        const err = await res.text().catch(() => '')
        throw new Error(`LLM API error ${res.status}: ${err}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) full += content
          } catch { /* skip */ }
        }
      }
    }

    const parsed = parseJSONFromLLM(full)

    const data = {
      industryA: sanitizeIndustry(parsed.industryA),
      industryB: sanitizeIndustry(parsed.industryB),
      comparison: sanitizeCompare(parsed.comparison),
      pickAReasons: Array.isArray(parsed.pickAReasons) ? parsed.pickAReasons.slice(0, 3).map(String) : [],
      pickBReasons: Array.isArray(parsed.pickBReasons) ? parsed.pickBReasons.slice(0, 3).map(String) : [],
      decisionMatrix: parsed.decisionMatrix || {},
      sources: Array.isArray(parsed.sources) ? parsed.sources.map(String) : [],
    }

    trackEvent({ type: 'compare', anonymousId, payload: { industryA: industryA.trim(), industryB: industryB.trim(), fallback: false } })
    incrementStat('industries', industryA)
    incrementStat('industries', industryB)

    return Response.json({ data })
  } catch (e: any) {
    console.error('Compare API error:', e)
    try {
      const body = await req.clone().json().catch(() => ({}))
      return Response.json({
        data: buildFallback(body.industryA || '行业A', body.industryB || '行业B'),
        fallback: true,
      })
    } catch {
      return Response.json({ error: e.message ?? 'Internal server error' }, { status: 500 })
    }
  }
}

function buildFallback(a: string, b: string): any {
  const makeIndustry = (name: string) => ({
    name: `AI + ${name}`,
    emoji: '📊',
    oneLiner: `${name}行业深度分析`,
    stage: 'growth' as const,
    headlineMetrics: [
      { label: '市场规模', value: '—', unit: '', trend: 'flat', source: '' },
      { label: 'CAGR', value: '—', unit: '%', trend: 'flat', source: '' },
      { label: 'AI渗透率', value: '—', unit: '%', trend: 'flat', source: '' },
      { label: '进入壁垒', value: '—', unit: '', trend: 'flat', source: '' },
    ],
    topPlayers: [],
    aiOpportunities: [],
  })

  return {
    industryA: makeIndustry(a),
    industryB: makeIndustry(b),
    comparison: {
      marketSize: { verdict: '', winner: 'tie' },
      growthSpeed: { verdict: '', winner: 'tie' },
      aiReadiness: { verdict: '', winner: 'tie' },
      barrierHeight: { verdict: '', winner: 'tie' },
      overallVerdict: '请配置 LLM_API_KEY 后重新对比',
    },
    pickAReasons: ['请配置API Key后重新对比'],
    pickBReasons: ['请配置API Key后重新对比'],
    decisionMatrix: {},
    sources: ['⚠️ 降级模式，请配置 LLM_PROVIDER 和 LLM_API_KEY'],
  }
}
