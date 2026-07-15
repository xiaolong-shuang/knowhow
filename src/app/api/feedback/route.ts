import { NextResponse } from 'next/server'
import { kvGet, kvSet, kvIncr } from '@/lib/kv'
import { normalizeQuery } from '@/lib/normalize'

export async function POST(req: Request) {
  try {
    const { query, rating, comment, anonymousId } = await req.json()
    if (!query || !rating || !['up', 'down'].includes(rating)) {
      return NextResponse.json({ error: '无效参数' }, { status: 400 })
    }
    // 归一化与缓存键一致——保证 promote 能按 slug 找到反馈
    const normalized = normalizeQuery(query)
    // 防重复
    const previousVote = await kvGet<string>(`vote:${normalized}:${anonymousId}`)
    if (previousVote) return NextResponse.json({ ok: true, duplicate: true })
    await kvSet(`vote:${normalized}:${anonymousId}`, rating, 30 * 86400)
    await kvIncr(`feedback:${normalized}:${rating}votes`)
    if (comment && rating === 'down') {
      const existing = await kvGet<string[]>(`feedback:${normalized}:comments`) ?? []
      existing.push(`${anonymousId?.slice(0, 8)}: ${comment.slice(0, 200)}`)
      await kvSet(`feedback:${normalized}:comments`, existing, 30 * 86400)
    }
    console.log(`[feedback] anon=${anonymousId?.slice(0, 8)}... query=${normalized} rating=${rating}`)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: '内部错误' }, { status: 500 })
  }
}
