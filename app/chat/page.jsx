'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ChatBox from '@/components/ChatBox';
import Composer from '@/components/Composer';
import ImageModal from '@/components/ImageModal';

const uid = () => Math.random().toString(36).slice(2);

export default function ChatPage() {
  const [toast, setToast] = useState('');
  const [openImageModal, setOpenImageModal] = useState(false);
  const [sessionId, setSessionId] = useState(() => uid());
  const [messages, setMessages] = useState(() => ([
    { id: uid(), role: 'assistant', type: 'text', content: 'مرحبا بك في CHAT EASY WAR', vote: null, saved: false }
  ]));

  const [savedChats, setSavedChats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedChats') || '[]'); } catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem('savedChats', JSON.stringify(savedChats)); } catch {} }, [savedChats]);

  useEffect(() => {
    const h = (e) => { setToast(String(e.detail || '').slice(0, 180)); setTimeout(() => setToast(''), 1800); };
    window.addEventListener('toast', h);
    return () => window.removeEventListener('toast', h);
  }, []);

  useEffect(() => {
    const open = () => setOpenImageModal(true);
    window.addEventListener('open-image-modal', open);
    return () => window.removeEventListener('open-image-modal', open);
  }, []);

  const sendText = async (text) => {
    const content = (text || '').trim();
    if (!content) return;
    const userMsg = { id: uid(), role: 'user', type: 'text', content, vote: null, saved: false };
    const replyId = uid();
    setMessages(m => [...m, userMsg, { id: replyId, role: 'assistant', type: 'typing', content: '', vote: null, saved: false }]);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })) })
      });
      const data = await res.json();
      const reply = data?.reply || '…';
      let i = 0; const step = Math.max(1, Math.floor(reply.length / 80));
      const tick = () => {
        i += step;
        setMessages(list => list.map(m => m.id === replyId ? { ...m, type: 'text', content: reply.slice(0, i) } : m));
        if (i < reply.length) setTimeout(tick, 12);
      };
      tick();
    } catch {
      setMessages(list => list.map(m => m.id === replyId ? { ...m, type: 'text', content: 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.' } : m));
    }
  };

  const handleNewChat = () => {
    const title = messages.find(x => x.role === 'user')?.content?.slice(0, 80) || 'جلسة سابقة';
    const saved = { id: uid(), title, at: Date.now(), messages };
    if (messages.length) setSavedChats(list => [...list, saved]);
    setSessionId(uid());
    setMessages([{ id: uid(), role: 'assistant', type: 'text', content: 'بدأت محادثة جديدة ✅', vote: null, saved: false }]);
    setToast('تم فتح محادثة جديدة');
  };

  const handleOpenTool = (tool) => {
    const map = {
      business: 'أداة البزنز: مساعد لرواد الأعمال لتخطيط المشاريع وتحليل الفرص.',
      ads: 'تحليل الإعلانات: ارفع صورة إعلانك أو صف الهدف والجمهور لنقترح التحسينات قبل الإطلاق.',
      pricing: 'التسويق والتسعير: تحليل السوق والفئة المستهدفة واقتراح نطاقات أسعار مناسبة.',
    };
    const current = { id: uid(), title: (messages.find(x => x.role === 'user')?.content?.slice(0, 80) || 'جلسة سابقة'), at: Date.now(), messages };
    if (messages.length) setSavedChats(list => [...list, current]);
    setSessionId(uid());
    setMessages([{ id: uid(), role: 'assistant', type: 'text', content: map[tool] || 'أداة', vote: null, saved: false }]);
    setToast('تم فتح محادثة أداة مستقلة');
  };

  const loadChat = (chat) => {
    if (!chat) return;
    setSessionId(chat.id);
    setMessages(chat.messages || []);
    window.dispatchEvent(new CustomEvent('toast', { detail: 'تم فتح المحادثة' }));
  };

  const savedAction = (chat) => {
    const action = prompt('اختر عملية: delete/share/rename');
    if (!action) return;
    if (action === 'delete') {
      setSavedChats(list => list.filter(c => c.id !== chat.id));
    } else if (action === 'share') {
      const url = (typeof window !== 'undefined') ? (window.location.origin + '/share/' + chat.id) : chat.id;
      navigator.clipboard?.writeText(url);
      window.dispatchEvent(new CustomEvent('toast', { detail: 'تم نسخ رابط المشاركة' }));
    } else if (action === 'rename') {
      const t = prompt('عنوان جديد', chat.title || 'بدون عنوان');
      if (t) setSavedChats(list => list.map(c => c.id === chat.id ? { ...c, title: t } : c));
    }
  };

  const onImageDone = ({ url }) => {
    const id = uid();
    const attach = [{ kind: 'image', url, name: 'gen.png', size: 0 }];
    setMessages(m => [...m, { id, role: 'assistant', type: 'text', content: `تم توليد صورة ✅\n${url}`, vote: null, saved: false, attachments: attach }]);
  };

  return (
    <div className="flex h-dvh bg-bgdark text-white">
      <Sidebar
        onNewChat={handleNewChat}
        onOpenTool={handleOpenTool}
        savedList={savedChats.map(c => ({ id: c.id, content: c.title }))}
        onSelectSaved={loadChat}
        onSavedAction={savedAction}
      />
      <main className="flex-1 flex flex-col">
        <Header />
        <ChatBox messages={messages} />
        <Composer onSend={sendText} />
      </main>
      {toast && (<div className="fixed bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-2 rounded z-50">{toast}</div>)}
      <ImageModal open={openImageModal} onClose={() => setOpenImageModal(false)} onDone={onImageDone} />
    </div>
  );
}
