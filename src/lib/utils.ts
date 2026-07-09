import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 10_000) return (n / 10_000).toFixed(1) + '万'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k'
  return String(n)
}

export const TREND_LABELS: Record<string, string> = {
  up: '↑ 增长',
  down: '↓ 下降',
  flat: '→ 持平',
}

export const STAGE_LABELS: Record<string, string> = {
  embryonic: '萌芽期',
  growth: '成长中期',
  shakeout: '洗牌期',
  mature: '成熟期',
  declining: '衰退期',
}

export const AI_PENETRATION_LABELS: Record<string, string> = {
  none: '无',
  low: '低',
  medium: '中',
  high: '高',
  very_high: '极高',
}

export const VERDICT_STYLES: Record<string, { label: string; color: string }> = {
  'proven': { label: '已验证，规模化', color: 'text-green' },
  'pre-boom': { label: '爆发前夜', color: 'text-amber' },
  'steady': { label: '稳步推进', color: 'text-teal' },
  'scaling': { label: '加速渗透', color: 'text-green' },
  'demand': { label: '需求旺盛', color: 'text-teal' },
  'future': { label: '远期空间', color: 'text-cool-gray' },
  'supplement': { label: '补充角色', color: 'text-cool-gray' },
  'blue-ocean': { label: '新兴蓝海', color: 'text-purple' },
}
