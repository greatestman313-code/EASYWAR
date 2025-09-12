'use client';
import UserMenu from '@/components/UserMenu';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Sidebar(){
  const [collapsed, setCollapsed] = useState(false);
  const [uName, setUName] = useState('اسم المستخدم');
  const [uPlan, setUPlan] = useState('Free plan');
  useEffect(()=>{
    try{
      const g = JSON.parse(localStorage.getItem('guest_user')||'null');
      if (g?.name) setUName(g.name);
      if (g?.plan) setUPlan(g.plan==='pro'?'Pro plan':'Free plan');
    }catch{}
  },[]);
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-80'} transition-all duration-200 bg-bgsoft flex flex-col border-l border-[#333]`}>
      <div className="flex items-center justify-between p-3 border-b border-[#333]">
        <button className="text-lg font-bold" title="الشعار">EASY WAR</button>
        <button onClick={()=>setCollapsed(v=>!v)} title="طي الشريط" className="px-2 py-1 rounded hover:bg-bgdark">⟨⟩</button>
      </div>
      {!collapsed && (
        <div className="p-3 space-y-2 text-[12px]">
          <button className="w-full text-left p-2 rounded hover:bg-bgdark flex items-center gap-2"><span className="inline-block w-5 text-center">＋</span> محادثة جديدة</button>
          <div className="relative">
            <input placeholder="بحث عن محادثة" className="w-full p-2 pr-8 rounded bg-bgdark outline-none" />
            <span className="absolute right-2 top-1.5 opacity-70">🔎</span>
          </div>
          <div className="pt-2 space-y-1">
            <div className="text-muted">الأدوات</div>
            <button className="w-full text-left p-2 rounded hover:bg-bgdark flex items-center gap-2"><span className="inline-block w-5 text-center">💼</span> أداة البزنز</button>
            <button className="w-full text-left p-2 rounded hover:bg-bgdark flex items-center gap-2"><span className="inline-block w-5 text-center">💲</span> أداة التسعير</button>
            <button className="w-full text-left p-2 rounded hover:bg-bgdark flex items-center gap-2"><span className="inline-block w-5 text-center">📊</span> تحليل الإعلانات</button>
          </div>
          <div className="pt-3 border-t border-[#333]">
            <div className="text-muted mb-1">المحفوظات</div>
            <div className="space-y-1 max-h-40 overflow-auto pr-1">
              <div className="text-gray-500 text-[11px]">لا يوجد عناصر محفوظة</div>
            </div>
          </div>
      </div>)}
      <div className="mt-auto p-3 border-t border-[#333]">
        <UserMenu user={{ name:uName, email:"", plan: (uPlan?.includes("Pro")?"pro":"free") }} />
      </div>
    </aside>
  );
}
