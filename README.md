# KnowHow · 行业认知加速器

> 输入一个行业名，AI 30 秒生成深度分析报告——面向 AI 产品经理的行业 Know-How 引擎。

<p align="center">
  <img src="docs/demo.gif" alt="KnowHow 演示" width="720">
</p>

<p align="center">
  <a href="https://github.com/xiaolong-shuang/knowhow/blob/main/LICENSE"><img src="https://img.shields.io/github/license/xiaolong-shuang/knowhow" alt="License"></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js 16">
  <img src="https://img.shields.io/badge/LLM-DeepSeek%20%7C%20Claude%20%7C%20GPT--4o-blue" alt="LLM">
  <img src="https://img.shields.io/badge/parse--rate-98%25-green" alt="parse rate 98%">
</p>

---

## 为什么做

市面上的行业分析要么是咨询报告（**贵**——动辄数万一份，**慢**——等两周出 PDF，**不切题**——不知道 PM 关心什么），要么是搜索引擎结果（碎片化、无判断、不结构化）。

KnowHow 做了一件事：**输入一个行业名，给你一份有判断力、有具体数字、面向 PM 视角的三层深度分析**——L1 概览 → L2 产业链 → L3 洞察 + 知识测验。30 秒出结果。

> 专为 AI 产品经理设计：AI 可分析任意行业，15 个精选行业已沉淀为静态深度页，98% 解析成功率，零模糊词零安全措辞。

---

## 快速开始

```bash
git clone https://github.com/xiaolong-shuang/knowhow.git
cd industry-knowhow
pnpm install
pnpm dev  # → http://localhost:3101
```

**无需配置任何 API Key**——AI 自动降级为本地模拟，所有功能开箱即用。

> 🚀 部署到 Vercel 后即可在线体验（见下方「部署」章节）

---

## 核心功能

### 🤖 AI 行业分析 —— 任意行业，秒出报告

在搜索框输入行业名（如"覆铜板""跨境电商""固态电池""智能电表"），AI 自动生成四板块报告：

<table>
<tr>
<td width="25%"><b>L1 · 行业概览</b></td>
<td>5 核心指标（市场规模 / CAGR / 集中度 / 壁垒 / 市占率）+ 波特五力 + AI 机会矩阵</td>
</tr>
<tr>
<td><b>L2 · 产业链结构</b></td>
<td>上中下游可视化价值地图（价值占比 + 毛利率区间 + AI 渗透率标注）+ 四类玩家竞争格局</td>
</tr>
<tr>
<td><b>L3 · 深度洞察</b></td>
<td>结构性趋势 + 圈外人常见认知误区 + 可操作建议</td>
</tr>
<tr>
<td><b>知识测验</b></td>
<td>3 道选择题，答案在前文中可验证 —— 帮你自测是否真正理解了</td>
</tr>
</table>

### ⚖️ AI 行业对比 —— 赛道选型利器

输入任意两个行业（如"新能源 VS 半导体"），AI 生成：

- **双行业核心数据卡片** — 指标并列对比
- **5 维度判决** — 市场规模 / 增速 / AI 就绪度 / 壁垒 / 综合结论，带 winner 标注
- **决策矩阵** — 不同优先级（确定性/天花板/速赢/长期）下的推荐
- **AI 机会矩阵** — 各赛道 Top AI 机会点含成熟度评分

### 💬 AI 智能问答 —— 全页面上下文感知

侧滑聊天面板：

- **流式对话 + Markdown 渲染** — 支持表格、列表、粗体
- **页面感知快捷提问** — 在行业详情页自动切换该行业的推荐问题，在分析页切当前查询
- **多 LLM 切换** — Anthropic Claude / OpenAI GPT-4o / DeepSeek / 自定义兼容接口
- **零依赖降级** — 无 API Key 时自动使用内置知识库模拟，所有功能不受影响

### 📚 静态精选 + 灵感入口

- **15 个精选行业**（医疗 / 教育 / 金融 / AIGC / 半导体 / 自动驾驶 / 固态电池 / 网络安全 / 低空经济 / 无人机·eVTOL / AI 药物研发 / 药物发现 / 创新药 / 工业机器人 / 新能源）每个独立 SSG 页面，三层渐进式信息架构，作为 SEO 落地页
- **`/ask` 问题精选页** — 高频行业分析问题集合，快速获取灵感

### 🔍 智能搜索 · 反馈闭环 · Admin 仪表盘

- **语义搜索** — 首页搜索下拉，本地别名/关键词匹配 + AI 语义 fallback + 缓存命中标记，点击直达静态页或触发 AI 生成
- **👍/👎 反馈 + 升级闭环** — 分析页可投票 + 反向评论收集；满足条件（≥3 天 + ≥2 赞 + 好评率 ≥75%）的缓存进入升级候选页，一键 promote 为静态行业
- **Admin 仪表盘**（`/admin`，密码保护）— 缓存命中率 / 搜索热榜 / 行业热度 / 最近分析事件，缓存条目与升级候选可视化
- **Vercel KV 缓存** — 分析结果 14 天缓存，命中即返回不调用 LLM；未配置 KV 时自动降级，所有功能不受影响
- **SEO** — 动态 `sitemap.xml` + `robots.txt` + 每页 OpenGraph metadata

