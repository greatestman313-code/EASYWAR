export default function AuthPage(){
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <section className="hidden md:flex items-center justify-center bg-bg/60">
        <div className="text-center">
          <div className="text-4xl font-bold neon">ارفع أداء أعمالك</div>
          <p className="mt-3 opacity-80">تحليلات ذكية ▪ أدوات تسويق ▪ دردشة ذكاء اصطناعي</p>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-bg/60 rounded-2xl p-6 shadow">
          <h1 className="text-xl mb-4">تسجيل الدخول</h1>
          <div className="space-y-3">
            <button className="w-full py-2 rounded-lg bg-brand.neon text-black font-semibold shadow">متابعة بـ Google</button>
            <button className="w-full py-2 rounded-lg bg-bg/80 border border-white/10">البريد الإلكتروني</button>
            <a href="/chat" className="block w-full text-center py-2 rounded-lg bg-bg border border-white/10">الدخول كضيف</a>
          </div>
        </div>
      </section>
    </main>
  )
}
