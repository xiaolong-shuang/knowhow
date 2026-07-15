import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // ⚠️ 排除 /admin/login——否则会无限重定向到自己
  if (req.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
    // 未设置密码时允许所有访问
    if (!ADMIN_PASSWORD) return NextResponse.next()

    const authCookie = req.cookies.get('admin_auth')
    if (authCookie?.value === ADMIN_PASSWORD) return NextResponse.next()

    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
