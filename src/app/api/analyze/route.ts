import { getLLMConfig } from '@/lib/ai'

const SYSTEM_PROMPT = `你是一位资深行业分析顾问，为AI产品经理提供深度行业认知。请分析「{industry}」行业，输出一个完整、有判断力的JSON报告。

──────────────────────────────

【输出格式 · 必须遵守】

只输出一个纯JSON对象。以 { 开头，以 } 结尾。不要用 \`\`\`json\`\`\` 代码块包裹。字符串用双引号，最后一个元素后不加逗号。

JSON结构如下（注：★★★ 标记的板块如果token不足可以缩短，但不能省略）：

{
  "name": "AI + {industry}",
  "emoji": "🔋",
  "oneLiner": "一句话概括赛道核心逻辑",
  "stage": "growth",
  "heroDeck": "英雄区副标题，有判断力，15字以内",
  "heroHook": "关键数据+判断，30字以内",
  "tags": [{"label": "500+亿", "variant": "hot"}],

  "headlineMetrics": [
    {"label": "2024年市场规模", "value": "386", "unit": "亿", "year": 2024, "growthRate": 0.38, "trend": "up", "source": "乘联会", "insight": "这意味着三年内市场翻倍..."}
  ],

  "valueChain": {
    "upstream":   {"name": "上游 · 原材料",  "aiPenetration": "low",  "nodes": [{"name": "硅料", "valueShare": 15, "marginRange": [8,18]}]},
    "midstream":  {"name": "中游 · 制造",    "aiPenetration": "medium","nodes": []},
    "downstream": {"name": "下游 · 应用",    "aiPenetration": "high",  "nodes": []}
  },

  "playerCategories": [
    {"category": "巨头/平台型",   "players": [{"name": "华为", "description": "提供全栈AI算力..."}]},
    {"category": "垂直领域龙头",  "players": []},
    {"category": "AI创业新锐",    "players": []},
    {"category": "隐形冠军",      "players": []}
  ],

  "aiOpportunities": [
    {"title": "AI动力电池缺陷检测", "maturityScore": 3, "valueCeilingScore": 4, "verdict": "scaling"}
  ],

  "portersFive": [
    {"force": "新进入者威胁", "intensity": 3, "rationale": "具体行业理由..."}
  ],

  "trends": [
    {"title": "结构性变化的标题", "body": "2-3句现象描述", "callout": "对AI产品经理的具体启发"}
  ],

  "myths": [
    {"myth": "圈外人常以为的错误认知", "reality": "行业内部的实际逻辑"}
  ],

  "quiz": [
    {"question": "...", "options": ["A","B","C","D"], "correctIndex": 1, "explanation": "解释，包含L1/L2/L3中的依据"}
  ],

  "compareData": {
    "market": "...", "cagr": "...", "cr5": "...", "stage": "...",
    "aiPenetration": "...", "barrier": "...", "salesCycle": "...",
    "topPlayers": "...", "strength": "...", "weakness": "..."
  },

  "sources": ["机构名《报告/数据名称》", "..."]
}

──────────────────────────────

【全局质量要求】

1. 数字具体，不写"较大""较快""较多"。不确定的数字可以估算并标注"(估算)"，不要留空或写"数据待查"
2. 结论有判断力，不要"取决于""需要观察""既有利也有弊"这类安全措辞
3. 每个板块都要回答"这对AI产品经理意味着什么"
4. 《经济学人》风格：精炼、锐利、信息密度高
5. 输出总量控制在12000 tokens以内。每个描述字段（insight/rationale/body/callout/description/explanation）不超过30字。如空间不足优先保证JSON结构完整 — 宁可描述短也不要让JSON被截断

──────────────────────────────

【各板块独有约束】

headlineMetrics ★★★ 恰好5个，不能多也不能少
必须覆盖以下5个维度，每个维度恰好1个指标：
1. 市场规模（标注单位和年份，如"2024年中国新能源汽车销量"）
2. CAGR增速（标注统计区间，如"2020-2024"）
3. 集中度CR5 或 AI渗透率（标注具体口径）
4. 该行业最关键的一个壁垒指标（专利/持牌数/装机量/用户量/产线良率等，选最关键的）
5. 头部企业市占率 或 用户渗透率
growthRate用小数(0.38=38%)，trend取"up"|"down"|"flat"。
重要：数组长度必须恰好=5，不要加第6个指标。

valueChain ★★★
节点名称必须是该行业的真实产业环节。禁止编造。
aiPenetration取自 "none"|"low"|"medium"|"high"|"very_high"
valueShare是不加%的数字，三层总和80-120即可

playerCategories ★★★
恰好4类，顺序固定：巨头/平台型 → 垂直领域龙头 → AI创业新锐 → 隐形冠军
每类2-3个player，description写清"靠什么差异化"，不是"行业领先企业"

aiOpportunities
5个（可缩短至3个）。每个是具体应用场景，不是"AI+营销"。
如"AI驱动的锂电池隔膜缺陷视觉检测"而非"AI提升质检效率"
maturityScore 1-5: 1=实验室 2=早期试点 3=规模化初期 4=快速渗透 5=成熟
valueCeilingScore 1-5: 1=百亿级 2=千亿级 3=五千亿级 4=万亿级 5=十万亿级+
verdict取自: "hot"|"proven"|"pre-boom"|"steady"|"scaling"|"demand"|"future"|"supplement"|"blue-ocean"

portersFive ★★★ 5个力缺一不可，force必须精确使用以下5个值：
"新进入者威胁"、"供应商议价能力"、"买方议价能力"、"替代品威胁"、"现有竞争者强度"
intensity 1-5，rationale给行业具体理由，不能是"取决于市场情况"这种废话

trends
3个（可缩短至2个）。必须是该行业独有的结构性变化。
不能是"AI技术持续进步""数字化转型加速"这种万能趋势。
宁可少写1个，不要填通用趋势。
body写2-3句，callout写对AI PM的具体启发。

myths
3个（可缩短至2个）。揭露圈外人对该行业的典型错误认知。
myth是"圈外人常以为的"，reality是"行业内部的实际逻辑"。
如果只能写出2个有信息量的，就写2个。

quiz
3道（可缩短至2道）。每题4个选项，答案必须在前面L1/L2/L3中能找到依据。
选项在同一语义层级，形成真实的4选1难度，不是1正确+3荒谬。

sources
至少4个，含1个政府/监管来源+1个第三方研究机构来源
不确定的标注"(估算)"

──────────────────────────────

【再次强调】
只输出纯JSON。以 { 开头，以 } 结尾。不用代码块。不带任何解释文字。`

