"use client";
import { Mic, Plus, Send } from "lucide-react";
import { useState } from "react";

export default function Composer({ onSend }:{ onSend:(text:string)=>void }) {
  const [v, setV] = useState("");
  return (
    <div className="border-t border-white/5 bg-panel p-3">
      <div className="relative flex items-end gap-2">
        <button className="p-2 rounded-md hover:bg-white/5"><Plus className="size-5" /></button>
        <div className="flex-1 relative">
          <textarea
            value={v}
            onChange={e=>setV(e.target.value)}
            placeholder="اسألني أي شيء"
            rows={1}
            className="w-full max-h-[50vh] overflow-auto resize-none bg-base border border-white/10 focus:border-neon/50 outline-none rounded-md px-3 py-2 text-sm"
          />
        </div>
        <button className="p-2 rounded-md hover:bg-white/5"><Mic className="size-5" /></button>
        <button onClick={()=>{ if(v.trim()){ onSend(v); setV(""); }}} className="p-2 rounded-md bg-neon/20 text-neon hover:bg-neon/30"><Send className="size-5" /></button>
      </div>
    </div>
  );
}
