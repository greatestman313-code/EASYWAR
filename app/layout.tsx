import './globals.css'
import { Cairo } from 'next/font/google'
import clsx from 'clsx'

const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' })

export const metadata = { title: 'Chat Easy War', description: 'Unified chat + tools' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={clsx(cairo.className)}>{children}</body>
    </html>
  )
}
