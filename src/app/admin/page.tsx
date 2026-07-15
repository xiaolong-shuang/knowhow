import { kvGet, kvKeys, isKVEnabled } from '@/lib/kv'
import type { TrackEvent } from '@/lib/events'
export const dynamic = 'force-dynamic'

// StatCard 子组件（内联）
function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="border border-rule-light bg-white/60 p-5">
      <div className="font-serif text-[2.2rem] font-black text-ink leading-none mb-1">
        {value}{unit && <span className="text-[0.9rem] font-normal text-cool-gray ml-1">{unit}</span>}
      </div>
      <div className="text-[0.72rem] text-cool-gray font-medium tracking-[0.02em]">{label}</div>
    </div>
  )
}

// 读取最近 N 条事件
async function getRecentEvents(type: string, limit: number): Promise<TrackEvent[]> {
  const keys = await kvKeys(`events:${type}:*`)
  const sorted = keys.sort((a, b) => b.localeCompare(a)).slice(0, limit)
  const events = await Promise.all(sorted.map(async (k) => {
    const evt = await kvGet<TrackEvent>(k)
    return evt
  }))
  return events.filter((e): e is TrackEvent => e !== null)
}

export default async function AdminPage() {
  const kvStatus = isKVEnabled()
  const [ cacheHitCount, cacheMissCount, searchKeys, industryKeys, recentAnalyzeEvents ] = await Promise.all([
    kvGet<number>('stats:cache:hits').then(v => v ?? 0),
    kvGet<number>('stats:cache:misses').then(v => v ?? 0),
    kvKeys('stats:searches:*'),
    kvKeys('stats:industries:*'),
    getRecentEvents('analyze', 20),
  ])
  const totalCache = cacheHitCount + cacheMissCount
  const hitRate = totalCache > 0 ? Math.round((cacheHitCount / totalCache) * 100) : 0

  // 搜索热榜 Top 10
  const searchCounts = await Promise.all(searchKeys.map(async (k) => {
    const query = k.replace('stats:searches:', '')
    const count = await kvGet<number>(k)
    return { query, count: count ?? 0 }
  }))
  const searchTop10 = searchCounts.sort((a, b) => b.count - a.count).slice(0, 10)

  // 行业热度 Top 10
  const industryCounts = await Promise.all(industryKeys.map(async (k) => {
    const industry = k.replace('stats:industries:', '')
    const count = await kvGet<number>(k)
    return { industry, count: count ?? 0 }
  }))
  const industryTop10 = industryCounts.sort((a, b) => b.count - a.count).slice(0, 10)

  return (
    <div className="max-w-[1160px] mx-auto px-[72px] py-12 max-[768px]:px-5">
      <h1 className="font-serif text-[2.2rem] font-black text-ink mb-2">KnowHow 仪表盘</h1>
      <p className="text-[0.82rem] text-cool-gray mb-10">
        Sprint 2 · 缓存 & 事件追踪状态
        {!kvStatus && (
          <span className="ml-3 text-amber border border-amber/40 bg-amber/5 px-2 py-0.5 text-[0.7rem]">
            KV 存储未配置——数据为本地模拟值。部署到 Vercel 并绑定 KV 实例后自动激活。
          </span>
        )}
      </p>
      <div className="grid grid-cols-4 gap-4 mb-12 max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1">
        <StatCard label="缓存命中" value={String(cacheHitCount)} unit="次" />
        <StatCard label="缓存未命中" value={String(cacheMissCount)} unit="次" />
        <StatCard label="命中率" value={String(hitRate)} unit="%" />
        <StatCard label="KV 状态" value={kvStatus ? '已连接' : '未配置'} unit="" />
      </div>
      <div className="grid grid-cols-2 gap-8 mb-12 max-[768px]:grid-cols-1">
        <div>
          <h2 className="font-serif text-[1.1rem] font-bold text-ink mb-4">搜索热榜 Top 10</h2>
          {searchTop10.length === 0 ? (
            <p className="text-[0.8rem] text-cool-gray">暂无数据。</p>
          ) : (
            <table className="w-full text-[0.82rem]">
              <thead><tr className="border-b-2 border-ink text-left">
                <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em]">排名</th>
                <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em]">搜索词</th>
                <th className="py-2 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em] text-right">次数</th>
              </tr></thead>
              <tbody>{searchTop10.map((item, i) => (
                <tr key={item.query} className="border-b border-rule-light">
                  <td className="py-2.5 pr-4 font-mono text-cool-gray">{i + 1}</td>
                  <td className="py-2.5 pr-4 text-ink">{item.query}</td>
                  <td className="py-2.5 text-right font-mono text-crimson font-semibold">{item.count}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
        <div>
          <h2 className="font-serif text-[1.1rem] font-bold text-ink mb-4">行业热度 Top 10</h2>
          {industryTop10.length === 0 ? (
            <p className="text-[0.8rem] text-cool-gray">暂无数据。</p>
          ) : (
            <table className="w-full text-[0.82rem]">
              <thead><tr className="border-b-2 border-ink text-left">
                <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em]">排名</th>
                <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em]">行业</th>
                <th className="py-2 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em] text-right">分析次数</th>
              </tr></thead>
              <tbody>{industryTop10.map((item, i) => (
                <tr key={item.industry} className="border-b border-rule-light">
                  <td className="py-2.5 pr-4 font-mono text-cool-gray">{i + 1}</td>
                  <td className="py-2.5 pr-4 text-ink">{item.industry}</td>
                  <td className="py-2.5 text-right font-mono text-crimson font-semibold">{item.count}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
      <div>
        <h2 className="font-serif text-[1.1rem] font-bold text-ink mb-4">最近分析请求</h2>
        {recentAnalyzeEvents.length === 0 ? (
          <p className="text-[0.8rem] text-cool-gray">暂无事件。</p>
        ) : (
          <table className="w-full text-[0.82rem]">
            <thead><tr className="border-b-2 border-ink text-left">
              <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em]">时间</th>
              <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em]">用户</th>
              <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em]">行业</th>
              <th className="py-2 pr-4 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em]">缓存</th>
              <th className="py-2 font-serif font-bold text-ink text-[0.7rem] uppercase tracking-[0.06em]">状态</th>
            </tr></thead>
            <tbody>{recentAnalyzeEvents.map((evt, i) => (
              <tr key={i} className="border-b border-rule-light">
                <td className="py-2.5 pr-4 font-mono text-[0.7rem] text-cool-gray">{new Date(evt.timestamp).toLocaleString('zh-CN')}</td>
                <td className="py-2.5 pr-4 font-mono text-[0.7rem] text-cool-gray">{evt.anonymousId?.slice(0, 8)}...</td>
                <td className="py-2.5 pr-4 text-ink">{String(evt.payload.industry ?? '-')}</td>
                <td className="py-2.5 pr-4">{evt.payload.cacheHit ? <span className="text-[0.68rem] text-green">命中</span> : <span className="text-[0.68rem] text-cool-gray">—</span>}</td>
                <td className="py-2.5">{evt.payload.parseSuccess ? <span className="text-[0.68rem] text-green">成功</span> : <span className="text-[0.68rem] text-crimson">失败</span>}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  )
}
