'use client';
import { SvgTag } from './icons';
import UserMenu from './UserMenu';
export default function Sidebar({ collapsed, onToggle, saved, onOpenSaved, onNewChat, onOpenTool }){
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-80'} transition-all duration-200 bg-bgsoft flex flex-col border-l border-soft`}>
      <div className="flex items-center justify-between p-3 border-b border-soft">
        <button className="text-lg font-bold" title="الشعار">EASY WAR</button>
        <button onClick={onToggle} title="طي الشريط" className="px-2 py-1 rounded hover:bg-bgdark">⟨⟩</button>
      </div>
      {!collapsed && (
        <div className="p-3 space-y-2 text-[12px]">
          <button onClick={onNewChat} className="w-full text-right p-2 rounded hover:bg-bgdark flex items-center gap-2">
            <span className="inline-block w-5 text-center">＋</span> محادثة جديدة
          </button>
          <div className="relative">
            <input placeholder="بحث عن محادثة" className="w-full p-2 pr-8 rounded bg-bgdark outline-none" />
            <span className="absolute right-2 top-1.5 opacity-70">🔎</span>
          </div>
          <div className="pt-2 space-y-1">
            <div className="text-muted">الأدوات</div>
            <button onClick={()=>onOpenTool('أداة البزنز')} className="w-full text-right p-2 rounded hover:bg-bgdark flex items-center gap-2">
              <span className="inline-block w-5 text-center">💼</span> أداة البزنز
            </button>
            <button onClick={()=>onOpenTool('أداة التسعير')} className="w-full text-right p-2 rounded hover:bg-bgdark flex items-center gap-2">
              <span className="inline-block w-5 text-center">💲</span> أداة التسعير
            </button>
            <button onClick={()=>onOpenTool('تحليل الإعلانات')} className="w-full text-right p-2 rounded hover:bg-bgdark flex items-center gap-2">
              <span className="inline-block w-5 text-center">📊</span> تحليل الإعلانات
            </button>
          </div>
          <div className="pt-3 border-t border-soft">
            <div className="text-muted mb-1">المحفوظات</div>
            <div className="space-y-1 max-h-40 overflow-auto pr-1">
              {saved.length===0 && <div className="text-gray-500 text-[11px]">لا يوجد عناصر محفوظة</div>}
              {saved.map((it)=> (
                <button key={it.id} onClick={()=>onOpenSaved(it.id)} className="w-full p-2 rounded hover:bg-bgdark flex items-center gap-2 justify-between">
                  <span className="flex items-center gap-2"><SvgTag /> {it.title || 'بدون عنوان'}</span>
                  <span title="خيارات">⋮</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mt-auto p-3 border-t border-soft">{!collapsed && <UserMenu />}</div>
    </aside>
  );
}
