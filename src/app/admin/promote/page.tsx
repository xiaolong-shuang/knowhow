import { kvGet, kvKeys, isKVEnabled } from '@/lib/kv'
export const dynamic = 'force-dynamic'

export default async function AdminPromotePage() {
  const kvStatus = isKVEnabled()
  const existingSlugs = ['healthcare', 'education', 'finance']  // 后续从 content.ts 动态读取

  const allKeys = await kvKeys('cache:*')
  const cacheKeys = allKeys.filter(k => k.startsWith('cache:') && k.split(':').length === 2)

  const candidates = (await Promise.all(
    cacheKeys.map(async (k) => {
      const slug = k.replace('cache:', '')
      if (existingSlugs.includes(slug)) return null
      const cached = await kvGet<{ data: any; timestamp: number }>(k)
      if (!cached) return null
      const upvotes = await kvGet<number>(`feedback:${slug}:upvotes`).then(v => v ?? 0)
      const downvotes = await kvGet<number>(`feedback:${slug}:downvotes`).then(v => v ?? 0)
      const total = upvotes + downvotes
      const rating = total > 0 ? Math.round((upvotes / total) * 100) : null
      const ageDays = (Date.now() - cached.timestamp) / 86400000
      const eligible = ageDays >= 3 && upvotes >= 2 && (rating ?? 0) >= 75
      return { slug, name: cached.data.name ?? slug, timestamp: cached.timestamp, upvotes, downvotes, rating, eligible, ageDays }
    })
  )).filter((c): c is NonNullable<typeof c> => c !== null)

  const sorted = candidates.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

  return (
    <div className="max-w-[1160px] mx-auto px-[72px] py-12 max-[768px]:px-5">
      <h1 className="font-serif text-[2.2rem] font-black text-ink mb-2">升级候选</h1>
      <p className="text-[0.82rem] text-cool-gray mb-6">
        满足条件（≥3天 + ≥2赞 + 好评率≥75%）的缓存可升级为静态行业。
        {!kvStatus && <span className="ml-3 text-amber border border-amber/40 bg-amber/5 px-2 py-0.5 text-[0.7rem]">KV 未配置</span>}
      </p>
      {sorted.length === 0 ? (
        <p className="text-warm-gray">暂无满足升级条件的缓存条目。</p>
      ) : (
        <table className="w-full text-[0.82rem]">
          <thead><tr className="border-b-2 border-ink text-left">
            <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase">行业</th>
            <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase">缓存天数</th>
            <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase text-center">👍</th>
            <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase text-center">👎</th>
            <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase text-center">好评率</th>
            <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase">操作</th>
          </tr></thead>
          <tbody>{sorted.map((c) => (
            <tr key={c.slug} className="border-b border-rule-light">
              <td className="py-2.5 pr-4 text-ink font-medium">
                {c.name}
                <div className="text-[0.65rem] text-cool-gray font-mono">{c.slug}</div>
              </td>
              <td className="py-2.5 pr-4 font-mono text-[0.7rem] text-cool-gray">{c.ageDays.toFixed(1)} 天</td>
              <td className="py-2.5 pr-4 text-center font-mono text-green">{c.upvotes}</td>
              <td className="py-2.5 pr-4 text-center font-mono text-crimson">{c.downvotes}</td>
              <td className="py-2.5 pr-4 text-center font-mono">
                {c.rating !== null ? (
                  <span className={c.eligible ? 'text-green font-semibold' : 'text-cool-gray'}>{c.rating}%</span>
                ) : <span className="text-cool-gray/50">—</span>}
              </td>
              <td className="py-2.5 pr-4">
                <a href={`/analysis/${c.slug}`} target="_blank"
                   className="text-crimson text-[0.72rem] hover:underline mr-3">预览</a>
                {c.eligible && (
                  <span className="text-[0.72rem] text-cool-gray">
                    运行: <code className="text-[0.68rem] bg-warm-bg px-1 py-0.5 font-mono">
                      node scripts/promote-to-static.mjs --slug={c.slug} --name=&quot;{c.name}&quot;
                    </code>
                  </span>
                )}
              </td>
            </tr>
          ))}</tbody>
        </table>
      )}
      <div className="mt-8 border-t border-rule-light pt-6">
        <h2 className="font-serif text-[1.1rem] font-bold text-ink mb-3">升级说明</h2>
        <ol className="text-[0.82rem] text-warm-gray space-y-2 list-decimal list-inside">
          <li>点击"预览"确认内容质量（无幻觉、数字合理、来源可靠）</li>
          <li>在本地终端执行升级脚本（需要 KV 环境变量）</li>
          <li>在 src/lib/content.ts 的 getIndustryList() 中添加该行业的 IndustryCard</li>
          <li>pnpm build 确认无错误后 git commit &amp; push</li>
        </ol>
      </div>
    </div>
  )
}
