/**
 * 行业查询归一化——缓存键、反馈键、搜索 hasCache 检查的唯一来源。
 *
 * 三处必须使用同一个归一化函数，否则：
 *   - analyze 写缓存用 A 规则，search 查缓存用 B 规则 → hasCache 永假
 *   - feedback 写反馈用 A 规则，promote 读反馈用 B 规则 → 升级候选找不到反馈
 *
 * 规则：trim → 小写 → 去掉 "AI +" 前缀 → 去掉 行业/产业/领域 后缀 → 空格转连字符。
 */
export function normalizeQuery(q: string): string {
  return q
    .trim()
    .toLowerCase()
    .replace(/^ai\s*\+\s*/, '')
    .replace(/行业|产业|领域$/g, '')
    .replace(/\s+/g, '-')
}
