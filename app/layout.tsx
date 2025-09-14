import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CHAT EASY WAR',
  description: 'منصة دردشة وأدوات تسويق ذكية'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-bg text-white">{children}</body>
    </html>
  )
}
