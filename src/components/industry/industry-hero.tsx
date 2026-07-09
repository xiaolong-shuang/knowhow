import { StageBadge } from '@/components/ui/stage-badge'

interface IndustryHeroProps {
  name: string
  stage: string
  heroDeck: string
  heroHook: string
}

export function IndustryHero({ name, stage, heroDeck, heroHook }: IndustryHeroProps) {
  return (
    <div className="py-14 max-[768px]:py-10">
      <div className="max-w-[1160px] mx-auto px-[72px] max-[1100px]:px-9 max-[768px]:px-5">
        <p className="text-[0.72rem] font-semibold tracking-[0.14em] text-crimson uppercase mb-5">
          行业深度 · {name}
        </p>
        <h1 className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-black leading-[1.14] -tracking-[0.02em] mb-5">
          {name}
        </h1>
        <p className="text-[1.15rem] text-warm-gray max-w-[620px] leading-relaxed mb-8">
          {heroDeck}
        </p>
        <hr className="border-ink border-t-2 mb-6" />
        <div className="flex items-center gap-3 flex-wrap">
          <StageBadge stage={stage} />
          <span className="text-[0.88rem] text-warm-gray leading-relaxed">{heroHook}</span>
        </div>
      </div>
    </div>
  )
}
