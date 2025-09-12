'use client';
import { useState , useRef} from 'react';

export default function UserMenu({ user={email:'guest@example.com', name:'ضيف', plan:'free'}, onLogout }){
  const [open, setOpen] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const helpRef = useRef(null);
  return (
    <div className="relative">
      <button onClick={()=>setOpen(v=>!v)} className="w-full p-2 rounded hover:bg-bgdark flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-[#444] inline-block" />
        <div className="text-left">
          <div className="text-[13px]">{user.name || 'مستخدم'}</div>
          <div className="text-[11px] text-gray-400">{user.plan==='pro'?'Pro':'Free'} plan</div>
        </div>
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 w-64 bg-black border border-[#333] rounded p-1 z-20">
          <div className="px-2 py-2 text-xs bg-[#181818] rounded mb-1">{user.email || 'guest@example.com'}</div>
          <a href="/upgrade" className="block p-2 rounded hover:bg-bgdark text-right">Upgrade plan</a>
          <a href="/customize" className="block p-2 rounded hover:bg-bgdark text-right">Customize chat-easywar</a>
          <a href="/settings" className="block p-2 rounded hover:bg-bgdark text-right">Settings</a>
          <button onMouseEnter={()=>setOpenHelp(true)} onClick={()=>setOpenHelp(v=>!v)} className="w-full text-right p-2 rounded hover:bg-bgdark relative">Help</button>
          <a href="/logout" className="block p-2 rounded hover:bg-red-700 text-right bg-red-900/30 mt-1">Log out</a>

          {openHelp && (
            <div className="absolute right-full mr-2 bottom-10 w-56 bg-black border border-[#333] rounded p-1">
              <a href="/help/center" className="block p-2 rounded hover:bg-bgdark text-right">Help center</a>
              <a href="/help/release-notes" className="block p-2 rounded hover:bg-bgdark text-right">Release notes</a>
              <a href="/help/terms" className="block p-2 rounded hover:bg-bgdark text-right">Terms & policies</a>
              <a href="/help/downloads" className="block p-2 rounded hover:bg-bgdark text-right">Download apps</a>
              <a href="/help/shortcuts" className="block p-2 rounded hover:bg-bgdark text-right">Keyboard shortcuts</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
