'use client';
import { useEffect } from 'react';
export default function Toast({ text, onClear }){
  useEffect(()=>{
    if(!text) return;
    const t = setTimeout(()=>onClear?.(), 2000);
    return ()=>clearTimeout(t);
  },[text]);
  if(!text) return null;
  return <div className="fixed bottom-4 right-4 bg-black/75 px-3 py-2 rounded text-sm">{text}</div>;
}
