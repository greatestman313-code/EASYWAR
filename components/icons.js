export const SvgPlus = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#cbd5e1" strokeWidth="1.6"/></svg>);
export const SvgMic = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="3" width="6" height="10" rx="3" stroke="#cbd5e1" strokeWidth="1.6" fill={active ? '#cbd5e1' : 'none'} />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="#cbd5e1" strokeWidth="1.6"/>
  </svg>
);
export const SvgCopy = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="12" height="12" rx="2" stroke="#cbd5e1" strokeWidth="1.6"/><rect x="4" y="4" width="12" height="12" rx="2" stroke="#cbd5e1" strokeWidth="1.6"/></svg>);
export const SvgThumbUp = ({ filled }) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 9V5a3 3 0 0 0-3-3l-1 6-5 6v8h11a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3h-2z" stroke="#cbd5e1" strokeWidth="1.6" fill={filled ? '#cbd5e1' : 'none'} /></svg>);
export const SvgThumbDown = ({ filled }) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10 15v4a3 3 0 0 0 3 3l1-6 5-6V2H8A3 3 0 0 0 5 5v7a3 3 0 0 0 3 3h2z" stroke="#cbd5e1" strokeWidth="1.6" fill={filled ? '#cbd5e1' : 'none'} /></svg>);
export const SvgBookmark = ({ filled }) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4V4z" stroke="#cbd5e1" strokeWidth="1.6" fill={filled ? '#cbd5e1' : 'none'} /></svg>);
export const SvgShare = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 16V4m0 0 4 4m-4-4-4 4" stroke="#cbd5e1" strokeWidth="1.6"/></svg>);
export const SvgKebab = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="2" fill="#cbd5e1"/><circle cx="12" cy="12" r="2" fill="#cbd5e1"/><circle cx="12" cy="19" r="2" fill="#cbd5e1"/></svg>);
export const SvgTag = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12l9-9 9 9-9 9-9-9z" stroke="#cbd5e1" strokeWidth="1.6"/></svg>);