// Stage labels matching STAGE_LABELS in utils.ts
const VALID_FORCES = ['新进入者威胁', '供应商议价能力', '买方议价能力', '替代品威胁', '现有竞争者强度']
const VALID_STAGES = ['embryonic', 'growth', 'shakeout', 'mature', 'declining']
const VALID_TRENDS = ['up', 'down', 'flat']
const VALID_PENETRATION = ['none', 'low', 'medium', 'high', 'very_high']
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

  // Layer 4: try jsonrepair-like fixes
  let fixed = raw
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .replace(/'/g, '"')
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    fixed = fixed.slice(firstBrace, lastBrace + 1)
  }
  try { return JSON.parse(fixed) } catch {}

  // Layer 5: truncation repair — close unclosed braces/brackets/quotes
  if (firstBrace >= 0) {
    let repaired = raw.slice(firstBrace)
    repaired = repaired.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')

    // Count unclosed structures
    let braceDepth = 0, bracketDepth = 0, inString = false, escapeNext = false
    for (const ch of repaired) {
      if (escapeNext) { escapeNext = false; continue }
      if (ch === '\\') { escapeNext = true; continue }
      if (ch === '"') { inString = !inString; continue }
      if (inString) continue
      if (ch === '{') braceDepth++
      else if (ch === '}') braceDepth--
      else if (ch === '[') bracketDepth++
      else if (ch === ']') bracketDepth--
    }

    // Close any hanging string
    if (inString) repaired += '"'

    // Close remaining arrays then objects (inside-out)
    repaired += ']'.repeat(Math.max(0, bracketDepth))
    repaired += '}'.repeat(Math.max(0, braceDepth))

    try { return JSON.parse(repaired) } catch {}
  }

  // Diagnostic
  console.error('[analyze] JSON parse failed after 5 layers. Raw length:', raw.length)
  console.error('[analyze] First 300 chars:', raw.slice(0, 300))
  console.error('[analyze] Last 300 chars:', raw.slice(-300))

  throw new Error('Unable to parse JSON from LLM response')
}

