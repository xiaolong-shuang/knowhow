import { kvGet, kvKeys, isKVEnabled } from '@/lib/kv'
export const dynamic = 'force-dynamic'

export default async function AdminCachePage() {
  const kvStatus = isKVEnabled()
  const keys = await kvKeys('cache:*')
  const cacheKeys = keys.filter(k => k.startsWith('cache:') && k.split(':').length === 2)

  const entries = await Promise.all(cacheKeys.map(async (k) => {
    const query = k.replace('cache:', '')
    const cached = await kvGet<{ data: unknown; timestamp: number }>(k)
    const upvotes = await kvGet<number>(`feedback:${query}:upvotes`).then(v => v ?? 0)
    const downvotes = await kvGet<number>(`feedback:${query}:downvotes`).then(v => v ?? 0)
    const total = upvotes + downvotes
    const rating = total > 0 ? Math.round((upvotes / total) * 100) : null
    return { query, timestamp: cached?.timestamp ?? 0, upvotes, downvotes, rating }
  }))
  const sorted = entries.sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className="max-w-[1160px] mx-auto px-[72px] py-12 max-[768px]:px-5">
      <h1 className="font-serif text-[2.2rem] font-black text-ink mb-2">缓存条目</h1>
      <p className="text-[0.82rem] text-cool-gray mb-10">
        {sorted.length} 条缓存
        {!kvStatus && (
          <span className="ml-3 text-amber border border-amber/40 bg-amber/5 px-2 py-0.5 text-[0.7rem]">
            KV 存储未配置
          </span>
        )}
      </p>
      {sorted.length === 0 ? (
        <p className="text-warm-gray">暂无缓存条目。</p>
      ) : (
        <table className="w-full text-[0.82rem]">
          <thead><tr className="border-b-2 border-ink text-left">
            <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em]">搜索词</th>
            <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em]">缓存时间</th>
            <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em] text-center">👍</th>
            <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em] text-center">👎</th>
            <th className="py-2 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em] text-center">好评率</th>
          </tr></thead>
          <tbody>{sorted.map((entry) => (
            <tr key={entry.query} className="border-b border-rule-light">
              <td className="py-2.5 pr-4 text-ink font-medium">{entry.query}</td>
              <td className="py-2.5 pr-4 font-mono text-[0.7rem] text-cool-gray">{entry.timestamp > 0 ? new Date(entry.timestamp).toLocaleString('zh-CN') : '—'}</td>
              <td className="py-2.5 pr-4 text-center font-mono text-green">{entry.upvotes}</td>
              <td className="py-2.5 pr-4 text-center font-mono text-crimson">{entry.downvotes}</td>
              <td className="py-2.5 text-center font-mono">
                {entry.rating !== null ? (
                  <span className={entry.rating >= 70 ? 'text-green font-semibold' : entry.rating <= 40 ? 'text-crimson font-semibold' : 'text-cool-gray'}>{entry.rating}%</span>
                ) : <span className="text-cool-gray/50">—</span>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      )}
      <div className="mt-8 border-t border-rule-light pt-6">
        <p className="text-[0.78rem] text-cool-gray mb-4">
          <code className="text-[0.72rem] bg-warm-bg px-1 py-0.5 font-mono">node scripts/enrich-search-index.mjs</code>
          {' '}从搜索日志自动补充搜索索引
        </p>
        <a href="/admin/promote" className="text-crimson text-[0.78rem] hover:underline">查看升级候选 →</a>
      </div>
    </div>
  )
}
