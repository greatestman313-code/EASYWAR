'use client';
import { SvgCopy, SvgThumbUp, SvgThumbDown, SvgBookmark, SvgShare } from './icons';

const IconBtn = ({ title, onClick, children, active=false, className='' }) => (
  <button type="button" title={title} onClick={onClick} className={`p-1 rounded hover:bg-bgdark transition ${active ? 'opacity-100' : 'opacity-80'} ${className}`} aria-label={title}>{children}</button>
);

export default function ChatBox({ messages, onCopy, onVote, onToggleSave, onShareMessage }){
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
      {messages.map((m) => (
        <div key={m.id} className={`max-w-[92%] md:max-w-[75%] ${m.role==='user' ? 'ml-auto text-right' : 'mr-auto'}`}>
          <div className={`bubble ${m.role==='user'?'user':'assistant'} p-3 leading-7 text-[13px] whitespace-pre-line`}>
            {m.content}
          </div>
          <div className="flex gap-1 text-xs mt-1 items-center">
            {m.role === 'assistant' ? (
              <>
                <IconBtn title="إعجاب" onClick={()=>onVote?.(m,'up')} active={m.vote==='up'}><SvgThumbUp filled={m.vote==='up'} /></IconBtn>
                <IconBtn title="عدم إعجاب" onClick={()=>onVote?.(m,'down')} active={m.vote==='down'}><SvgThumbDown filled={m.vote==='down'} /></IconBtn>
                <IconBtn title="نسخ" onClick={()=>onCopy?.(m.content)}><SvgCopy /></IconBtn>
                <IconBtn title={m.saved?'إزالة من المحفوظات':'حفظ'} onClick={()=>onToggleSave?.(m)} active={m.saved}><SvgBookmark filled={m.saved} /></IconBtn>
                <IconBtn title="مشاركة هذا الرد" onClick={()=>onShareMessage?.(m.id)}><SvgShare /></IconBtn>
              </>
            ) : (
              <IconBtn title="نسخ" onClick={()=>onCopy?.(m.content)}><SvgCopy /></IconBtn>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
