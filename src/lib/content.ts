import type { IndustrySchema, IndustryCard } from '@/types'

const DATA_DIR = 'src/data'

/** Load the industry registry (all industries metadata) */
export async function getIndustryList(): Promise<IndustryCard[]> {
  const list: IndustryCard[] = [
    {
      slug: 'healthcare',
      name: 'AI + 医疗健康',
      emoji: '🏥',
      description: '从AI辅助诊断到药物研发，技术正在重塑医疗的每一个环节',
      tags: [{ label: '热门', variant: 'hot' }, { label: '200+亿市场' }, { label: '40% CAGR' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'education',
      name: 'AI + 教育',
      emoji: '📚',
      description: '个性化学习路径、智能批改、虚拟教师——教育的AI变革正在发生',
      tags: [{ label: '150+亿市场' }, { label: '25% CAGR' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'finance',
      name: 'AI + 金融科技',
      emoji: '💰',
      description: '智能风控、量化交易、智能客服——金融是AI渗透率最高的行业之一',
      tags: [{ label: '热门', variant: 'hot' }, { label: '500+亿市场' }, { label: '30% CAGR' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'manufacturing',
      name: 'AI + 智能制造',
      emoji: '🏭',
      description: '工业视觉质检、预测性维护、数字孪生——制造业智能化升级的核心场景',
      tags: [{ label: '300+亿市场' }, { label: '35% CAGR' }],
      status: 'coming_soon',
      hasContent: false,
    },
    {
      slug: 'autonomous',
      name: 'AI + 自动驾驶',
      emoji: '🚗',
      description: '从L2到L4，从乘用车到Robotaxi——自动驾驶正在跨越商业化的鸿沟',
      tags: [{ label: '热门', variant: 'hot' }, { label: '1000+亿市场' }, { label: '45% CAGR' }],
      status: 'coming_soon',
      hasContent: false,
    },
    {
      slug: 'retail',
      name: 'AI + 零售电商',
      emoji: '🛒',
      description: '智能推荐、动态定价、需求预测——AI正在重塑零售的每一个触点',
      tags: [{ label: '200+亿市场' }, { label: '28% CAGR' }],
      status: 'coming_soon',
      hasContent: false,
    },
  ]
  return list
}

/** Get live industry slugs for generateStaticParams */
export function getLiveIndustrySlugs(): string[] {
  return ['healthcare', 'education', 'finance']
}

/** Load a full industry schema by slug */
export async function getIndustrySchema(slug: string): Promise<IndustrySchema> {
  const data = await import(`@/data/industries/${slug}.json`)
  return data.default ?? data
}