// Layer 6: regex-based field extraction when JSON is structurally broken
// Recovers as many fields as possible from raw LLM output
function extractFieldsFromRaw(raw: string, industry: string): any {
  const ext = (key: string) => {
    const re = new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`, 'i')
    return raw.match(re)?.[1] ?? raw.match(new RegExp(`"${key}"\\s*:\\s*(.+?)[,}\\n]`, 'i'))?.[1]?.replace(/["]/g, '')?.trim() ?? ''
  }
  const extNum = (key: string, fallback: number) => {
    const m = raw.match(new RegExp(`"${key}"\\s*:\\s*([0-9.]+)`))
    return m ? parseFloat(m[1]) : fallback
  }
  const extNumInObj = (search: string, key: string, fallback: number) => {
    const m = raw.match(new RegExp(`"${search}"[^}]*"${key}"\\s*:\\s*([0-9.]+)`, 'i'))
    return m ? parseFloat(m[1]) : fallback
  }
  const extArray = (key: string) => {
    const start = raw.indexOf(`"${key}"`)
    if (start < 0) return []
    // Find the opening bracket
    const bracketStart = raw.indexOf('[', start)
    if (bracketStart < 0 || bracketStart - start > 100) return []
    // Try to extract each string element from the array
    const results: string[] = []
    const re = /"([^"]+)"/g
    const section = raw.slice(bracketStart, bracketStart + 2000)
    let match
    while ((match = re.exec(section)) !== null) {
      if (!['label','value','unit','year','trend','source','growthRate'].includes(match[1]) && match[1].length > 1) {
        results.push(match[1])
      }
    }
    return results
  }

  const vc = (layer: string) => {
    const re = new RegExp(`"${layer}"\\s*:\\s*\\{"name"\\s*:\\s*"([^"]*)"`, 'i')
    return re.exec(raw)?.[1] ?? ''
  }

  // Extract headline metrics as an array of partial objects
  const metricsSection = raw.match(/"headlineMetrics"\s*:\s*\[([\s\S]*?)\]/)
  const metrics: any[] = []
  if (metricsSection) {
    const metricBlocks = metricsSection[1].split(/\},\s*\{/)
    for (const block of metricBlocks.slice(0, 5)) {
      const m = (k: string) => block.match(new RegExp(`"${k}"\\s*:\\s*"([^"]*)"`))?.[1] ?? ''
      const mNum = (k: string) => parseFloat(block.match(new RegExp(`"${k}"\\s*:\\s*([0-9.]+)`))?.[1] ?? '0')
      metrics.push({
        label: m('label'),
        value: m('value') || (block.match(/"value"\s*:\s*([^,}\n]+)/)?.[1]?.replace(/"/g,'').trim() ?? ''),
        unit: m('unit'),
        year: mNum('year') || 2024,
        growthRate: mNum('growthRate') || undefined,
        trend: (block.match(/"trend"\s*:\s*"(up|down|flat)"/)?.[1]) as string || 'flat',
        source: m('source'),
        insight: m('insight'),
      })
    }
  }

  // Extract players from broken playerCategories
  const playersSection = raw.match(/"playerCategories"\s*:\s*\[([\s\S]*?)\]/)
  const playerCats: any[] = [
    { category: '巨头/平台型', players: [] },
    { category: '垂直领域龙头', players: [] },
    { category: 'AI创业新锐', players: [] },
    { category: '隐形冠军', players: [] },
  ]
  if (playersSection) {
    const catRe = /"category"\s*:\s*"([^"]+)"/g
    const cats = Array.from(playersSection[1].matchAll(catRe), m => m[1])
    for (let ci = 0; ci < Math.min(cats.length, 4); ci++) {
      const catStart = playersSection[1].indexOf(cats[ci])
      const catSlice = playersSection[1].slice(catStart, catStart + 800)
      const nameRe = /"name"\s*:\s*"([^"]+)"/g
      const descRe = /"description"\s*:\s*"([^"]*)"/g
      const names = Array.from(catSlice.matchAll(nameRe), m => m[1])
      const descs = Array.from(catSlice.matchAll(descRe), m => m[1])
      playerCats[ci] = {
        category: cats[ci],
        players: names.slice(0, 3).map((n, j) => ({ name: n, description: descs[j] ?? '' })),
      }
    }
  }

  // Extract aiOpportunities — at least get titles even if structure is broken
  const oppsSection = raw.match(/"aiOpportunities"\s*:\s*\[([\s\S]*?)\]/)
  const opportunities: any[] = []
  if (oppsSection) {
    const titleRe = /"title"\s*:\s*"([^"]+)"/g
    const matRe = /"maturityScore"\s*:\s*(\d)/g
    const ceilRe = /"valueCeilingScore"\s*:\s*(\d)/g
    const verdRe = /"verdict"\s*:\s*"([^"]+)"/g
    const titles = Array.from(oppsSection[1].matchAll(titleRe), m => m[1])
    const mats = Array.from(oppsSection[1].matchAll(matRe), m => parseInt(m[1]))
    const ceils = Array.from(oppsSection[1].matchAll(ceilRe), m => parseInt(m[1]))
    const verds = Array.from(oppsSection[1].matchAll(verdRe), m => m[1])
    for (let j = 0; j < Math.min(titles.length, 5); j++) {
      opportunities.push({
        title: titles[j],
        maturityScore: mats[j] ?? 3,
        valueCeilingScore: ceils[j] ?? 3,
        verdict: verds[j] ?? 'steady',
      })
    }
  }

  // Extract trends
  const trendsSection = raw.match(/"trends"\s*:\s*\[([\s\S]*?)\]/)
  const trends: any[] = []
  if (trendsSection) {
    const titleRe = /"title"\s*:\s*"([^"]+)"/g
    const bodyRe = /"body"\s*:\s*"([^"]*)"/g
    const callRe = /"callout"\s*:\s*"([^"]*)"/g
    const titles = Array.from(trendsSection[1].matchAll(titleRe), m => m[1])
    const bodies = Array.from(trendsSection[1].matchAll(bodyRe), m => m[1])
    const calls = Array.from(trendsSection[1].matchAll(callRe), m => m[1])
    for (let j = 0; j < Math.min(titles.length, 3); j++) {
      trends.push({ title: titles[j], body: bodies[j] ?? '', callout: calls[j] ?? '' })
    }
  }

  // Extract myths
  const mythsSection = raw.match(/"myths"\s*:\s*\[([\s\S]*?)\]/)
  const myths: any[] = []
  if (mythsSection) {
    const mythRe = /"myth"\s*:\s*"([^"]+)"/g
    const realRe = /"reality"\s*:\s*"([^"]+)"/g
    const mythVals = Array.from(mythsSection[1].matchAll(mythRe), m => m[1])
    const realVals = Array.from(mythsSection[1].matchAll(realRe), m => m[1])
    for (let j = 0; j < Math.min(mythVals.length, 3); j++) {
      myths.push({ myth: mythVals[j], reality: realVals[j] ?? '' })
    }
  }

  // Extract quiz
  const quizSection = raw.match(/"quiz"\s*:\s*\[([\s\S]*?)\]/)
  const quiz: any[] = []
  if (quizSection) {
    const qRe = /"question"\s*:\s*"([^"]+)"/g
    const explRe = /"explanation"\s*:\s*"([^"]*)"/g
    const questions = Array.from(quizSection[1].matchAll(qRe), m => m[1])
    const expls = Array.from(quizSection[1].matchAll(explRe), m => m[1])
    for (let j = 0; j < Math.min(questions.length, 3); j++) {
      quiz.push({ question: questions[j], options: ['A','B','C','D'], correctIndex: 0, explanation: expls[j] ?? '' })
    }
  }

  return {
    name: `AI + ${industry}`,
    emoji: ext('emoji') || '📊',
    oneLiner: ext('oneLiner') || `${industry}行业AI分析报告`,
    stage: (ext('stage') && VALID_STAGES.includes(ext('stage'))) ? ext('stage') : 'growth',
    heroDeck: ext('heroDeck') || `AI正在重塑${industry}`,
    heroHook: ext('heroHook') || '',
    tags: [{ label: `${industry}`, variant: 'hot' }],
    headlineMetrics: metrics.length >= 3 ? metrics : [
      { label: '市场规模', value: extNum('市场规模', 0).toString() || '—', unit: '', year: 2024, trend: 'flat' as const, source: '', insight: '' },
      { label: 'CAGR', value: extNum('CAGR', 0).toString() || '—', unit: '%', year: 2024, trend: 'flat' as const, source: '', insight: '' },
      { label: 'AI渗透率', value: '—', unit: '%', year: 2024, trend: 'flat' as const, source: '', insight: '' },
      { label: '关键壁垒', value: '—', unit: '', year: 2024, trend: 'flat' as const, source: '', insight: '' },
      { label: '头部市占率', value: '—', unit: '%', year: 2024, trend: 'flat' as const, source: '', insight: '' },
    ],
    valueChain: {
      upstream:   { name: vc('upstream') || `上游 · ${industry}原材料`, aiPenetration: 'low', nodes: [] },
      midstream:  { name: vc('midstream') || `中游 · ${industry}制造`, aiPenetration: 'medium', nodes: [] },
      downstream: { name: vc('downstream') || `下游 · ${industry}应用`, aiPenetration: 'medium', nodes: [] },
    },
    playerCategories: playerCats,
    aiOpportunities: opportunities,
    portersFive: VALID_FORCES.map(f => ({ force: f, intensity: 3, rationale: '数据恢复模式 — 请重新搜索' })),
    trends,
    myths,
    quiz,
    compareData: { market: '-', cagr: '-', cr5: '-', stage: '-', aiPenetration: '-', barrier: '-', salesCycle: '-', topPlayers: '-', strength: '-', weakness: '-' },
    sources: extractPlainSources(raw),
  }
}

