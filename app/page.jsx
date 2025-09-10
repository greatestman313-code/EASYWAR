import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex h-dvh">
      <div className="hidden md:block w-1/2 bg-cover bg-center" style={{backgroundImage:'url(https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop)'}}></div>
      <div className="w-full md:w-1/2 flex items-center justify-center bg-bgdark">
        <div className="w-11/12 max-w-md space-y-4">
          <h1 className="text-3xl font-bold text-neon">تسجيل الدخول</h1>
          <p className="text-sm text-gray-300">مرحباً بك في <b>CHAT EASY WAR</b></p>
          <input placeholder="الاسم" className="w-full p-2 rounded bg-bgsoft text-white outline-none" />
          <input placeholder="البريد الإلكتروني" className="w-full p-2 rounded bg-bgsoft text-white outline-none" />
          <div className="grid grid-cols-1 gap-2 pt-2">
            <Link href="/chat" className="w-full p-2 text-center bg-neon text-black rounded">دخول</Link>
            <button className="w-full p-2 bg-bgsoft rounded">تسجيل بحساب Google</button>
            <Link href="/chat" className="w-full p-2 text-center bg-bgsoft rounded">دخول كضيف</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
