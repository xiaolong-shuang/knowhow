import type { ValueChain, PlayerCategory } from '@/types'
import { SectionBlock, SectionBlockLabelRow } from '@/components/ui/section-block'
import { SectionLabel } from '@/components/ui/section-label'
import { ValueChainMap } from '@/components/industry/value-chain-map'
import { PlayerGrid } from '@/components/industry/player-grid'

interface L2StructureProps {
  valueChain: ValueChain
  playerCategories: PlayerCategory[]
}

export function L2Structure({ valueChain, playerCategories }: L2StructureProps) {
  return (
    <SectionBlock>
      <SectionBlockLabelRow>
        <SectionLabel>L2 · 结构拆解</SectionLabel>
      </SectionBlockLabelRow>
      <ValueChainMap valueChain={valueChain} />
      <PlayerGrid playerCategories={playerCategories} />
    </SectionBlock>
  )
}
