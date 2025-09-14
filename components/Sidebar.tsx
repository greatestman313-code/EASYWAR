"use client";
import Link from "next/link";
import { useState } from "react";
import { MessageSquarePlus, Search, Bot, BadgePercent, Megaphone, PanelsTopLeft, Menu } from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={`h-screen border-l border-white/5 bg-panel transition-all ${collapsed ? "w-16" : "w-80"} hidden md:flex flex-col`}>
      <div className="flex items-center justify-between p-3">
        <button className="flex items-center gap-2 text-white/80">
          <PanelsTopLeft className="size-5 text-neon" />
          {!collapsed && <span>CHAT EASY WAR</span>}
        </button>
        <button onClick={()=>setCollapsed(s=>!s)} className="p-2 hover:bg-white/5 rounded-md">
          <Menu className="size-5" />
        </button>
      </div>

      <div className="px-3">
        <Link href="/chat?new=1" className="flex items-center gap-2 bg-neon/10 hover:bg-neon/20 text-neon rounded-md px-3 py-2">
          <MessageSquarePlus className="size-4" /> {!collapsed && <span>محادثة جديدة</span>}
        </Link>
        <div className="mt-3 relative">
          <Search className="size-4 absolute right-3 top-2.5 text-white/40" />
          <input placeholder="ابحث في المحادثات" className="w-full bg-base rounded-md pl-3 pr-9 py-2 text-sm outline-none border border-white/10 focus:border-neon/50" />
        </div>
      </div>

      <div className="mt-4 px-3 space-y-1">
        <Link href="/chat/tools/business" className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-md">
          <Bot className="size-4 text-sky" /> {!collapsed && <span>أداة البزنز</span>}
        </Link>
        <Link href="/chat/tools/ads" className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-md">
          <Megaphone className="size-4 text-sky" /> {!collapsed && <span>تحليل الإعلانات</span>}
        </Link>
        <Link href="/chat/tools/pricing" className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-md">
          <BadgePercent className="size-4 text-sky" /> {!collapsed && <span>التسويق والتسعير</span>}
        </Link>
      </div>

      <div className="mt-6 px-3 text-xs text-white/60">المحادثات</div>
      <div className="flex-1 overflow-auto px-3 py-2 space-y-2">
        {/* Placeholder for session list */}
        <div className="text-white/40 text-sm">لا توجد محادثات بعد</div>
      </div>

      <div className="p-3 border-t border-white/5">
        <button className="w-full flex items-center gap-2 px-3 py-2 bg-base rounded-md hover:bg-white/5">
          <img src="/avatar.png" alt="" className="size-6 rounded-full" />
          {!collapsed && <div className="text-left">
            <div className="text-sm">ضيف</div>
            <div className="text-xs text-white/50">Free plan</div>
          </div>}
        </button>
      </div>
    </aside>
  );
}
