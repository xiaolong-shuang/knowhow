import type { PlayerCategory } from '@/types'

interface PlayerGridProps {
  playerCategories: PlayerCategory[]
}

export function PlayerGrid({ playerCategories }: PlayerGridProps) {
  return (
    <div className="mt-10">
      <h3 className="font-serif text-[1.15rem] font-bold text-ink mb-5">核心玩家图谱</h3>
      <div className="grid grid-cols-4 gap-5 max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1">
        {playerCategories.map((cat, i) => (
          <div key={i} className="border border-rule-light bg-white/60 p-5">
            <h4 className="font-serif text-[0.95rem] font-bold text-ink mb-4 pb-3 border-b border-rule-light">
              {cat.category}
            </h4>
            <ul className="space-y-3">
              {cat.players.map((p, j) => (
                <li key={j}>
                  <span className="text-[0.85rem] font-semibold text-ink">{p.name}</span>
                  <p className="text-[0.75rem] text-cool-gray mt-0.5 leading-snug">{p.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
