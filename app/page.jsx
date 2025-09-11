export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#14161A] text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* الصورة يسار */}
        <div className="hidden md:block relative order-1">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop"
            alt="رجال أعمال وأسهم ترتفع"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* النموذج يمين */}
        <div className="order-2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-5xl font-extrabold mb-6">تسجيل الدخول</h1>
            <p className="text-gray-400 mb-8">مرحباً بك في <b>CHAT EASY WAR</b></p>

            <div className="space-y-4">
              <input className="w-full rounded-md bg-[#1E2126] px-4 py-3 outline-none"
                     placeholder="الاسم" />
              <input className="w-full rounded-md bg-[#1E2126] px-4 py-3 outline-none"
                     placeholder="البريد الإلكتروني" />
              <a href="/chat" className="block text-center w-full rounded-md bg-[#00D3EE] text-black font-bold py-3">
                دخول
              </a>
              <button className="w-full rounded-md bg-[#1E2126] py-3">تسجيل بحساب Google</button>
              <button className="w-full rounded-md bg-[#1E2126] py-3">دخول كضيف</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
