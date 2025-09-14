import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block bg-[radial-gradient(circle_at_30%_30%,rgba(53,182,255,0.2),transparent_60%)] p-10 flex items-end">
        <div className="text-white/80">
          <div className="text-3xl mb-2">نمّ عملك بثقة</div>
          <div className="text-white/60">تحليلات ذكية ▪ أدوات تسويق ▪ دردشة ذكاء اصطناعي</div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm bg-panel border border-white/10 rounded-2xl p-6 space-y-4">
          <h1 className="text-xl">تسجيل الدخول</h1>
          <button className="w-full bg-neon/20 text-neon rounded-md py-2">الدخول عبر Google</button>
          <button className="w-full bg-white/5 rounded-md py-2">الدخول بالبريد</button>
          <Link href="/chat" className="block text-center w-full bg-white/5 rounded-md py-2">الدخول كضيف</Link>
        </div>
      </div>
    </div>
  );
}
