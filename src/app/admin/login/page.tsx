'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin() {
    setError('')
    // 将密码存入 Cookie（1 天有效）
    document.cookie = `admin_auth=${encodeURIComponent(password)}; path=/admin; max-age=86400; SameSite=Lax`

    // 用 fetch 验证 middleware 是否接受这个 cookie
    try {
      const res = await fetch('/admin', { redirect: 'manual' })
      // 如果 middleware 放行了，res.status 是 200；如果又被重定向到 /admin/login，res.status 是 307
      if (res.status === 200 || res.type === 'opaqueredirect') {
        router.push('/admin')
      } else {
        setError('密码错误')
        // 清除错误的 cookie
        document.cookie = 'admin_auth=; path=/admin; max-age=0'
      }
    } catch {
      // 网络错误时直接尝试跳转
      router.push('/admin')
    }
  }

  return (
    <div className="max-w-[400px] mx-auto px-5 py-24 text-center">
      <h1 className="font-serif text-[2rem] font-black text-ink mb-6">Admin 登录</h1>
      <input
        type="password" value={password}
        onChange={(e) => { setPassword(e.target.value); setError(''); }}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        placeholder="输入管理密码"
        className="w-full border border-rule-gray px-4 py-2.5 text-sm font-sans outline-none bg-cream focus:border-crimson transition-colors mb-4"
      />
      {error && <p className="text-crimson text-[0.78rem] mb-4">{error}</p>}
      <button onClick={handleLogin}
        className="w-full bg-ink text-cream px-6 py-2.5 text-[0.82rem] font-semibold tracking-[0.04em] hover:bg-warm-gray transition-colors cursor-pointer font-sans border-none">
        验证
      </button>
      <a href="/" className="block mt-6 text-[0.78rem] text-cool-gray hover:text-crimson transition-colors">
        ← 返回首页
      </a>
    </div>
  )
}
