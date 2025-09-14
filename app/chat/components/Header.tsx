'use client'
export default function ChatHeader(){
  return (
    <header className="flex items-center justify-between p-3 border-b border-white/10 bg-bg/50">
      <div className="flex items-center gap-3">
        <div className="font-bold">CHAT EASY WAR v1.2</div>
        <select className="bg-bg/70 border border-white/10 rounded px-2 py-1 text-sm">
          <option>الشات التلقائي</option>
          <option>بحث متقدم</option>
          <option>تفكير عميق</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button className="text-sm opacity-80">مشاركة</button>
        <details className="relative">
          <summary className="cursor-pointer opacity-80">⋮</summary>
          <div className="absolute left-0 mt-2 w-40 bg-bg border border-white/10 rounded shadow">
            <button className="w-full text-right px-3 py-2 hover:bg-white/5">أرشفة المحادثة</button>
            <a href="/api/export?fmt=md" className="block px-3 py-2 hover:bg-white/5">تقرير (MD/PDF)</a>
            <button className="w-full text-right px-3 py-2 hover:bg-white/5">مسح الدردشة</button>
          </div>
        </details>
      </div>
    </header>
  )
}
