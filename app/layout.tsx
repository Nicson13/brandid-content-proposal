import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Proposal Builder · Brandid',
  description: '品牌提案排版导出工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
