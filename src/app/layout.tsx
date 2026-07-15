import type { Metadata } from 'next'
import './globals.css'
import { Masthead } from '@/components/layout/masthead'
import { Footer } from '@/components/layout/footer'
import { Providers } from '@/components/layout/providers'

export const metadata: Metadata = {
  title: 'KnowHow · 行业认知加速器 — AI PM 的行业 Know-How 引擎',
  description: '30分钟建立对一个行业的深度认知。AI产品经理专属的行业认知加速器，结构化数据 × 产业链地图 × AI智能问答。',
  metadataBase: new URL('https://knowhow-demo.vercel.app'),
  openGraph: {
    title: 'KnowHow · 行业认知加速器',
    description: '30分钟建立对一个行业的深度认知。AI产品经理专属的行业认知加速器。',
    type: 'website',
    siteName: 'KnowHow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KnowHow · 行业认知加速器',
    description: '30分钟建立对一个行业的深度认知。AI产品经理专属的行业认知加速器。',
  },
  alternates: {
    canonical: 'https://knowhow-demo.vercel.app',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full bg-cream text-ink font-sans">
        <Providers>
          <Masthead />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