function extractPlainSources(raw: string): string[] {
  const sources: string[] = []
  const m = raw.match(/"sources"\s*:\s*\[([\s\S]*?)\]/)
  if (!m) return ['⚠️ 部分数据已恢复，建议重新搜索']
  const re = /"([^"]{3,80})"/g
  let match
  while ((match = re.exec(m[1])) !== null) {
    if (!['label','value','unit','year','trend','source','growthRate','up','down','flat'].includes(match[1])) {
      sources.push(match[1])
    }
    if (sources.length >= 6) break
  }
  return sources.length > 0 ? sources : ['⚠️ 部分数据已恢复，建议重新搜索']
}

function sanitizeSchema(raw: any): any {
  // Ensure all required top-level fields exist
  const safe = { ...raw }

  safe.name = String(safe.name ?? '')
  safe.emoji = String(safe.emoji ?? '📊')
  safe.oneLiner = String(safe.oneLiner ?? '')
  safe.stage = VALID_STAGES.includes(safe.stage) ? safe.stage : 'growth'
  safe.heroDeck = String(safe.heroDeck ?? '')
  safe.heroHook = String(safe.heroHook ?? '')
  safe.tags = Array.isArray(safe.tags) ? safe.tags : []

  // sanitize headlineMetrics — trim to exactly 5 if LLM outputs extra
  safe.headlineMetrics = Array.isArray(safe.headlineMetrics)
    ? safe.headlineMetrics.slice(0, 5).map((m: any) => ({
        label: String(m.label ?? ''),
        value: String(m.value ?? ''),
        unit: m.unit ? String(m.unit) : undefined,
        year: typeof m.year === 'number' ? m.year : 2024,
        growthRate: typeof m.growthRate === 'number' ? m.growthRate : undefined,
        trend: VALID_TRENDS.includes(m.trend) ? m.trend : 'up',
        source: String(m.source ?? ''),
        insight: String(m.insight ?? ''),
      }))
    : []

  // sanitize valueChain
  function sanitizeLayer(raw: any, fallbackName: string) {
    if (!raw || typeof raw !== 'object') return { name: fallbackName, aiPenetration: 'medium', nodes: [] }
    return {
      name: String(raw.name ?? fallbackName),
      aiPenetration: VALID_PENETRATION.includes(raw.aiPenetration) ? raw.aiPenetration : 'medium',
      nodes: Array.isArray(raw.nodes) ? raw.nodes.map((n: any) => ({
        name: String(n.name ?? ''),
        valueShare: typeof n.valueShare === 'number' ? n.valueShare : 0,
        marginRange: Array.isArray(n.marginRange) && n.marginRange.length === 2
          ? [Number(n.marginRange[0]) || 0, Number(n.marginRange[1]) || 0] as [number, number]
          : [0, 0] as [number, number],
      })) : [],
    }
  }
  safe.valueChain = {
    upstream: sanitizeLayer(raw.valueChain?.upstream, '上游 · 基础设施'),
    midstream: sanitizeLayer(raw.valueChain?.midstream, '中游 · 核心技术'),
    downstream: sanitizeLayer(raw.valueChain?.downstream, '下游 · 应用服务'),
  }

  // sanitize playerCategories
  safe.playerCategories = Array.isArray(safe.playerCategories) ? safe.playerCategories.map((cat: any) => ({
    category: String(cat.category ?? ''),
    players: Array.isArray(cat.players) ? cat.players.map((p: any) => ({
      name: String(p.name ?? ''),
      description: String(p.description ?? ''),
    })) : [],
  })) : []

  // sanitize aiOpportunities
  safe.aiOpportunities = Array.isArray(safe.aiOpportunities) ? safe.aiOpportunities.map((o: any) => ({
    title: String(o.title ?? ''),
    maturityScore: Math.min(5, Math.max(1, Number(o.maturityScore) || 3)),
    valueCeilingScore: Math.min(5, Math.max(1, Number(o.valueCeilingScore) || 3)),
    verdict: VALID_VERDICTS.includes(o.verdict) ? o.verdict : 'steady',
  })) : []

  // sanitize portersFive — validate force names
  safe.portersFive = Array.isArray(safe.portersFive) ? safe.portersFive.map((f: any) => ({
    force: VALID_FORCES.includes(f.force) ? f.force : (VALID_FORCES[0] ?? '新进入者威胁'),
    intensity: Math.min(5, Math.max(1, Number(f.intensity) || 3)),
    rationale: String(f.rationale ?? ''),
  })) : []

  // sanitize trends
  safe.trends = Array.isArray(safe.trends) ? safe.trends.map((t: any) => ({
    title: String(t.title ?? ''),
    body: String(t.body ?? ''),
    callout: String(t.callout ?? ''),
  })) : []

  // sanitize myths
  safe.myths = Array.isArray(safe.myths) ? safe.myths.map((m: any) => ({
    myth: String(m.myth ?? ''),
    reality: String(m.reality ?? ''),
  })) : []

  // sanitize quiz
  safe.quiz = Array.isArray(safe.quiz) ? safe.quiz.map((q: any) => ({
    question: String(q.question ?? ''),
    options: Array.isArray(q.options) ? q.options.slice(0, 4).map(String) : ['', '', '', ''],
    correctIndex: typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < 4 ? q.correctIndex : 0,
    explanation: String(q.explanation ?? ''),
  })) : []

  // sanitize compareData
  safe.compareData = {
    market: String(raw.compareData?.market ?? ''),
    cagr: String(raw.compareData?.cagr ?? ''),
    cr5: String(raw.compareData?.cr5 ?? ''),
    stage: String(raw.compareData?.stage ?? ''),
    aiPenetration: String(raw.compareData?.aiPenetration ?? ''),
    barrier: String(raw.compareData?.barrier ?? ''),
    salesCycle: String(raw.compareData?.salesCycle ?? ''),
    topPlayers: String(raw.compareData?.topPlayers ?? ''),
    strength: String(raw.compareData?.strength ?? ''),
    weakness: String(raw.compareData?.weakness ?? ''),
  }

  // sanitize sources
  safe.sources = Array.isArray(safe.sources) ? safe.sources.map(String) : []

  return safe
}

