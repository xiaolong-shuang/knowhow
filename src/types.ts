// ═══════════════════════════════════════════════════════════════
// KnowHow Industry Analysis Agent — TypeScript Types
// ═══════════════════════════════════════════════════════════════

export type TrendDirection = 'up' | 'down' | 'flat'
export type IndustryStage = 'embryonic' | 'growth' | 'shakeout' | 'mature' | 'declining'
export type AIPenetration = 'none' | 'low' | 'medium' | 'high' | 'very_high'
export type IndustryStatus = 'live' | 'coming_soon'
export type TagVariant = 'hot' | 'proven' | 'pre-boom' | 'steady' | 'scaling' | 'demand' | 'future' | 'supplement' | 'blue-ocean'

export interface HeadlineMetric {
  label: string
  value: string
  unit?: string
  year: number
  growthRate?: number
  trend: TrendDirection
  source: string
  insight: string
}

export interface ValueChainNode {
  name: string
  valueShare: number
  marginRange: [number, number]
}

export interface ValueChainLayer {
  name: string
  aiPenetration: AIPenetration
  nodes: ValueChainNode[]
}

export interface ValueChain {
  upstream: ValueChainLayer
  midstream: ValueChainLayer
  downstream: ValueChainLayer
}

export interface Player {
  name: string
  description: string
}

export interface PlayerCategory {
  category: string
  players: Player[]
}

export interface AIOpportunity {
  title: string
  maturityScore: number
  valueCeilingScore: number
  verdict: TagVariant
}

export interface PortersForce {
  force: string
  intensity: number
  rationale: string
}

export interface Trend {
  title: string
  body: string
  callout: string
}

export interface Myth {
  myth: string
  reality: string
}

export interface QuizItem {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface CompareData {
  market: string
  cagr: string
  cr5: string
  stage: string
  aiPenetration: string
  barrier: string
  salesCycle: string
  topPlayers: string
  strength: string
  weakness: string
}

export interface IndustryTag {
  label: string
  variant?: TagVariant
}

export interface IndustryCard {
  slug: string
  name: string
  emoji: string
  description: string
  tags: IndustryTag[]
  status: IndustryStatus
  hasContent: boolean
}

export interface IndustrySchema {
  slug: string
  name: string
  aliases: string[]
  emoji: string
  oneLiner: string
  stage: IndustryStage
  heroDeck: string
  heroHook: string
  tags: IndustryTag[]
  searchKeywords: string[]
  headlineMetrics: HeadlineMetric[]
  valueChain: ValueChain
  playerCategories: PlayerCategory[]
  aiOpportunities: AIOpportunity[]
  portersFive: PortersForce[]
  trends: Trend[]
  myths: Myth[]
  quiz: QuizItem[]
  compareData: CompareData
  sources: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: { title: string; excerpt: string }[]
}
