'use client';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }){
  const [profile, setProfile] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);

  useEffect(()=>{
    supabase.auth.getUser().then(async ({ data }) => {
      if(!data.user){ window.location.href='/'; return; }
      const { user } = data;
      const me = {
        id: user.id,
        email: user.email,
        name: (user.user_metadata.full_name || user.user_metadata.name || "User"),
        avatar: user.user_metadata.avatar_url,
        plan: 'Free'
      };
      setProfile(me);
      // sync profile in DB
      fetch('/api/me/sync', { method: 'POST', body: JSON.stringify({ id: me.id, email: me.email, name: me.name, avatar_url: me.avatar })});
      // load chats
      const res = await fetch('/api/chats/list', { method: 'POST', body: JSON.stringify({ user_id: me.id })});
      const j = await res.json();
      if(j.ok) setChats(j.chats);
    });
  },[]);

  return (
    <div className="min-h-screen grid grid-cols-12">
      {/* Sidebar */}
      <aside className={`col-span-12 md:col-span-${collapsed?1:3} border-l border-white/10 bg-bg relative`}>
        <div className="sticky top-0 p-3 flex items-center justify-between border-b border-white/10">
          <button className="icon-btn" aria-label="toggle" onClick={()=>setCollapsed(!collapsed)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5h8v2H8V5zm0 6h8v2H8v-2zm0 6h8v2H8v-2z"/></svg>
          </button>
          <div className="text-sm font-bold">EASY WAR</div>
          <div className="w-8"/>
        </div>
        <div className={`p-3 space-y-3 ${collapsed?'hidden md:block':''}`}>
          <Link href="/app/new" className="btn w-full text-sm">محادثة جديدة</Link>
          <Link href="/app/search" className="btn w-full text-sm">بحث في المحادثات</Link>

          <div className="space-y-1">
            <div className="text-xs text-white/60">أدوات</div>
            <Link href="/app/tools/business" className="btn w-full flex items-center gap-2 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>
              أداة البزنس
            </Link>
            <Link href="/app/tools/pricing" className="btn w-full flex items-center gap-2 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
              أداة التسعير
            </Link>
            <Link href="/app/tools/ad-doctor" className="btn w-full flex items-center gap-2 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z"/></svg>
              تحليل الإعلانات
            </Link>
          </div>

          <div className="pt-2">
            <div className="text-xs text-white/60 mb-2">المحادثات</div>
            <div className="space-y-1 max-h-[40vh] overflow-auto scrollbar-thin">
              {chats.map((c)=> (
                <Link key={c.id} href={`/app/chat/${c.id}`} className="btn w-full text-xs">{c.title || "محادثة بدون عنوان"}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* User Button */}
        {profile && (
          <div className="absolute bottom-0 w-full p-3">
            <button onClick={()=>setMenuOpen(!menuOpen)} className="w-full flex items-center gap-3 p-2 rounded-xl bg-grayx hover:bg-[#1b2334]">
              <img src={profile.avatar || 'https://i.pravatar.cc/64'} alt="avatar" className="w-8 h-8 rounded-full"/>
              <div className="flex-1 text-left">
                <div className="text-sm">{profile.name}</div>
                <div className="text-xs text-white/60">{profile.plan}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </button>

            {menuOpen && (
              <div className="menu absolute bottom-20 left-3 right-3 p-2">
                <div className="px-4 py-3 bg-[#1b2334] rounded-xl text-xs">{profile.email}</div>
                <Link href="/app/upgrade" className="menu-item">Upgrade plan</Link>
                <Link href="/app/customize" className="menu-item">Customize Chat-EasyWar</Link>
                <Link href="/app/settings" className="menu-item">Settings</Link>
                <div className="relative">
                  <button onMouseEnter={()=>setHelpOpen(true)} onMouseLeave={()=>setHelpOpen(false)} className="menu-item w-full text-left">Help</button>
                  {helpOpen && (
                    <div className="menu absolute bottom-0 right-full mr-2 p-2 w-48">
                      <Link href="/help/center" className="menu-item">Help Center</Link>
                      <Link href="/help/release-notes" className="menu-item">Release Notes</Link>
                      <Link href="/help/terms" className="menu-item">Terms & Policies</Link>
                      <Link href="/help/apps" className="menu-item">Download Apps</Link>
                      <Link href="/help/shortcuts" className="menu-item">Keyboard Shortcuts</Link>
                    </div>
                  )}
                </div>
                <button onClick={()=>supabase.auth.signOut().then(()=>location.href='/')} className="menu-item bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-xl">Log out</button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Main */}
      <main className={`col-span-12 md:col-span-${collapsed?11:9} border-r border-white/10`}>
        {children}
      </main>
    </div>
  );
}
