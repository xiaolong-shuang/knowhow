import { HeroSearch } from './hero-search'

export function HeroSection() {
  return (
    <div className="text-center py-20 px-5">
      <div className="text-[0.72rem] font-semibold tracking-[0.14em] text-crimson uppercase mb-5">
        AI × Industry Knowledge
      </div>
      <h1 className="font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] font-black leading-[1.14] -tracking-[0.02em] mb-4">
        30 分钟，<br />建立对一个行业的深度认知
      </h1>
      <p className="text-[1.15rem] text-warm-gray max-w-[560px] mx-auto mb-7 leading-relaxed">
        专为 AI 产品经理打造的行业认知加速器——结构化数据 × 产业链地图 × AI 智能问答，
        让你的行业研究效率提升 10 倍
      </p>

      <HeroSearch />

      <p className="text-[0.75rem] text-cool-gray/70 mt-4">
        试试输入：新能源、半导体、跨境电商、SaaS、机器人…
      </p>

      <div className="flex justify-center gap-12 max-[768px]:gap-6 max-[768px]:flex-wrap font-serif mt-10">
        <div>
          <div className="text-[2.2rem] font-black text-crimson max-[768px]:text-[1.6rem]">8+</div>
          <div className="text-[0.78rem] text-cool-gray mt-1">深度覆盖行业</div>
        </div>
        <div>
          <div className="text-[2.2rem] font-black text-crimson max-[768px]:text-[1.6rem]">3 层</div>
          <div className="text-[0.78rem] text-cool-gray mt-1">渐进式信息架构</div>
        </div>
        <div>
          <div className="text-[2.2rem] font-black text-crimson max-[768px]:text-[1.6rem]">AI</div>
          <div className="text-[0.78rem] text-cool-gray mt-1">智能问答引擎</div>
        </div>
        <div>
          <div className="text-[2.2rem] font-black text-crimson max-[768px]:text-[1.6rem]">30s</div>
          <div className="text-[0.78rem] text-cool-gray mt-1">建立第一印象</div>
        </div>
      </div>
    </div>
  )
}
