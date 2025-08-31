import Link from 'next/link'

export default function Home() {
  // Simple landing: redirect user to /login or /chat depending on auth (stubbed)
  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-bold">أهلًا بك في Chat Easy War</h1>
        <p className="text-neutral-300">منصة موحّدة: دردشة + أدوات: Founder OS، Smart Pricing، Ad Doctor.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20">تسجيل الدخول</Link>
          <Link href="/chat" className="px-4 py-2 rounded-2xl bg-neon-blue/20 hover:bg-neon-blue/30">الدردشة</Link>
        </div>
      </div>
    </main>
  )
}
