import type { ChatMessage } from '@/types'

// ═══════════════════════════════════════════════════════════════════
// LLM Provider Registry — 用户可自由配置任意 OpenAI 兼容接口
// ═══════════════════════════════════════════════════════════════════

type Provider = 'anthropic' | 'openai' | 'deepseek' | 'custom'

interface LLMConfig {
  /** 提供商类型，决定请求格式 */
  provider: Provider
  /** API 地址 */
  baseURL: string
  /** API Key */
  apiKey: string
  /** 模型名称 */
  model: string
  /** 最大输出 token */
  maxTokens: number
  /** 额外 HTTP headers（用于自定义鉴权） */
  extraHeaders?: Record<string, string>
  /** 自定义 System Prompt 后缀（追加到默认 prompt 之后） */
  systemPromptSuffix?: string
}

// ─── 从环境变量读取 LLM 配置 ────────────────────────────────────
function getLLMConfig(): LLMConfig {
  const provider = (process.env.LLM_PROVIDER as Provider) ?? 'anthropic'

  const presets: Record<Provider, Partial<LLMConfig>> = {
    anthropic: {
      baseURL: 'https://api.anthropic.com/v1/messages',
      model: 'claude-sonnet-4-6',
      maxTokens: 1024,
    },
    openai: {
      baseURL: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o',
      maxTokens: 1024,
    },
    deepseek: {
      baseURL: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      maxTokens: 1024,
    },
    custom: {
      baseURL: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o',
      maxTokens: 1024,
    },
  }

  const preset = presets[provider] ?? presets.custom

  return {
    provider,
    baseURL: process.env.LLM_BASE_URL ?? preset.baseURL!,
    apiKey: process.env.LLM_API_KEY ?? process.env.ANTHROPIC_API_KEY ?? '',
    model: process.env.LLM_MODEL ?? preset.model!,
    maxTokens: Number(process.env.LLM_MAX_TOKENS) || preset.maxTokens!,
    extraHeaders: process.env.LLM_EXTRA_HEADERS
      ? JSON.parse(process.env.LLM_EXTRA_HEADERS)
      : undefined,
    systemPromptSuffix: process.env.LLM_SYSTEM_PROMPT_SUFFIX,
  }
}

// ─── System Prompt ───────────────────────────────────────────────
function buildSystemPrompt(industrySlug: string | null, suffix?: string): string {
  let prompt = `你是一个专业的行业分析助手，帮助AI产品经理快速理解行业know-how。${industrySlug ? `当前用户正在浏览「${industrySlug}」行业。` : ''}
回答要求：
- 使用中文，简洁有力
- 用短段落和要点列表组织内容，避免过长段落
- 适当使用 **粗体** 突出关键判断和数字
- 避免使用大表格（聊天面板空间有限，确需对比时才用）
- 每个关键判断标注来源
- 结尾用"[来源：xxx]"格式列出数据来源
- 如果问题超出行业范围，诚实说明`

  if (suffix) {
    prompt += '\n\n' + suffix
  }
  return prompt
}

// ─── 请求体构建 ──────────────────────────────────────────────────
function buildMessages(
  history: ChatMessage[],
  question: string,
  systemPrompt?: string,
): { messages: Array<{ role: string; content: string }>; headers: Record<string, string> } {
  const messages: Array<{ role: string; content: string }> = []

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }
  for (const m of history) {
    messages.push({ role: m.role, content: m.content })
  }
  messages.push({ role: 'user', content: question })

  return { messages, headers: { 'Content-Type': 'application/json' } }
}

// ─── OpenAI 兼容的流式请求（OpenAI / DeepSeek / 自定义） ───────
async function* streamOpenAICompatible(config: LLMConfig, history: ChatMessage[], question: string, industrySlug: string | null) {
  const systemPrompt = buildSystemPrompt(industrySlug, config.systemPromptSuffix)
  const { messages } = buildMessages(history, question, systemPrompt)

  const res = await fetch(config.baseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      ...config.extraHeaders,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
      stream: true,
    }),
  })

  if (!res.ok) {
    throw new Error(`LLM API error: ${res.status} ${res.statusText}`)
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
      if (data === '[DONE]') return

      try {
        const parsed = JSON.parse(data)
        const content = parsed.choices?.[0]?.delta?.content
        if (content) yield content
      } catch {
        // skip unparseable chunks
      }
    }
  }
}

// ─── Anthropic 流式请求 ─────────────────────────────────────────
async function* streamAnthropic(config: LLMConfig, history: ChatMessage[], question: string, industrySlug: string | null) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const systemPrompt = buildSystemPrompt(industrySlug, config.systemPromptSuffix)
  const { messages } = buildMessages(history, question) // no system role for Anthropic

  const client = new Anthropic({
    apiKey: config.apiKey,
    ...(config.baseURL !== 'https://api.anthropic.com/v1/messages' ? { baseURL: config.baseURL } : {}),
  })

  const stream = await client.messages.create({
    model: config.model,
    system: systemPrompt,
    messages: messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    max_tokens: config.maxTokens,
    stream: true,
  })

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text
    }
  }
}