export async function POST(req: Request) {
  let full = '' // scoped outside try for catch-block access

  try {
    const { industry } = await req.json()

    if (!industry || typeof industry !== 'string' || industry.trim().length === 0) {
      return Response.json({ error: 'Industry name is required' }, { status: 400 })
    }

    const config = getLLMConfig()

    if (!config.apiKey) {
      // Fallback: no API key
      const fallback = buildFallback(industry.trim())
      return Response.json({ data: fallback, fallback: true })
    }

    // Collect full LLM response (stream internally, return all at once)
    full = ''
    const systemPrompt = SYSTEM_PROMPT.replace(/\{industry\}/g, industry.trim())
    const userMessage = `请分析「${industry.trim()}」行业，输出完整的JSON报告。直接输出JSON，不要加任何解释。`

    if (config.provider === 'anthropic') {
      const Anthropic = (await import('@anthropic-ai/sdk')).default
      const client = new Anthropic({ apiKey: config.apiKey })
      const stream = await client.messages.create({
        model: config.model,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: Math.max(config.maxTokens, 16384),
        stream: true,
      })
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          full += event.delta.text
        }
      }
    } else {
      // OpenAI-compatible
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
          max_tokens: Math.max(config.maxTokens, 16384),
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

    // Parse and sanitize
    const parsed = parseJSONFromLLM(full)
    const data = sanitizeSchema(parsed)

    return Response.json({ data })
  } catch (e: any) {
    console.error('[analyze] First attempt failed:', e.message)

    // ─── Layer 6: field-level extraction from broken JSON ─────
    try {
      const { industry } = await req.clone().json().catch(() => ({ industry: 'unknown' }))
      const extracted = extractFieldsFromRaw(full ?? '', industry.trim())
      const partial = sanitizeSchema(extracted)

      // If we got real metrics, return the partially-recovered result
      const hasRealData = partial.headlineMetrics?.some((m: any) => m.value && m.value !== '—' && m.value !== '0')
      if (hasRealData) {
        console.log('[analyze] Layer 6: recovered partial data via field extraction')
        return Response.json({ data: partial, partialRecovery: true })
      }
    } catch { /* continue to retry */ }

    // ─── Layer 7: retry with shortened prompt ─────────────────
    try {
      const { industry } = await req.clone().json().catch(() => ({ industry: 'unknown' }))
      if (industry) {
        console.log('[analyze] Layer 7: retrying with compact prompt for', industry)
        const shortSystemPrompt = buildCompactPrompt(industry.trim())
        const userMessage = `请分析「${industry.trim()}」行业，用精简格式输出JSON。`

        const config = getLLMConfig()
        let retryFull = ''

        // Anthropic path
        if (config.provider === 'anthropic') {
          const Anthropic = (await import('@anthropic-ai/sdk')).default
          const client = new Anthropic({ apiKey: config.apiKey })
          const stream = await client.messages.create({
            model: config.model,
            system: shortSystemPrompt,
            messages: [{ role: 'user', content: userMessage }],
            max_tokens: Math.max(config.maxTokens, 8192),
            stream: true,
          })
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              retryFull += event.delta.text
            }
          }
        } else {
          // OpenAI-compatible path
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
                { role: 'system', content: shortSystemPrompt },
                { role: 'user', content: userMessage },
              ],
              max_tokens: Math.max(config.maxTokens, 16384),
              stream: true,
            }),
          })

          if (res.ok) {
            const reader = res.body?.getReader()
            if (reader) {
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
                    const content = JSON.parse(data).choices?.[0]?.delta?.content
                    if (content) retryFull += content
                  } catch { /* skip */ }
                }
              }
            }
          }
        }

        // Try to parse retry response
        if (retryFull) {
          const retryParsed = parseJSONFromLLM(retryFull)
          const retryData = sanitizeSchema(retryParsed)
          console.log('[analyze] Layer 7: retry succeeded')
          return Response.json({ data: retryData, retried: true })
        }
      }
    } catch (retryErr: any) {
      console.error('[analyze] Layer 7 retry also failed:', retryErr.message)
    }

    // ─── Last resort: empty fallback ──────────────────────────
    try {
      const { industry } = await req.clone().json().catch(() => ({ industry: 'unknown' }))
      return Response.json({ data: buildFallback(industry), fallback: true })
    } catch {
      return Response.json({ error: e.message ?? 'Internal server error' }, { status: 500 })
    }
  }
}

