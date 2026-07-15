import type { MetadataRoute } from 'next'
import { getLiveIndustrySlugs } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://knowhow-demo.vercel.app'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/analyze`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/ask`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
  ]

  const industryPages = getLiveIndustrySlugs().map((slug) => ({
    url: `${baseUrl}/industry/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // 将已缓存的 analysis 页面加入 sitemap
  let analysisUrls: MetadataRoute.Sitemap = []
  try {
    const { kvKeys } = await import('@/lib/kv')
    const cacheKeys = await kvKeys('cache:*')
    const slugs = cacheKeys
      .filter(k => k.startsWith('cache:') && k.split(':').length === 2)
      .map(k => k.replace('cache:', ''))
    analysisUrls = slugs.slice(0, 50).map(slug => ({
      url: `${baseUrl}/analysis/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    // KV 未配置时跳过动态 analysis URL——不抛错
  }

  return [...staticPages, ...industryPages, ...analysisUrls]
}
