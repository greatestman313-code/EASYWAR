'use client';
import { useState, useRef, useEffect } from 'react';
export default function UserMenu(){
  const [open,setOpen]=useState(false);
  const [help,setHelp]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const h=(e)=>{ if(ref.current && !ref.current.contains(e.target)){ setOpen(false); setHelp(false);} };
    document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h);
  },[]);
  return (
    <div className="relative" ref={ref}>
      <button className="w-full p-2 rounded hover:bg-bgdark flex items-center gap-2" onClick={()=>setOpen(v=>!v)}>
        <span className="w-8 h-8 rounded-full bg-[#444] inline-block" />
        <div><div>ضيف</div><div className="text-[11px] text-gray-400">Free plan</div></div>
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-bgsoft border-soft rounded p-1 shadow-lg">
          <div className="bg-bgdark rounded p-2 text-sm text-muted">guest@example.com</div>
          <button className="w-full text-right p-2 rounded hover:bg-bgdark">Upgrade plan</button>
          <button className="w-full text-right p-2 rounded hover:bg-bgdark">Customize chat-easywar</button>
          <button className="w-full text-right p-2 rounded hover:bg-bgdark">Settings</button>
          <div className="relative">
            <button className="w-full text-right p-2 rounded hover:bg-bgdark flex items-center justify-between" onMouseEnter={()=>setHelp(true)} onMouseLeave={()=>setHelp(false)}>
              <span>Help</span><span>›</span>
            </button>
            {help && (
              <div className="absolute right-full top-0 mr-1 w-52 bg-bgsoft border-soft rounded p-1">
                <a className="block p-2 rounded hover:bg-bgdark" href="#">Help center</a>
                <a className="block p-2 rounded hover:bg-bgdark" href="#">Release notes</a>
                <a className="block p-2 rounded hover:bg-bgdark" href="#">Terms & policies</a>
                <a className="block p-2 rounded hover:bg-bgdark" href="#">Download apps</a>
                <a className="block p-2 rounded hover:bg-bgdark" href="#">Keyboard shortcuts</a>
              </div>
            )}
          </div>
          <button className="w-full text-right p-2 rounded bg-[#521]" onClick={()=>dispatchEvent(new CustomEvent('toast',{detail:'تم تسجيل الخروج (وهمياً)'}))}>Log out</button>
        </div>
      )}
    </div>
  );
}
