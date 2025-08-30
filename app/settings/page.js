'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SettingsPage(){
  const [user, setUser] = useState({ name:'Guest', email:'guest@example.com' });
  const [showSidebar] = useState(false);

  useEffect(()=>{
    if (typeof window !== 'undefined'){
      setUser({
        name: localStorage.getItem('ew_user_name') || 'Guest',
        email: localStorage.getItem('ew_user_email') || 'guest@example.com'
      });
    }
  }, []);

  return (
    <div className="container withoutSidebar">
      <main className="main">
        <header className="header">
          <div className="title">
            <Link href="/" className="pill" style={{marginInlineEnd:8}}>← الرجوع إلى الشات</Link>
            <strong>إعدادات الحساب</strong>
          </div>
        </header>

        <section className="chatArea">
          <div className="chatInner" style={{maxWidth:860, marginInline:'auto'}}>
            <div className="btn" style={{textAlign:'start'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}>
                <div style={{width:38,height:38,borderRadius:12,background:'#20232b',display:'flex',alignItems:'center',justifyContent:'center'}}>👤</div>
                <div>
                  <div style={{fontSize:16,fontWeight:700}}>الملف الشخصي</div>
                  <div style={{opacity:.8,fontSize:12}}>معلومات حسابك الأساسية</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'160px 1fr',gap:8}}>
                <div>اسم الحساب</div><div><strong>{user.name}</strong></div>
                <div>البريد الإلكتروني</div><div><strong>{user.email}</strong></div>
              </div>
            </div>

            <div className="btn" style={{textAlign:'start'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:38,height:38,borderRadius:12,background:'#20232b',display:'flex',alignItems:'center',justifyContent:'center'}}>⭐</div>
                  <div>
                    <div style={{fontSize:16,fontWeight:700}}>الترقية</div>
                    <div style={{opacity:.8,fontSize:12}}>احصل على مميزات متقدمة وأداء أعلى</div>
                  </div>
                </div>
                <Link href="/upgrade" className="pill">الترقية إلى PLUS</Link>
              </div>
            </div>

            <div className="btn" style={{textAlign:'start'}}>
              <div style={{fontWeight:700,marginBottom:6}}>تخصيص</div>
              <div style={{opacity:.85}}>سمة الواجهة، حجم الخط، اللغة… (قريبًا)</div>
            </div>

            <div className="btn" style={{textAlign:'start'}}>
              <div style={{fontWeight:700,marginBottom:6}}>عناصر التحكم في البيانات</div>
              <div style={{opacity:.85}}>تنزيل البيانات، مسح المحادثات، إعدادات الخصوصية.</div>
            </div>

            <div className="btn" style={{textAlign:'start'}}>
              <div style={{fontWeight:700,marginBottom:6}}>الصوت</div>
              <div style={{opacity:.85}}>اختيار صوت الرد وسرعة النطق.</div>
            </div>

            <div className="btn" style={{textAlign:'start'}}>
              <div style={{fontWeight:700,marginBottom:6}}>الأمان</div>
              <div style={{opacity:.85}}>كلمة المرور، المصادقة الثنائية (TOTP)، الجلسات النشطة.</div>
            </div>

            <div className="btn" style={{textAlign:'start'}}>
              <div style={{fontWeight:700,marginBottom:6}}>معلومات عن التطبيق</div>
              <div style={{opacity:.85}}>الإصدار، سياسة الخصوصية، شروط الاستخدام.</div>
            </div>

            <div className="btn" style={{textAlign:'start', color:'var(--red)', display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>تسجيل الخروج</div>
              <button className="pill" style={{background:'transparent',border:'1px solid var(--red)',color:'var(--red)'}}>تأكيد</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
