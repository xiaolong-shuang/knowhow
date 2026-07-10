# KnowHow · 行业认知加速器

> 输入一个行业名，AI 30 秒生成深度分析报告——面向 AI 产品经理的行业 Know-How 引擎。

<p align="center">
  <img src="docs/demo.gif" alt="KnowHow 演示" width="720">
</p>

<p align="center">
  <a href="https://github.com/xiaolong-shuang/knowhow/blob/main/LICENSE"><img src="https://img.shields.io/github/license/xiaolong-shuang/knowhow" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16"></a>
  <a href="#"><img src="https://img.shields.io/badge/LLM-DeepSeek%20%7C%20Claude%20%7C%20GPT-4o-blue" alt="LLM"></a>
  <a href="#"><img src="https://img.shields.io/badge/%E8%A7%A3%E6%9E%90%E6%88%90%E5%8A%9F%E7%8E%87-98%25-green" alt="解析成功率 98%"></a>
</p>

---

## 为什么做

市面上的行业分析要么是咨询报告（**贵**——动辄数万一份，**慢**——等两周出 PDF，**不切题**——不知道 PM 关心什么），要么是搜索引擎结果（碎片化、无判断、不结构化）。

KnowHow 做了一件事：**输入一个行业名，给你一份有判断力、有具体数字、面向 PM 视角的三层深度分析**——L1 概览 → L2 产业链 → L3 洞察 + 知识测验。30 秒出结果。

> 专为 AI 产品经理设计：覆盖 40+ 行业领域，98% 解析成功率，零模糊词零安全措辞。

---

## 快速开始

```bash
git clone https://github.com/xiaolong-shuang/knowhow.git
cd industry-knowhow
pnpm install
pnpm dev  # → http://localhost:3101
```

**无需配置任何 API Key**——AI 自动降级为本地模拟，所有功能开箱即用。接入真实 LLM 获得完整体验（[配置说明](#配置-ai可选--支持多种-llm)）。

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

- **3 个精选行业**（AI 医疗 / AI 教育 / AI 金融）每个独立 SSG 页面，三层渐进式信息架构
- **`/ask` 问题精选页** — 高频行业分析问题集合，快速获取灵感

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
│   │   └── analyze-content.tsx          # AI 分析客户端 — 生成态 & 成果态
│   ├── industry/[slug]/
│   │   ├── page.tsx                     # 静态行业详情页（SSG）
│   │   └── loading.tsx                  # 加载骨架屏
│   ├── compare/page.tsx                 # AI 行业对比页
│   ├── ask/page.tsx                     # 问题精选
│   ├── not-found.tsx / error.tsx        # 错误处理
│   └── api/
│       ├── analyze/route.ts             # AI 行业分析（7 层 JSON 兜底解析 + 缩短重试）
│       ├── compare/route.ts             # AI 行业对比 API
│       └── chat/route.ts               # AI 聊天 Flow（多 LLM Provider 统一流式）
├── components/
│   ├── ui/                              # 设计系统原语
│   ├── layout/                          # 框架组件
│   ├── home/                            # 首页组件
│   ├── industry/                        # L1/L2/L3 组件 + ValueChainMap + PlayerGrid + Quiz
│   ├── compare/                         # 对比页组件（双行业卡片/判决/决策矩阵）
│   └── chat/                            # 聊天面板（消息/输入/快捷提问/悬浮按钮）
├── data/industries/                     # 静态行业 JSON 内容库
├── lib/ai.ts                            # LLM Provider 注册 & 统一流式（Anthropic→SDK | OpenAI/DeepSeek→REST）
├── stores/chat.ts                       # Zustand 聊天状态（消息/流式/面板）
├── types.ts                             # TypeScript 类型
└── eval/                                # 90 条行业测评集 + 自动化脚本
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

> 实测 86 条行业样本、40+ 领域，解析成功率 **98%**，零模糊词零安全措辞。

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
- **API Routes** — `/api/analyze` · `/api/compare` · `/api/chat`

---

## 添加静态行业

1. 在 `src/data/industries/` 创建 `your-industry.json`（参考 `healthcare.json`）
2. 在 `src/lib/content.ts` 的 `getIndustryList()` 添加卡片信息
3. 在 `src/app/industry/[slug]/page.tsx` 的 `generateStaticParams()` 添加 slug

**更推荐直接使用 AI 分析功能**——首页搜索框输入行业名即可自动生成完整报告，无需手动编写 JSON。

---

## License

MIT