---

## Demo 案例：AI 分析"智能电表"

<details>
<summary>点击展开：L1 概览摘要</summary>

| 指标 | 数值 | 趋势 | 来源 |
|------|------|------|------|
| 2024年全球市场规模 | 386 亿美元 | ↑ | Frost & Sullivan |
| 2020-2024 CAGR | 6.2% | → | IEA |
| AI 渗透率 | <5% | ↑ | 行业调研 (估算) |
| CR5 | 48% | → | Prismark |
| 生益科技市占率 | 22% | ↑ | Prismark |

> insight: AI 渗透率不足 5%，产线质检和预测性维护是最大蓝海切入点。

**波特五力**：新进入者威胁 4/5 · 供应商议价能力 3/5 · 买方议价能力 4/5 · 替代品威胁 2/5 · 现有竞争者强度 4/5

**AI 机会 Top 3**：AI 驱动的电表产线缺陷检测 · 基于大模型的负荷预测 · 智能异常用电识别与反窃电

</details>

<details>
<summary>点击展开：L2 产业链结构（摘要）</summary>

```
上游 · 电子元器件 (AI渗透: low)      毛利率 8-22%
  ↕
中游 · 电表制造与集成 (AI渗透: medium) 毛利率 15-35%
  ↕
下游 · 电力公司/电网 (AI渗透: high)   毛利率 20-45%
```
</details>

> 完整分析体验 → clone 项目后打开 http://localhost:3101/analyze?q=智能电表

---

## 项目结构

```
src/
├── app/
│   ├── page.tsx                         # 首页 — 行业网格 + 搜索入口
│   ├── analyze/
│   │   ├── page.tsx                     # AI 行业分析页（服务端）
│   │   └── analyze-content.tsx          # AI 分析客户端 — 生成态 & 成果态 + 反馈条
│   ├── industry/[slug]/                 # 静态行业详情页（SSG，15 个）
│   ├── analysis/[slug]/page.tsx         # 缓存分析 ISR 页（社区验证徽章 + 降级页）
│   ├── compare/page.tsx                 # AI 行业对比页
│   ├── ask/page.tsx                     # 问题精选
│   ├── admin/                           # Admin 仪表盘 / 缓存 / 升级候选 / 登录
│   ├── sitemap.ts                       # 动态 sitemap（静态页 + KV 缓存页）
│   ├── not-found.tsx / error.tsx        # 错误处理
│   └── api/
│       ├── analyze/route.ts             # AI 行业分析（7 层兜底 + KV 缓存 + 入参校验）
│       ├── compare/route.ts             # AI 行业对比 API
│       ├── chat/route.ts               # AI 聊天 Flow（多 LLM 统一流式）
│       ├── search/route.ts              # 语义搜索（本地匹配 + AI fallback + 缓存检查）
│       └── feedback/route.ts            # 👍/👎 反馈（防重复 + 评论收集）
├── components/
│   ├── ui/                              # 设计系统原语
│   ├── layout/                          # 框架组件
│   ├── home/                            # 首页组件（含 hero-search + search-dropdown）
│   ├── industry/                        # L1/L2/L3 组件 + ValueChainMap + PlayerGrid + Quiz
│   ├── compare/                         # 对比页组件（双行业卡片/判决/决策矩阵）
│   ├── chat/                            # 聊天面板（消息/输入/快捷提问/悬浮按钮）
│   └── shared/feedback-bar.tsx          # 反馈条 UI
├── data/
│   ├── industries/                      # 15 个静态行业 JSON 内容库
│   └── search-index.json                # 搜索索引（static/eval 来源 + 别名/关键词）
├── lib/
│   ├── ai.ts                            # LLM Provider 注册 & 统一流式
│   ├── kv.ts                            # Vercel KV 抽象（未配置自动降级）
│   ├── events.ts                        # fire-and-forget 事件追踪 + 热榜统计
│   ├── normalize.ts                     # 查询归一化（缓存/反馈/搜索共用）
│   ├── chat-context.ts                  # Chat 行业上下文 4 级压缩
│   └── anonymous-id.ts                  # 匿名用户 ID
├── stores/                              # Zustand（chat / analyze 状态）
├── middleware.ts                        # Admin 密码保护
├── scripts/                             # promote-to-static / enrich-search-index CLI
├── types.ts                             # TypeScript 类型
└── eval/                                # 行业测评集 + 自动化脚本
```

---

## 配置 AI（可选 · 支持多种 LLM）

```bash
cp .env.example .env.local   # 复制模板
# 编辑 .env.local，选择 LLM
```

**不配置也能用**——AI 自动降级为本地模拟。

### 方式一：预设提供商（最简）

