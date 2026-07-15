'use client'

import { useEffect, useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useChatStore } from '@/stores/chat'
import { useAnalyzeStore } from '@/stores/analyze'
import { compressIndustryForChat } from '@/lib/chat-context'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { QuickPrompts } from './quick-prompts'
import type { IndustrySchema } from '@/types'

// 静态导入所有行业数据 JSON——Turbopack 无法在客户端解析变量拼接的 import 路径
import healthcareData from '@/data/industries/healthcare.json'
import educationData from '@/data/industries/education.json'
import financeData from '@/data/industries/finance.json'
import aigcData from '@/data/industries/aigc.json'
import semiconductorData from '@/data/industries/semiconductor.json'
import autonomousDrivingData from '@/data/industries/autonomous-driving.json'
import solidStateBatteryData from '@/data/industries/solid-state-battery.json'
import cybersecurityData from '@/data/industries/cybersecurity.json'
import lowAltitudeEconomyData from '@/data/industries/low-altitude-economy.json'
import droneEvtolData from '@/data/industries/drone-evtol.json'
import aiDrugDiscoveryData from '@/data/industries/ai-drug-discovery.json'
import drugDiscoveryData from '@/data/industries/drug-discovery.json'
import innovativeDrugData from '@/data/industries/innovative-drug.json'
import industrialRobotData from '@/data/industries/industrial-robot.json'
import newEnergyData from '@/data/industries/new-energy.json'

const STATIC_INDUSTRY_DATA: Record<string, IndustrySchema> = {
  healthcare: healthcareData as unknown as IndustrySchema,
  education: educationData as unknown as IndustrySchema,
  finance: financeData as unknown as IndustrySchema,
  aigc: aigcData as unknown as IndustrySchema,
  semiconductor: semiconductorData as unknown as IndustrySchema,
  'autonomous-driving': autonomousDrivingData as unknown as IndustrySchema,
  'solid-state-battery': solidStateBatteryData as unknown as IndustrySchema,
  cybersecurity: cybersecurityData as unknown as IndustrySchema,
  'low-altitude-economy': lowAltitudeEconomyData as unknown as IndustrySchema,
  'drone-evtol': droneEvtolData as unknown as IndustrySchema,
  'ai-drug-discovery': aiDrugDiscoveryData as unknown as IndustrySchema,
  'drug-discovery': drugDiscoveryData as unknown as IndustrySchema,
  'innovative-drug': innovativeDrugData as unknown as IndustrySchema,
  'industrial-robot': industrialRobotData as unknown as IndustrySchema,
  'new-energy': newEnergyData as unknown as IndustrySchema,
}

// Industry-slug → quick prompts mapping (extensible)
const PROMPTS_BY_INDUSTRY: Record<string, string[]> = {
  healthcare: [
    '医疗AI最大的机会在哪？',
    '三类证审批要多久？',
    'AI药物研发有哪些玩家？',
    '对比医疗AI vs 金融AI',
  ],
  education: [
    '教育行业AI渗透率有多高？',
    '个性化学习的技术瓶颈在哪？',
    '教育AI有哪些头部玩家？',
    '对比教育AI vs 医疗AI',
  ],
  finance: [
    '金融风控用到了哪些AI技术？',
    '量化交易的AI应用成熟度如何？',
    '金融AI有哪些创业机会？',
    '对比金融AI vs 医疗AI',
  ],
}

// Generic prompts when no industry context is available
const GENERIC_PROMPTS = [
  '当前行业最大的AI机会在哪？',
  '核心竞争壁垒是什么？',
  '产业链哪个环节利润最高？',
  '对比这个行业 vs 医疗AI',
]

function buildDynamicPrompts(
  industryName: string,
  basePrompts: string[],
): string[] {
  return basePrompts.map((p) => {
    // Replace "医疗AI" / "金融AI" / "教育AI" with the actual industry
    let result = p
    if (industryName && !p.includes(industryName)) {
      // Keep the question structure but insert context
      result = result.replace(/医疗AI|金融AI|教育AI/g, industryName)
    }
    return result
  })
}

