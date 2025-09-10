export default function LoginPage() {
  return (
    <main className="flex h-screen">
      <div className="w-1/2 bg-cover bg-center" style={{backgroundImage:'url(https://picsum.photos/600/800?business)'}}></div>
      <div className="w-1/2 flex items-center justify-center bg-bgdark">
        <div className="w-2/3 space-y-4">
          <h1 className="text-2xl font-bold text-neon">تسجيل الدخول</h1>
          <input placeholder="البريد الالكتروني" className="w-full p-2 rounded bg-bgsoft text-white"/>
          <button className="w-full p-2 bg-neon text-black rounded">دخول</button>
          <button className="w-full p-2 bg-bgsoft rounded">تسجيل بحساب Google</button>
          <button className="w-full p-2 bg-bgsoft rounded">دخول كضيف</button>
        </div>
      </div>
    </main>
  )
}
