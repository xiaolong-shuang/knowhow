import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-[1160px] mx-auto px-[72px] py-24 text-center">
      <h1 className="font-serif text-[4rem] font-black text-ink mb-4">404</h1>
      <p className="text-lg text-warm-gray mb-6">页面未找到</p>
      <Link href="/" className="text-crimson font-semibold hover:underline">
        返回首页 →
      </Link>
    </div>
  )
}
