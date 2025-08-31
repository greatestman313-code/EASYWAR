import Link from 'next/link'

export default function Sidebar() {
  return (
    <div className="h-screen p-3 flex flex-col gap-3 text-sm">
      <div className="flex items-center justify-between">
        <button className="rounded-xl px-3 py-2 bg-white/5">LOGO</button>
        <button className="rounded-xl px-3 py-2 bg-white/5">⟷</button>
      </div>

      <button className="rounded-xl px-3 py-2 bg-white/5">+ محادثة جديدة</button>

      <div className="rounded-xl bg-white/5">
        <input className="w-full bg-transparent p-2 outline-none" placeholder="ابحث عن محادثة..." />
      </div>

      <div className="space-y-2">
        <Link className="block rounded-xl px-3 py-2 bg-white/5" href="/chat?tool=founder">🧭 Easy Founder OS</Link>
        <Link className="block rounded-xl px-3 py-2 bg-white/5" href="/chat?tool=pricing">💵 Easy Smart Pricing</Link>
        <Link className="block rounded-xl px-3 py-2 bg-white/5" href="/chat?tool=ads">📣 Easy Ad Doctor</Link>
      </div>

      <div className="mt-auto space-y-2">
        <button className="w-full rounded-xl px-3 py-2 bg-white/5">👤 اسم المستخدم · Free</button>
      </div>
    </div>
  )
}