// Layer 7 compact prompt: ~60% of original length, no quiz/compareData, minimal descriptions
function buildCompactPrompt(industry: string): string {
  return `你是一位行业分析顾问。分析「${industry}」行业，输出纯JSON（不要代码块，以{开头}结尾）。

{
  "name": "AI + ${industry}", "emoji": "📊", "oneLiner": "X字以内", "stage": "growth",
  "heroDeck": "15字以内", "heroHook": "30字以内判断句",
  "tags": [{"label": "标签", "variant": "hot"}],
  "headlineMetrics": [
    {"label":"市场规模","value":"数字","unit":"亿","year":2024,"growthRate":0.38,"trend":"up","source":"来源","insight":"一句话"}

  ],
  "valueChain": {
    "upstream":{"name":"上游","aiPenetration":"low","nodes":[{"name":"环节","valueShare":30,"marginRange":[10,20]}]},
    "midstream":{"name":"中游","aiPenetration":"medium","nodes":[]},
    "downstream":{"name":"下游","aiPenetration":"high","nodes":[]}
  },
  "playerCategories": [
    {"category":"巨头","players":[{"name":"公司","description":"差异化"}]},
    {"category":"垂直龙头","players":[]},
    {"category":"AI创业","players":[]},
    {"category":"隐形冠军","players":[]}
  ],
  "aiOpportunities": [
    {"title":"具体AI场景","maturityScore":3,"valueCeilingScore":4,"verdict":"scaling"}
  ],
  "portersFive": [
    {"force":"新进入者威胁","intensity":3,"rationale":"理由"},
    {"force":"供应商议价能力","intensity":3,"rationale":"理由"},
    {"force":"买方议价能力","intensity":3,"rationale":"理由"},
    {"force":"替代品威胁","intensity":3,"rationale":"理由"},
    {"force":"现有竞争者强度","intensity":3,"rationale":"理由"}
  ],
  "trends":[{"title":"","body":"","callout":""}],
  "myths":[{"myth":"","reality":""}],
  "sources":["来源1","来源2"]
}

核心要求：1)指标恰好5个(市场规模/CAGR/集中度/壁垒/市占率) 2)五力恰好5个，force值精确 3)描述每项不超过20字 4)数字具体 5)输出小于6000 tokens`
}

