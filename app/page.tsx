import Link from 'next/link'
export default function Home(){
  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-bold">Chat Easy War — Functional MVP</h1>
        <p className="text-neutral-300">تسجيل، محادثات، حفظ، وبث حي من OpenAI.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20">تسجيل الدخول</Link>
          <Link href="/chat" className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20">الدردشة</Link>
        </div>
      </div>
    </main>
  )
}
