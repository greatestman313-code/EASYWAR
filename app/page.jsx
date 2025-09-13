'use client'
import Link from 'next/link'
import './globals.css'

export default function Home(){
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'100vh'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:24}} className="bg-bgsoft">
        <div style={{width:420,maxWidth:'92vw'}} className="rounded border-s" >
          <div style={{padding:18,textAlign:'center',fontWeight:800}}>CHAT EASY WAR</div>
          <div style={{padding:'0 18px',marginBottom:8}} className="text-muted">سجّل للدخول للمتابعة</div>
          <div style={{padding:18,display:'grid',gap:10}}>
            <Link href="/chat" className="neon rounded" style={{display:'block',textAlign:'center',padding:12,fontWeight:700}}>تسجيل الدخول بجوجل (وهمي)</Link>
            <div style={{textAlign:'center'}} className="text-muted">أو ادخل كضيف.</div>
          </div>
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',padding:32}}>
        <div>
          <h1 style={{fontSize:40,margin:'0 0 8px 0'}}>ارفع أداء أعمالك</h1>
          <div className="text-muted">تحليلات ذكية • أدوات تسويق • دردشة ذكاء اصطناعي</div>
        </div>
      </div>
    </div>
  );
}
