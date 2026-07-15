#!/usr/bin/env node
import { kv } from '@vercel/kv'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const args = {}
for (const a of process.argv.slice(2)) {
  const [k, v] = a.replace(/^--/, '').split('=')
  args[k] = v
}
const slug = args.slug
if (!slug) { console.error('❌ 缺少 --slug=xxx 参数'); process.exit(1) }

console.log(`🔍 从 KV 读取 cache:${slug}...`)
const cached = await kv.get(`cache:${slug}`)
if (!cached) { console.error(`❌ KV 中不存在 cache:${slug}`); process.exit(1) }

const { data } = cached
if (!data || !data.headlineMetrics) {
  console.error('❌ 缓存数据不完整（缺少 headlineMetrics）')
  process.exit(1)
}

const industry = { ...data, slug }
const targetPath = resolve(__dirname, '../src/data/industries', `${slug}.json`)
writeFileSync(targetPath, JSON.stringify(industry, null, 2), 'utf-8')
console.log(`✅ 已写入 ${targetPath}`)

const indexPath = resolve(__dirname, '../src/data/search-index.json')
if (existsSync(indexPath)) {
  const index = JSON.parse(readFileSync(indexPath, 'utf-8'))
  const entry = index.find(e => e.slug === slug)
  if (entry) {
    entry.source = 'static'
    if (args.aliases) entry.aliases = args.aliases.split(',')
    if (args.name) entry.name = args.name
    writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8')
    console.log(`✅ 已更新 search-index.json: ${slug} → static`)
  } else {
    index.push({
      slug, name: args.name || data.name || slug,
      aliases: args.aliases ? args.aliases.split(',') : [],
      searchKeywords: [], source: 'static',
    })
    writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8')
    console.log(`✅ 已在 search-index.json 新增: ${slug}`)
  }
}

console.log('')
console.log('⚠️  下一步（手动操作）：')
console.log(`   1. 在 src/lib/content.ts 的 getIndustryList() 中添加 IndustryCard`)
console.log(`   2. pnpm build 确认无错误 → git add & commit & push`)
console.log('')
process.exit(0)
