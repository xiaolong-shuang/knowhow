import { kvSet, kvIncr, isKVEnabled } from './kv'

export interface TrackEvent {
  type: 'search' | 'search_click' | 'analyze' | 'chat' | 'compare' | 'feedback'
  anonymousId: string
  payload: Record<string, unknown>
  timestamp: number
}

/** fire-and-forget 事件追踪。不 await KV 写入，降级为 console.log */
export function trackEvent(event: Omit<TrackEvent, 'timestamp'>): void {
  const fullEvent: TrackEvent = { ...event, timestamp: Date.now() }
  const key = `events:${event.type}:${Date.now()}`
  if (isKVEnabled()) { kvSet(key, fullEvent, 30 * 86400).catch(() => {}) }
  console.log(`[event] ${event.type}`, `anon=${event.anonymousId.slice(0, 8)}...`, JSON.stringify(event.payload).slice(0, 200))
}

/** 热榜计数器。key 做归一化：trim + 小写 + 去所有空格 */
export function incrementStat(category: 'searches' | 'industries', key: string): void {
  const normalized = key.toLowerCase().trim().replace(/\s+/g, '')
  if (isKVEnabled()) { kvIncr(`stats:${category}:${normalized}`).catch(() => {}) }
  console.log(`[stat] ${category}:${normalized}`)
}
