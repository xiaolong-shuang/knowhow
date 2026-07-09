export function Footer() {
  return (
    <footer className="border-t-2 border-ink mt-4 py-10">
      <div className="max-w-[1160px] mx-auto px-[72px] max-[1100px]:px-9 max-[768px]:px-5">
        <div className="text-[0.68rem] text-cool-gray/80 leading-relaxed columns-2 gap-9 max-[768px]:columns-1">
          <p>数据来源：弗若斯特沙利文、亿欧智库、NMPA公开数据、CHIMA年度调研、公开财务报告及行业访谈</p>
          <p>竞争格局分析基于公开市场数据和行业专家访谈，不构成投资建议。</p>
          <p>产业链价值占比和毛利率区间为行业估算值，具体企业数据可能存在差异。</p>
          <p>AI机会矩阵评分基于产品成熟度、市场规模、增长速度和竞争格局四个维度综合评估。</p>
        </div>
        <div className="mt-6 font-serif text-[0.82rem] font-bold text-cool-gray">
          KnowHow<span className="text-crimson">·</span>行业认知加速器 — 让每个产品经理都能深度理解行业
        </div>
      </div>
    </footer>
  )
}