export function ChatPanel() {
  const isOpen = useChatStore((s) => s.isOpen)
  const close = useChatStore((s) => s.close)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const analyzeData = useAnalyzeStore((s) => s.data)
  const setIndustryContext = useChatStore((s) => s.setIndustryContext)
  const industryContext = useChatStore((s) => s.industryContext)

  // 根据当前路径计算行业上下文，注入到 chat store
  useEffect(() => {
    // 路径 /industry/[slug] → 查静态查找表
    const industryMatch = pathname.match(/^\/industry\/(\w+)/)
    if (industryMatch) {
      const slug = industryMatch[1]
      const data = STATIC_INDUSTRY_DATA[slug]
      if (data) {
        setIndustryContext(compressIndustryForChat(data))
        return
      }
    }
    // 路径 /analyze 且有 analyzeData
    if (pathname === '/analyze' && analyzeData) {
      setIndustryContext(compressIndustryForChat(analyzeData))
      return
    }
    // 其他路径 → 无上下文
    setIndustryContext(null)
  }, [pathname, analyzeData, setIndustryContext])

  const prompts = useMemo(() => {
    // Case 1: On a static industry detail page — /industry/healthcare
    const industryMatch = pathname.match(/^\/industry\/(\w+)/)
    if (industryMatch) {
      const slug = industryMatch[1]
      const industryName = {
        healthcare: '医疗', education: '教育', finance: '金融',
        aigc: 'AIGC', semiconductor: '半导体', 'autonomous-driving': '自动驾驶',
        'solid-state-battery': '固态电池', cybersecurity: '网络安全',
        'low-altitude-economy': '低空经济', 'drone-evtol': '无人机/eVTOL',
        'ai-drug-discovery': 'AI药物研发', 'drug-discovery': '药物发现',
        'innovative-drug': '创新药', 'industrial-robot': '工业机器人',
        'new-energy': '新能源',
      }[slug] ?? slug
      const basePrompts = PROMPTS_BY_INDUSTRY[slug]
      if (basePrompts) return basePrompts
      // Unknown industry slug — generate on the fly
      return [
        `${industryName}行业AI最大的机会在哪？`,
        `${industryName}行业的核心壁垒是什么？`,
        `${industryName}产业链有哪些关键玩家？`,
        `对比${industryName}AI vs 其他行业`,
      ]
    }

    // Case 2: On analyze page — /analyze?q=锂电池
    if (pathname === '/analyze') {
      const q = searchParams.get('q')
      if (q) {
        const name = q.replace(/^AI\s*\+\s*/, '').trim()
        return [
          `${name}行业AI最大的机会在哪？`,
          `${name}产业链哪个环节利润最高？`,
          `${name}行业有哪些值得关注的创业公司？`,
          `${name}行业的进入壁垒是什么？`,
        ]
      }
    }

    // Case 3: No context — generic
    return GENERIC_PROMPTS
  }, [pathname, searchParams])

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/25 z-[2000] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />
      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[460px] max-w-[100vw] bg-cream z-[2001] flex flex-col shadow-[-2px_0_20px_rgba(0,0,0,0.06)] transition-transform duration-350 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-rule-gray flex items-center justify-between shrink-0">
          <h2 className="font-serif text-base font-bold">AI 行业助手</h2>
          <button
            onClick={close}
            className="w-8 h-8 flex items-center justify-center border border-rule-gray text-cool-gray hover:border-ink hover:text-ink transition-all bg-transparent cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <ChatMessages />

        {/* Quick prompts */}
        <QuickPrompts prompts={prompts} industryContext={industryContext} />

        {/* Input */}
        <ChatInput industryContext={industryContext} />
      </div>
    </>
  )
}
