import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: '골프 운세 챗봇 | Golf Fortune Chatbot',
  description: '골프와 사주를 결합한 개인 맞춤형 운세 서비스',
  keywords: '골프, 운세, 사주, 챗봇, 골프운세',
  authors: [{ name: 'Golf Fortune Team' }],
  openGraph: {
    title: '골프 운세 챗봇',
    description: '골프와 사주를 결합한 개인 맞춤형 운세 서비스',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
