'use client'

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-[1160px] mx-auto px-[72px] py-24 text-center">
      <h1 className="font-serif text-[2.5rem] font-black text-ink mb-4">出错了</h1>
      <p className="text-warm-gray mb-6">{error.message || '发生了意外错误'}</p>
      <button onClick={reset} className="px-5 py-2 text-sm font-semibold text-crimson border border-crimson hover:bg-crimson hover:text-cream transition-colors cursor-pointer">
        重试
      </button>
    </div>
  )
}
