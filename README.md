# KnowHow · 行业认知加速器

> 30 分钟，建立对一个行业的深度认知

专为 AI 产品经理打造的行业 Know-How 引擎——**输入任意行业名称，AI 自动生成三层渐进式深度分析**（L1 概览 → L2 产业链 → L3 洞察 + 知识测验），同时内置 3 个精选静态行业和 AI 驱动的双行业对比。

## 快速开始

```bash
git clone <repo-url>
cd industry-knowhow
pnpm install
pnpm dev  # → http://localhost:3101
```

打开 http://localhost:3101 即可体验。

**无需配置任何 API Key**——AI 功能自动使用本地模拟，所有功能开箱即用。配置真实 LLM 后获得完整 AI 分析体验（见下方）。

## 功能

### AI 行业分析（核心）
在首页搜索框或 `/analyze` 页面输入任意行业名称（如"覆铜板""跨境电商""固态电池"），AI 自动生成：

1. **L1 · 行业概览** — 5 个核心数据指标（市场规模 / CAGR / 集中度 / 壁垒指标 / 头部市占率）+ 波特五力 + AI 机会矩阵
2. **L2 · 产业链结构** — 上中下游可视化价值地图（价值占比 + 毛利率区间 + AI 渗透率标注）+ 竞争格局（四类玩家）
3. **L3 · 深度洞察** — 结构性趋势 + 圈外人常犯的认知误区 + 可操作建议
4. **知识测验** — 3 道选择题，答案在前文中可验证

### 行业浏览器
3 个静态精选行业（AI + 医疗健康 / 教育 / 金融科技），三层渐进式信息架构 + 产业链地图 + 数据大字报 + 知识测验。

### AI 行业对比
输入任意两个行业（如"新能源 VS 半导体"），AI 生成：

- **核心数据对比** — 双行业指标并列卡片
- **5 维度判决** — 市场规模 / 增长速度 / AI 就绪度 / 壁垒强度 / 综合建议
- **AI 机会矩阵** — 各行业 Top 3 AI 机会点 + 成熟度评分
- **决策矩阵** — 选 A / 选 B 理由 + 不同优先级下的推荐

### AI 智能问答
侧滑聊天面板，支持：

- **流式对话** — 边生成边显示，Markdown 渲染
- **智能快捷提问** — 根据当前页面（行业详情/AI 分析/首页）自动切换推荐问题
- **多 LLM 支持** — Anthropic / OpenAI / DeepSeek / 任意 OpenAI 兼容接口
- **本地降级** — 无 API Key 时自动使用内置行业知识库模拟回答

### 问题精选
`/ask` 页面收录高频行业分析问题，作为灵感入口。

## 配置 AI（可选 · 支持多种 LLM）

```bash
# 1. 复制配置模板
cp .env.example .env.local

# 2. 编辑 .env.local，选择你的 LLM
```

**不配置也能用**——AI 自动降级为本地模拟。

### 方式一：预设提供商

```bash
LLM_PROVIDER=deepseek          # DeepSeek（国内可用，性价比高）
LLM_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# LLM_PROVIDER=anthropic       # Claude
# LLM_API_KEY=sk-ant-api03-xxxxxxxxxxxxx

# LLM_PROVIDER=openai          # GPT-4o
# LLM_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 方式二：自定义兼容接口

```bash
LLM_PROVIDER=custom
LLM_API_KEY=sk-xxxx
LLM_BASE_URL=https://your-api.com/v1/chat/completions
LLM_MODEL=your-model
```

支持阿里百炼、硅基流动、火山引擎、Ollama 等任意 OpenAI 兼容接口。详细配置见 `.env.example`。

## 项目结构

```
src/
├── app/
│   ├── page.tsx                        # 首页 — 行业网格 + 搜索入口
│   ├── analyze/
│   │   ├── page.tsx                    # AI 行业分析页（服务端）
│   │   └── analyze-content.tsx         # AI 分析客户端 — 生成态 & 成果态
│   ├── industry/[slug]/
│   │   ├── page.tsx                    # 静态行业详情页（SSG）
│   │   └── loading.tsx                 # 加载骨架屏
│   ├── compare/page.tsx                # AI 行业对比页
│   ├── ask/page.tsx                    # 问题精选
│   ├── not-found.tsx                   # 404 页
│   ├── error.tsx                       # 全局错误边界
│   └── api/
│       ├── analyze/route.ts            # AI 行业分析 API（JSON 结构化输出）
│       ├── compare/route.ts            # AI 行业对比 API
│       └── chat/route.ts               # AI 聊天 API（流式）
├── components/
│   ├── ui/                             # 设计系统原语（breadcrumb, tag, rule, toast 等）
│   ├── layout/                         # Masthead, Footer, Providers, SectionTabs
│   ├── home/                           # 首页 — HeroSearch, IndustryGrid, IndustryCard
│   ├── industry/                       # 行业详情 — L1/L2/L3 组件, ValueChainMap, PlayerGrid, Quiz
│   ├── compare/                        # 对比页 — MetricCards, Verdicts, Opportunities, Decision
│   └── chat/                           # AI 聊天 — ChatPanel, ChatMessages, QuickPrompts, ChatFAB
├── data/industries/                    # 静态行业 JSON 内容库
│   ├── healthcare.json
│   ├── education.json
│   └── finance.json
├── lib/
│   ├── ai.ts                           # LLM Provider 注册 & 流式请求（Anthropic/OpenAI/DeepSeek）
│   ├── content.ts                      # 静态行业内容加载
│   └── utils.ts                        # 工具函数 & 常量
├── stores/chat.ts                      # Zustand 聊天状态管理（流式/消息/面板）
└── types.ts                            # TypeScript 类型定义
```

## 添加新行业（静态）

1. 在 `src/data/industries/` 下创建 `your-industry.json`（格式参考 `healthcare.json`）
2. 在 `src/lib/content.ts` 的 `getIndustryList()` 中添加卡片信息
3. 在 `src/app/industry/[slug]/page.tsx` 的 `generateStaticParams()` 中添加 slug

**但更建议直接使用 AI 分析功能**——在首页搜索框输入行业名即可自动生成完整报告，无需手动编写 JSON。

## 设计系统

Editorial 风格，灵感来自 The Economist / Stripe Press：

| Token | 色值 | 用途 |
|-------|------|------|
| `cream` | #FFFDF9 | 页面背景 |
| `ink` | #1A1A1A | 主文字 |
| `crimson` | #C41E3A | 强调色 |
| `rule-gray` | #D1D1D1 | 分割线 |

## 技术栈

- **Next.js 16**（App Router + Turbopack）
- **TypeScript**（strict）
- **Tailwind CSS 4** + 自定义设计 Token
- **Zustand**（聊天状态管理 & 流式控制）
- **React Markdown** + remark-gfm（聊天渲染）
- **多 LLM 支持** — Anthropic Claude / OpenAI / DeepSeek / 自定义兼容接口
- **API Routes** — `/api/analyze`, `/api/compare`, `/api/chat`

## License

MIT
