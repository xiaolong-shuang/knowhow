#!/usr/bin/env node
import { kv } from '@vercel/kv'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const indexPath = resolve(__dirname, '../src/data/search-index.json')
const index = JSON.parse(readFileSync(indexPath, 'utf-8'))

// 1. 读取搜索热榜
console.log('📊 读取搜索热榜...')
const searchKeys = (await kv.keys('stats:searches:*')).filter(Boolean)
const searchStats = {}
for (const k of searchKeys) {
  const query = k.replace('stats:searches:', '')
  const count = await kv.get(k)
  if (count) searchStats[query] = Number(count)
}

// 2. 读取搜索点击事件（最近 500 条）
console.log('📊 读取搜索点击事件...')
const clickKeys = (await kv.keys('events:search_click:*')).filter(Boolean)
const clickPairs = []
for (const k of clickKeys.slice(-500)) {
  const evt = await kv.get(k)
  if (evt && evt.payload) {
    clickPairs.push({ query: evt.payload.query, clickedSlug: evt.payload.clickedSlug })
  }
}

// 3. 自动补充 eval cases
let enrichedCount = 0
for (const entry of index) {
  if (entry.source !== 'eval') continue

  for (const query of Object.keys(searchStats)) {
    if (searchStats[query] < 3) continue
    if (query === entry.name) continue
    if (entry.aliases.includes(query) || (entry.searchKeywords || []).includes(query)) continue
    if (entry.name.includes(query) || query.includes(entry.name)) {
      if (!entry.searchKeywords) entry.searchKeywords = []
      entry.searchKeywords.push(query)
      enrichedCount++
    }
  }

  const clicksToThis = clickPairs.filter(p => p.clickedSlug === entry.slug)
  for (const click of clicksToThis) {
    if (!entry.aliases.includes(click.query) && entry.name !== click.query) {
      entry.aliases.push(click.query)
      enrichedCount++
    }
  }
}

// 4. 写回
writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8')
console.log(`✅ 已更新 search-index.json，${enrichedCount} 条别名/关键词被自动补充`)
if (enrichedCount === 0) {
  console.log('⚠️  没有足够的搜索日志数据。等用户产生更多搜索行为后再运行。')
}
console.log('💡 static 条目的变更请人工审核后手动修改 search-index.json。')
process.exit(0)
