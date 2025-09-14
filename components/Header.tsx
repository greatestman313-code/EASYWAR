"use client";
import { MoreVertical, Share2 } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [menu, setMenu] = useState(false);
  return (
    <header className="h-14 border-b border-white/5 bg-panel flex items-center justify-between px-4">
      <div className="relative">
        <button className="px-3 py-1.5 rounded-md hover:bg-white/5">CHAT EASY WAR v1.2</button>
        {/* dropdown placeholder */}
      </div>
      <div className="flex items-center gap-2">
        <button title="مشاركة" className="p-2 rounded-md hover:bg-white/5"><Share2 className="size-5" /></button>
        <div className="relative">
          <button title="خيارات" onClick={()=>setMenu(m=>!m)} className="p-2 rounded-md hover:bg-white/5"><MoreVertical className="size-5" /></button>
          {menu && (
            <div className="absolute left-0 mt-2 bg-base border border-white/10 rounded-md w-40 text-sm z-10">
              <button className="w-full text-right px-3 py-2 hover:bg-white/5">أرشفة المحادثة</button>
              <button className="w-full text-right px-3 py-2 hover:bg-white/5">تقرير</button>
              <button className="w-full text-right px-3 py-2 hover:bg-white/5 text-red-400">مسح الدردشة</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
