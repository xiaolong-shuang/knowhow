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
      tags: [{ label: '即将上线' }, { label: '300+亿市场' }, { label: '35% CAGR' }],
      status: 'coming_soon',
      hasContent: false,
    },
    {
      slug: 'autonomous',
      name: 'AI + 自动驾驶(乘用车)',
      emoji: '🚗',
      description: '从L2到L4，从乘用车到Robotaxi——自动驾驶正在跨越商业化的鸿沟',
      tags: [{ label: '即将上线' }, { label: '1000+亿市场' }, { label: '45% CAGR' }],
      status: 'coming_soon',
      hasContent: false,
    },
    {
      slug: 'retail',
      name: 'AI + 零售电商',
      emoji: '🛒',
      description: '智能推荐、动态定价、需求预测——AI正在重塑零售的每一个触点',
      tags: [{ label: '即将上线' }, { label: '200+亿市场' }, { label: '28% CAGR' }],
      status: 'coming_soon',
      hasContent: false,
    },
    // ── Sprint 3 冷启动新增 ──
    {
      slug: 'aigc',
      name: 'AI + AIGC',
      emoji: '🤖',
      description: '从文本到多模态，AIGC正在重塑内容生产范式',
      tags: [{ label: '386亿市场' }, { label: '38% CAGR' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'semiconductor',
      name: 'AI + 半导体',
      emoji: '🔬',
      description: 'AI驱动芯片设计与制造效率革命，重塑半导体产业格局',
      tags: [{ label: '6000+亿市场' }, { label: '15% CAGR' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'autonomous-driving',
      name: 'AI + 自动驾驶',
      emoji: '🚙',
      description: 'L2+规模化落地，L4商业闭环尚在早期，从技术竞赛转向场景变现',
      tags: [{ label: '1000+亿市场' }, { label: '45% CAGR' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'solid-state-battery',
      name: 'AI + 固态电池',
      emoji: '🔋',
      description: 'AI加速固态电解质新材料发现与工艺优化，推动下一代电池商业化',
      tags: [{ label: '800+亿市场' }, { label: '52% CAGR' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'cybersecurity',
      name: 'AI + 网络安全',
      emoji: '🔒',
      description: 'AI重塑攻防对抗，网络安全市场进入智能博弈新阶段',
      tags: [{ label: '500+亿市场' }, { label: '20% CAGR' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'low-altitude-economy',
      name: 'AI + 低空经济',
      emoji: '🛸',
      description: '以无人机和eVTOL为核心，AI赋能空域管理与飞行服务的新型融合经济',
      tags: [{ label: '万亿赛道' }, { label: '政策驱动' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'drone-evtol',
      name: 'AI + 无人机/eVTOL',
      emoji: '✈️',
      description: '低空经济载具智能化，政策驱动+AI赋能，万亿赛道开启',
      tags: [{ label: '低空经济' }, { label: '政策红利' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'ai-drug-discovery',
      name: 'AI辅助药物研发',
      emoji: '💊',
      description: 'AI加速靶点发现与先导化合物优化，缩短新药研发周期至传统1/3',
      tags: [{ label: '500+亿市场' }, { label: '爆发前夜' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'drug-discovery',
      name: 'AI + 药物发现',
      emoji: '🧬',
      description: 'AI重构新药研发R&D价值链，缩短周期、降低失败率',
      tags: [{ label: '千亿市场' }, { label: 'AI加速' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'innovative-drug',
      name: 'AI + 创新药研发',
      emoji: '💊',
      description: 'AI加速药物发现，重构千亿级研发成本结构',
      tags: [{ label: '千亿市场' }, { label: 'AI原生' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'industrial-robot',
      name: 'AI + 工业机器人',
      emoji: '🦾',
      description: 'AI赋能工业机器人从刚性自动化向柔性自适应跃迁',
      tags: [{ label: '500+亿市场' }, { label: '35% CAGR' }],
      status: 'live',
      hasContent: true,
    },
    {
      slug: 'new-energy',
      name: 'AI + 新能源',
      emoji: '⚡',
      description: 'AI赋能新能源发电、储能与电网，实现预测、调度与运维的全链路智能化',
      tags: [{ label: '600+亿市场' }, { label: '绿电智能化' }],
      status: 'live',
      hasContent: true,
    },
  ]
  return list
}

/** Get live industry slugs for generateStaticParams */
export function getLiveIndustrySlugs(): string[] {
  return [
    'healthcare', 'education', 'finance',
    'aigc', 'semiconductor', 'autonomous-driving', 'solid-state-battery',
    'cybersecurity', 'low-altitude-economy', 'drone-evtol',
    'ai-drug-discovery', 'drug-discovery', 'innovative-drug',
    'industrial-robot', 'new-energy',
  ]
}

/** Load a full industry schema by slug */
export async function getIndustrySchema(slug: string): Promise<IndustrySchema> {
  const data = await import(`@/data/industries/${slug}.json`)
  return data.default ?? data
}
