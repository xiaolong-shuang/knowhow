/**
 * KnowHow · 行业分析测评脚本
 *
 * 用法:
 *   1. 确保 dev server 正在 3101 端口运行
 *   2. node eval/run.mjs [--parallel N]
 *
 * 输出:
 *   - eval/results.json      每条 case 的原始结果
 *   - eval/report.json       汇总评分
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const API = 'http://localhost:3101/api/analyze'
const PARALLEL = parseInt(process.argv[process.argv.indexOf('--parallel') + 1], 10) || 3

// ─── 模糊词 / 安全措辞 匹配 ────────────────────────────────────
const VAGUE_WORDS = /\b(较大|较多|较快|较好|非常|很|比较|一定|可能|差不多|大概|一些|许多|若干|不少)\b/g
const HEDGE_WORDS = /\b(取决于|需要观察|有待|可能|或许|既可以|也可以|两边各有|因人而异|视情况|具体情况|根据实际情况|最终取决于|目前尚不明确|尚不清楚|还不明朗|仍需观察|还要看|还需要时间|时机尚未成熟|好坏各半|有利有弊|同时存在|双向的|一方面.*另一方面)\b/g

// ─── 单条 case 测评 ────────────────────────────────────────────
async function evaluate(caseDef, index) {
  const start = Date.now()
  const result = {
    index,
    industry: caseDef.industry,
    category: caseDef.category,
    difficulty: caseDef.difficulty,
    parseSuccess: false,
    errors: [],
    metrics: {},
  }

  let raw
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industry: caseDef.industry }),
    })
    raw = await res.json()
  } catch (e) {
    result.errors.push(`Network/parse error: ${e.message}`)
    result.latencyMs = Date.now() - start
    return result
  }

  result.latencyMs = Date.now() - start

  // ▸ 1. 解析成功
  if (raw.error) {
    result.errors.push(`API error: ${raw.error}`)
    result.parseSuccess = false
    return result
  }
  const d = raw.data
  if (!d) {
    result.errors.push('No data field in response')
    return result
  }
  result.parseSuccess = true

  // ▸ 2. 行业名匹配
  const nameLower = (d.name || '').toLowerCase()
  const inputLower = caseDef.industry.toLowerCase()
  result.nameMatch = nameLower.includes(inputLower) || inputLower.includes(nameLower)

  // ▸ 3. L1 指标完整性
  const metrics = d.headlineMetrics || []
  result.metricCount = metrics.length
  const metricsFull = metrics.filter(m => m.label && m.value && m.value !== '—')
  result.metricFullCount = metricsFull.length

  // ▸ 4. 有无模糊词
  const jsonStr = JSON.stringify(d)
  result.vagueCount = (jsonStr.match(VAGUE_WORDS) || []).length
  result.hedgeCount = (jsonStr.match(HEDGE_WORDS) || []).length

  // ▸ 5. L2 产业链
  const vc = d.valueChain || {}
  const totalNodes =
    (vc.upstream?.nodes || []).length +
    (vc.midstream?.nodes || []).length +
    (vc.downstream?.nodes || []).length
  result.chainNodeCount = totalNodes

  // ▸ 6. 竞争格局
  const players = d.playerCategories || []
  result.playerCategoryCount = players.length
  result.totalPlayerCount = players.reduce((s, c) => s + (c.players || []).length, 0)

  // ▸ 7. AI 机会
  result.opportunityCount = (d.aiOpportunities || []).length

  // ▸ 8. 波特五力
  const p5 = d.portersFive || []
  result.portersComplete = p5.length === 5

  // ▸ 9. 洞察
  result.trendCount = (d.trends || []).length
  result.mythCount = (d.myths || []).length

  // ▸ 10. Quiz
  result.quizCount = (d.quiz || []).length

  // ▸ 11. 来源
  result.sourceCount = (d.sources || []).length

  return result
}

// ─── 总体评分 ───────────────────────────────────────────────────
function computeReport(results) {
  const total = results.length
  const successes = results.filter(r => r.parseSuccess)
  const failures = results.filter(r => !r.parseSuccess)

  const avg = (arr, key) => {
    const vals = arr.map(r => r[key]).filter(v => typeof v === 'number')
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0
  }

  return {
    summary: {
      total,
      parseRate: `${successes.length}/${total} (${((successes.length / total) * 100).toFixed(0)}%)`,
      avgLatencyMs: avg(results, 'latencyMs'),
      nameMatchRate: `${successes.filter(r => r.nameMatch === true).length}/${successes.length}`,
    },
    structure: {
      avgMetricCount: avg(successes, 'metricFullCount'),
      avgChainNodes: avg(successes, 'chainNodeCount'),
      avgPlayerCount: avg(successes, 'totalPlayerCount'),
      avgOpportunityCount: avg(successes, 'opportunityCount'),
      avgQuizCount: avg(successes, 'quizCount'),
      portersComplete: `${successes.filter(r => r.portersComplete).length}/${successes.length}`,
      avgSourceCount: avg(successes, 'sourceCount'),
    },
    quality: {
      avgVagueWords: avg(successes, 'vagueCount'),
      avgHedgeWords: avg(successes, 'hedgeCount'),
      casesWithVague: successes.filter(r => r.vagueCount > 0).length,
      casesWithHedge: successes.filter(r => r.hedgeCount > 0).length,
    },
    byDifficulty: {}, // filled below
    failures: failures.map(r => ({ industry: r.industry, errors: r.errors })),
    perCase: results.map(r => ({
      industry: r.industry,
      difficulty: r.difficulty,
      latencyS: (r.latencyMs / 1000).toFixed(1),
      ok: r.parseSuccess,
      errors: r.errors,
      metrics: `${r.metricFullCount || 0}/${r.metricCount || 0}`,
      nodes: r.chainNodeCount,
      players: r.totalPlayerCount,
      opps: r.opportunityCount,
      quiz: r.quizCount,
      vague: r.vagueCount,
      hedge: r.hedgeCount,
    })),
  }
}

// ─── 按难度分组 ─────────────────────────────────────────────────
function diffReport(report, results, label) {
  const subset = results.filter(r => r.parseSuccess && r.difficulty === label)
  if (!subset.length) return { count: 0 }
  return {
    count: subset.length,
    avgMetricCount: +subset.reduce((s, r) => s + r.metricFullCount, 0).toFixed(1) / subset.length,
    avgChainNodes: +subset.reduce((s, r) => s + r.chainNodeCount, 0).toFixed(1) / subset.length,
    avgVague: +subset.reduce((s, r) => s + r.vagueCount, 0).toFixed(1) / subset.length,
    avgHedge: +subset.reduce((s, r) => s + r.hedgeCount, 0).toFixed(1) / subset.length,
  }
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  const cases = JSON.parse(readFileSync(resolve(__dirname, 'cases.json'), 'utf8'))
  console.log(`\n🧪 KnowHow 测评启动 · ${cases.length} 条用例 · 并发 ${PARALLEL}\n`)

  const results = []
  // 分批并发
  for (let i = 0; i < cases.length; i += PARALLEL) {
    const batch = cases.slice(i, i + PARALLEL)
    const batchResults = await Promise.all(batch.map((c, j) => evaluate(c, i + j + 1)))
    results.push(...batchResults)
    // 进度
    const done = i + batch.length
    const ok = results.filter(r => r.parseSuccess).length
    console.log(`  [${String(done).padStart(2)}/${cases.length}] 累计解析成功 ${ok}/${done}`)
  }

  // 生成报告
  const report = computeReport(results)
  report.byDifficulty = {
    easy:   diffReport(report, results, 'easy'),
    medium: diffReport(report, results, 'medium'),
    hard:   diffReport(report, results, 'hard'),
  }

  writeFileSync(resolve(__dirname, 'results.json'), JSON.stringify(results, null, 2), 'utf8')
  writeFileSync(resolve(__dirname, 'report.json'), JSON.stringify(report, null, 2), 'utf8')

  // 终端输出摘要
  console.log('\n' + '═'.repeat(56))
  console.log('📊 测评报告')
  console.log('═'.repeat(56))
  console.log(`  解析成功率: ${report.summary.parseRate}`)
  console.log(`  平均延迟:   ${report.summary.avgLatencyMs}ms`)
  console.log(`  行业名匹配: ${report.summary.nameMatchRate}`)
  console.log('─'.repeat(56))
  console.log('  [结构完整性]')
  console.log(`    平均指标数:  ${report.structure.avgMetricCount}/5`)
  console.log(`    产业链节点:  ${report.structure.avgChainNodes}`)
  console.log(`    玩家总数:    ${report.structure.avgPlayerCount}`)
  console.log(`    AI 机会:     ${report.structure.avgOpportunityCount}`)
  console.log(`    Quiz 题数:   ${report.structure.avgQuizCount}`)
  console.log(`    五力完整:    ${report.structure.portersComplete}`)
  console.log('─'.repeat(56))
  console.log('  [质量]')
  console.log(`    平均模糊词:  ${report.quality.avgVagueWords}`)
  console.log(`    平均安全措辞: ${report.quality.avgHedgeWords}`)
  console.log('─'.repeat(56))
  console.log('  [按难度]')
  for (const [diff, d] of Object.entries(report.byDifficulty)) {
    if (d.count) console.log(`    ${diff}: ${d.count}条 | 指标${d.avgMetricCount}/5 | 节点${d.avgChainNodes} | 模糊词${d.avgVague} | 安全措辞${d.avgHedge}`)
  }
  if (report.failures.length) {
    console.log('─'.repeat(56))
    console.log('  [失败]')
    report.failures.forEach(f => console.log(`    ✗ ${f.industry}: ${f.errors.join('; ')}`))
  }
  console.log('═'.repeat(56))
  console.log('详细结果: eval/results.json')
  console.log('汇总报告: eval/report.json\n')
}

main().catch(e => { console.error(e); process.exit(1) })
