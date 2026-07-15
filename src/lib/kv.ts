import { kv } from '@vercel/kv'

const KV_ENABLED = Boolean(process.env.KV_URL || process.env.KV_REST_API_URL)

export async function kvGet<T>(key: string): Promise<T | null> {
  if (!KV_ENABLED) return null
  try { return await kv.get<T>(key) } catch { return null }
}

export async function kvSet(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
  if (!KV_ENABLED) return
  try {
    if (ttlSeconds) await kv.set(key, value, { ex: ttlSeconds })
    else await kv.set(key, value)
  } catch { /* 降级 */ }
}

export async function kvIncr(key: string): Promise<number> {
  if (!KV_ENABLED) return 0
  try { return await kv.incr(key) } catch { return 0 }
}

/** 模式匹配获取 key 列表，底层用 Redis SCAN */
export async function kvKeys(pattern: string): Promise<string[]> {
  if (!KV_ENABLED) return []
  try {
    const result = await (kv as any).keys?.(pattern)
    return Array.isArray(result) ? result : []
  } catch { return [] }
}

export function isKVEnabled(): boolean { return KV_ENABLED }
