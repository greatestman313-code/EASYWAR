export default function SettingsPage(){
  return (
    <main className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">الإعدادات</h1>
      <section className="space-y-3">
        <h2 className="font-semibold">حجم الخط</h2>
        <div className="flex gap-2">
          <button className="rounded-xl px-3 py-2 bg-white/10">12px</button>
          <button className="rounded-xl px-3 py-2 bg-white/10">14px</button>
          <button className="rounded-xl px-3 py-2 bg-white/10">16px</button>
        </div>
        <div className="rounded-xl bg-neutral-800 p-4 text-sm">Preview النص بالعربية — مثال حي.</div>
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">المظهر</h2>
        <div className="flex gap-2">
          <button className="rounded-xl px-3 py-2 bg-white/10">Dark</button>
          <button className="rounded-xl px-3 py-2 bg-white/10">Light</button>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">شخصية المساعد</h2>
        <select className="rounded-xl bg-neutral-800 border border-white/10 p-2">
          <option>ودية</option>
          <option>رسمية</option>
          <option>تقنية</option>
          <option>مختصرة</option>
        </select>
      </section>
    </main>
  )
}
