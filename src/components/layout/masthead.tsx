import Link from 'next/link'
import { MastheadNav } from './masthead-nav'

export function Masthead() {
  return (
    <header className="sticky top-0 z-[1000] bg-cream/95 backdrop-blur-[10px] border-b border-rule-gray">
      <div className="max-w-[1160px] mx-auto px-[72px] max-[1100px]:px-9 max-[768px]:px-5 flex items-center justify-between h-[50px]">
        <Link href="/" className="font-serif text-[0.92rem] font-bold text-ink tracking-[0.04em] hover:text-crimson transition-colors">
          KnowHow<span className="text-crimson">·</span>行业认知加速器
        </Link>
        <MastheadNav />
      </div>
    </header>
  )
}
