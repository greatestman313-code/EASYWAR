'use client';
import Link from 'next/link';
import UserMenu from '../../components/UserMenu';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function BizToolPage(){
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(true);
  const [topic, setTopic] = useState('');
  const [list, setList] = useState([]);

  const fetchSources = () => {
    setList([
      { title:'Harvard Business Review', url:'https://hbr.org' },
      { title:'McKinsey Insights', url:'https://www.mckinsey.com/featured-insights' },
      { title:'BCG Ideas', url:'https://www.bcg.com/ideas' },
      { title:'OECD Library', url:'https://www.oecd-ilibrary.org' },
      { title:'World Bank Data', url:'https://data.worldbank.org' },
    ]);
  };

  return (
    <div className={`container ${showSidebar? "":"withoutSidebar"}`}>
      <aside className={`sidebarL ${showSidebar? "":"collapsed"}`}>
        <div className="brandRow">
          <div className="brand">
            <span className="dot" />
            <div>
              <div style={{ fontWeight: 600 }}>EASY WAR</div>
              <div style={{ fontSize: 12, opacity: .7 }}>Chat — App Router</div>
            </div>
          </div>
          <button className="brandToggle" onClick={()=>setShowSidebar(v=>!v)} title={showSidebar? "إخفاء القائمة":"إظهار القائمة"}>{showSidebar? "⟨":"⟩"}</button>
        </div>
        <div className="sidebarBody">
          <Link href="/" className="btn">➕ محادثة جديدة</Link>
          <div className="tabs">
            <Link href="/tools/biz" className={`tab ${pathname==="/tools/biz"?"tabActive":""}`}>
              <span className="icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M9 7V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/></svg>
              </span>
              أداة البِزنس
            </Link>
            <Link href="/tools/ads" className={`tab ${pathname==="/tools/ads"?"tabActive":""}`}>
              <span className="icon">
                <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><rect x="7" y="9" width="10" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.6"/></svg>
              </span>
              تحليل الصور
            </Link>
            <Link href="/tools/marketing" className={`tab ${pathname==="/tools/marketing"?"tabActive":""}`}>
              <span className="icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M3 11h6l7-4v10l-7-4H3v-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 17v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </span>
              التسويق والتسعير
            </Link>
          </div>
        </div>
        <div className="footerUserWrap"><UserMenu /></div>
      </aside>
      <main className="main">
        <header className="header"><div className="title"><strong>أداة البِزنس لروّاد الأعمال</strong></div></header>
        <div className="chatArea"><div className="chatInner">
          <p>اسأل عن الإدارة/القيادة/الاستراتيجيات… اكتب موضوعًا ثم اضغط “إحضار مصادر”.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="اكتب الموضوع…"
              style={{ flex: 1, background: '#20232b', border: '1px solid var(--line)', borderRadius: 12, padding: '10px', color: 'var(--text)' }} />
            <button className="btn" onClick={fetchSources}>إحضار مصادر</button>
          </div>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {list.map((x,i)=>(
              <a key={i} href={x.url} target="_blank" rel="noreferrer" className="sourceChip">🔗 {x.title}</a>
            ))}
          </div>
        </div></div>
      </main>
    </div>
  );
}