// ─── 模拟降级（无 API Key 时自动使用） ──────────────────────────
const SIMULATED_RESPONSES: Record<string, string> = {
  default: '这是一个很好的问题。在当前行业分析框架中，我建议从以下角度思考：\n\n1. **产业链定位**：明确问题涉及上游（基础设施）、中游（技术平台）还是下游（应用服务）\n2. **成熟度评估**：技术成熟度和市场接受度是否匹配\n3. **竞争格局**：是否已有巨头入场，壁垒在哪里\n\n如果你能具体说明关注的是哪个行业，我可以给出更有针对性的分析。\n\n[来源：KnowHow AI 行业助手]',
  opportunity: '在 AI + 医疗健康领域，当前最大的三个机会点是：\n\n1. **医学影像辅助诊断** ★★★★★ — 技术最成熟，已有70+三类证获批，规模化条件最充分\n2. **AI 药物研发** ★★★★★ — 价值天花板最高，研发周期从5-7年压缩到18-24个月\n3. **健康管理/慢病管理** ★★★★☆ — 需求旺盛，可穿戴设备+AI干预形成闭环\n\n建议重点关注第一类——确定性最高。\n\n[来源：基于行业数据库中的 AI 机会矩阵分析]',
  certificate: '三类证（第三类医疗器械注册证）审批周期通常需要 **18-36 个月**。\n\n关键节点：\n· 临床试验方案设计（2-3个月）\n· 多中心临床试验（6-12个月）\n· NMPA技术审评（6-12个月）\n· 补充资料（3-6个月）\n\n截至2024年底，NMPA已批准70+张AI医疗器械三类证，AI影像辅助诊断类占比超80%。\n\n[来源：NMPA公开数据 & 行业调研]',
  players: 'AI药物研发领域核心玩家：\n\n**上市AI药企**：\n· 晶泰科技（港股）— 量子物理+AI药物发现平台\n· 英矽智能（港股）— 端到端AI药物研发\n\n**创业公司**：\n· 深势科技 — AI驱动分子模拟\n· 望石智慧 — AI药物设计平台\n\n差异化关键：同时掌握「AI算法」+「药物研发domain knowledge」才能建立壁垒。\n\n[来源：公开财务报告 & 行业访谈]',
  compare: '**AI医疗 vs AI金融** 关键差异：\n\n| 维度 | AI 医疗 | AI 金融 |\n|------|---------|--------|\n| 市场规模 | 200+亿 | 500+亿 |\n| 增速 | 40% | 30% |\n| 准入门槛 | 极高（三类证）| 高（牌照+合规）|\n| 销售周期 | 6-18个月 | 3-9个月 |\n\n· 追求确定性 → 金融AI（更成熟）\n· 追求天花板 → 医疗AI（护城河更深）\n\n[来源：KnowHow 行业对比框架]',
}

function matchResponseType(question: string): string {
  const q = question.toLowerCase()
  if (q.includes('机会') || q.includes('切入点') || q.includes('最大')) return 'opportunity'
  if (q.includes('三类证') || q.includes('审批') || q.includes('注册证')) return 'certificate'
  if (q.includes('药物研发') || q.includes('玩家') || q.includes('公司') || q.includes('企业')) return 'players'
  if (q.includes('对比') || q.includes('比较') || q.includes('vs')) return 'compare'
  return 'default'
}

// ─── 流式输出包装器 ─────────────────────────────────────────────
function streamToResponse(
  generator: AsyncGenerator<string, void, unknown>,
  signal?: AbortSignal,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          if (signal?.aborted) break
          controller.enqueue(encoder.encode(chunk))
        }
      } catch (e: any) {
        if (e.name !== 'AbortError') console.error('AI stream error:', e)
      } finally {
        controller.close()
      }
    },
    cancel() {},
  })
}

function simulateStream(type: string): ReadableStream<Uint8Array> {
  const text = SIMULATED_RESPONSES[type] ?? SIMULATED_RESPONSES.default
  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      for (const char of text) {
        controller.enqueue(encoder.encode(char))
        await new Promise((r) => setTimeout(r, 20 + Math.random() * 30))
      }
      controller.close()
    },
  })
}

// ─── 主入口 ─────────────────────────────────────────────────────
export async function generateAIResponse(
  question: string,
  industrySlug: string | null,
  history: ChatMessage[],
  signal?: AbortSignal,
): Promise<ReadableStream<Uint8Array>> {
  const config = getLLMConfig()

  // 无 API Key → 本地模拟
  if (!config.apiKey) {
    return simulateStream(matchResponseType(question))
  }

  try {
    let generator: AsyncGenerator<string, void, unknown>

    switch (config.provider) {
      case 'anthropic':
        generator = streamAnthropic(config, history, question, industrySlug)
        break
      case 'openai':
      case 'deepseek':
      case 'custom':
      default:
        generator = streamOpenAICompatible(config, history, question, industrySlug)
        break
    }

    return streamToResponse(generator, signal)
  } catch {
    // 降级到模拟
    return simulateStream(matchResponseType(question))
  }
}

// 导出 config 读取函数，供前端设置页使用
export { getLLMConfig }
export type { LLMConfig, Provider }