function buildFallback(industry: string): any {
  return {
    name: `AI + ${industry}`,
    emoji: '📊',
    oneLiner: `${industry}行业正在经历技术驱动的深刻变革，AI的渗透正在重构价值链的每一个环节。`,
    stage: 'growth' as const,
    heroDeck: `AI正在重塑${industry}的每一个环节`,
    heroHook: '请配置 LLM API Key 获取AI生成的深度分析',
    tags: [{ label: 'AI生成' }],
    headlineMetrics: [
      { label: '市场规模', value: '—', unit: '', year: 2024, trend: 'flat', source: '', insight: '请配置API Key后重新分析以获得具体数据' },
      { label: 'CAGR', value: '—', unit: '%', year: 2024, trend: 'flat', source: '', insight: '请配置API Key后重新分析以获得具体数据' },
      { label: 'AI渗透率', value: '—', unit: '%', year: 2024, trend: 'flat', source: '', insight: '请配置API Key后重新分析以获得具体数据' },
      { label: '市场集中度', value: '—', unit: '%', year: 2024, trend: 'flat', source: '', insight: '请配置API Key后重新分析以获得具体数据' },
      { label: '关键指标', value: '—', unit: '', year: 2024, trend: 'flat', source: '', insight: '请配置API Key后重新分析以获得具体数据' },
    ],
    valueChain: {
      upstream: { name: '上游 · 基础设施', aiPenetration: 'low', nodes: [{ name: '原材料/基础设施', valueShare: 30, marginRange: [15, 30] }] },
      midstream: { name: '中游 · 核心技术', aiPenetration: 'medium', nodes: [{ name: '技术平台/产品', valueShare: 35, marginRange: [20, 40] }] },
      downstream: { name: '下游 · 应用服务', aiPenetration: 'medium', nodes: [{ name: '终端应用/服务', valueShare: 35, marginRange: [20, 35] }] },
    },
    playerCategories: [
      { category: '巨头/平台型', players: [{ name: '请配置 API Key', description: '设置 LLM_PROVIDER 和 LLM_API_KEY 环境变量后重新分析' }] },
      { category: '垂直领域龙头', players: [] },
      { category: 'AI创业新锐', players: [] },
      { category: '隐形冠军', players: [] },
    ],
    aiOpportunities: [],
    portersFive: [
      { force: '新进入者威胁', intensity: 3, rationale: '请配置API Key后重新分析' },
      { force: '供应商议价能力', intensity: 3, rationale: '请配置API Key后重新分析' },
      { force: '买方议价能力', intensity: 3, rationale: '请配置API Key后重新分析' },
      { force: '替代品威胁', intensity: 3, rationale: '请配置API Key后重新分析' },
      { force: '现有竞争者强度', intensity: 3, rationale: '请配置API Key后重新分析' },
    ],
    trends: [],
    myths: [],
    quiz: [],
    compareData: { market: '-', cagr: '-', cr5: '-', stage: '-', aiPenetration: '-', barrier: '-', salesCycle: '-', topPlayers: '-', strength: '-', weakness: '-' },
    sources: ['⚠️ 当前为降级模式。请在 .env.local 中设置 LLM_PROVIDER 和 LLM_API_KEY，详见 .env.example'],
  }
}
