
"use client";
import { useState } from "react";
export default function Home(){
  const [caption,setCaption]=useState(""); const [imageUrl,setImageUrl]=useState(""); const [res,setRes]=useState<any>(null);
  return (<div style={{padding:24}}>
    <h1>EASYWAR Ultra</h1>
    <textarea rows={4} value={caption} onChange={e=>setCaption(e.target.value)} placeholder="الكابتشن" />
    <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="رابط الصورة (اختياري)" />
    <button onClick={async()=>{
      const r=await fetch("/api/ai/rate-post",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({caption,imageUrl,locale:"ar"})});
      setRes(await r.json());
    }}>قيّم</button>
    <pre>{res?JSON.stringify(res,null,2):null}</pre>
  </div>);
}