```bash
LLM_PROVIDER=deepseek          # DeepSeek（国内可用，性价比最高）
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

支持阿里百炼、硅基流动、火山引擎、Ollama 等任意 OpenAI 兼容接口。详见 `.env.example`。

---

## 技术亮点

### 7 层 JSON 解析兜底

LLM 输出 JSON 结构常因 token 截断而损坏。KnowHow 实现了渐进式修复管线：

| Layer | 机制 | 成本 |
|-------|------|------|
| L0 | System Prompt 内建 token 预算 ≤ 12000，字段 ≤ 30 字 | 0 |
| L1-L4 | 直接解析 → fence 提取 → brace 定位 → 轻量修复 | 0 |
| L5 | 未闭合 `{}[]"` 自动补齐 | 0 |
| L6 | 正则逐字段提取（metrics/players/opportunities/trends/myths/quiz） | 0 |
| L7 | 缩短版 Prompt 重试（~60% 长度） | ~30s / 次 |

> 实测行业样本、多领域，解析成功率 **98%**，零模糊词零安全措辞。

完整兜底链：**KV 缓存命中** → **无 API Key 降级** → **5 层 JSON 修复** → **L6 字段提取** → **L7 精简重试** → **最终降级 schema**。任一环节失败都不裸奔 500，保证用户始终拿到可渲染的结果。

### Vercel KV + 自动降级

缓存、反馈、事件追踪、Admin 数据全部基于 Vercel KV（Upstash Redis）。`lib/kv.ts` 封装了 `kvGet/kvSet/kvIncr/kvKeys`，**未配置 KV 时全部 no-op 降级**——本地开发零配置开箱即用，部署后绑定 KV 自动激活，代码无需改动。

### 页面智能感知聊天

聊天面板根据当前页面自动切换推荐问题——行业详情页推该行业的问题、分析页推当前查询的问题、首页推通用高频问题。

### 设计系统

Editorial 风格，灵感来自 The Economist / Stripe Press：

| Token | 色值 | 用途 |
|-------|------|------|
| `cream` | `#FFFDF9` | 页面背景 |
| `ink` | `#1A1A1A` | 主文字 |
| `crimson` | `#C41E3A` | 强调色 |
| `rule-gray` | `#D1D1D1` | 分割线 |

---

## 技术栈

- **Next.js 16**（App Router + Turbopack）· **TypeScript**（strict）
- **Tailwind CSS 4** + 自定义设计 Token
- **Zustand**（聊天状态 & 流式控制）· **React Markdown** + remark-gfm
- **多 LLM** — Anthropic SDK / OpenAI REST / DeepSeek / 自定义兼容
- **Vercel KV**（Upstash Redis）缓存 + 事件追踪，未配置自动降级
- **Middleware** — Admin 密码保护（Cookie）
- **API Routes** — `/api/analyze` · `/api/compare` · `/api/chat` · `/api/search` · `/api/feedback`

---

## 添加静态行业

**推荐路径 · 升级闭环**（AI 生成 + 社区验证 + 一键沉淀）：

1. 用户在首页搜索行业名 → AI 生成分析 → 自动缓存到 KV（14 天）
2. 用户在分析页 👍/👎 反馈
3. 满足条件（≥3 天 + ≥2 赞 + 好评率 ≥75%）的缓存出现在 `/admin/promote` 升级候选页
4. 运行 `node scripts/promote-to-static.mjs --slug=xxx --name="行业名"` 一键写入静态 JSON 并更新 search-index
5. 在 `src/lib/content.ts` 的 `getIndustryList()` + `getLiveIndustrySlugs()` 注册，`pnpm build` 后即上线

**手动路径**（直接编写）：

1. 在 `src/data/industries/` 创建 `your-industry.json`（参考 `healthcare.json`）
2. 在 `src/lib/content.ts` 的 `getIndustryList()` 添加卡片信息 + `getLiveIndustrySlugs()` 添加 slug
3. 在 `src/components/chat/chat-panel.tsx` 添加静态 import（Turbopack 不支持客户端变量路径 import）

> 也可直接用 AI 分析功能——首页搜索框输入行业名即自动生成完整报告，无需手动编写 JSON。

---

## 部署

### Vercel 部署

1. Fork 仓库 → Vercel 导入 → 框架自动识别为 Next.js
2. 环境变量（Vercel → Project → Settings → Environment Variables）：
   - `LLM_PROVIDER` / `LLM_API_KEY` — 必填，启用真实 AI（不填则降级为本地模拟）
   - `ADMIN_PASSWORD` — **强烈建议设置**，否则 `/admin` 仪表盘对所有人开放
3. KV 存储（Vercel → Storage → 创建 Upstash Redis → 连接项目）— 自动注入 `KV_URL` / `KV_REST_API_URL` / `KV_REST_API_TOKEN`，启用缓存/反馈/事件追踪
4. **替换域名**：`src/app/sitemap.ts` 与 `public/robots.txt` 中的 `knowhow-demo.vercel.app` 占位域名改为你的真实域名
5. 部署完成后提交 sitemap 到 Google Search Console / 百度站长平台

### 本地开发

```bash
pnpm install
pnpm dev      # → http://localhost:3101
pnpm build    # 生产构建
```

无需任何配置即可启动（AI 降级为本地模拟，KV 降级为 no-op）。

---

## License

MIT
