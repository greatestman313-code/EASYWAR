'use client';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

/**
 * UserMenu (v1.2)
 * - Opens ABOVE (upwards) as an overlay (fixed) not clipped by sidebar.
 * - "Help" submenu opens to the LEFT and upwards.
 * - Compact typography (12px), subtle hover, no borders, high z-index.
 *
 * Props:
 *  - email: string
 *  - onLogout?: function
 */
export default function UserMenu({ email = 'guest@example.com', onLogout }) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [coords, setCoords] = useState({left: 0, top: 0});
  const panelRef = useRef(null);

  // Create portal root lazily
  const [portalEl, setPortalEl] = useState(null);
  useEffect(() => {
    let root = document.getElementById('user-menu-portal');
    if (!root) {
      root = document.createElement('div');
      root.id = 'user-menu-portal';
      document.body.appendChild(root);
    }
    setPortalEl(root);
    return () => {
      // keep root for reuse
    };
  }, []);

  const closeAll = () => {
    setHelpOpen(false);
    setOpen(false);
  };

  // Position menu above the button
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    // First guess: width of panel ~ 320; we'll clamp after measuring.
    const estWidth = 320;
    const left = Math.min(
      Math.max(8, r.left),                    // keep inside viewport (left)
      window.innerWidth - estWidth - 8        // clamp to right edge
    );
    // Temporarily set, then correct after measuring real height/width
    setCoords({left, top: r.top - 8}); // top will be adjusted once mounted
  }, [open]);

  // After panel is mounted, measure and place exactly above
  useLayoutEffect(() => {
    if (!open || !panelRef.current || !btnRef.current) return;
    const pr = panelRef.current.getBoundingClientRect();
    const br = btnRef.current.getBoundingClientRect();

    let left = br.left;
    // Keep entire panel inside viewport horizontally
    if (left + pr.width + 8 > window.innerWidth) {
      left = Math.max(8, window.innerWidth - pr.width - 8);
    }
    if (left < 8) left = 8;

    // Open upwards: panel's bottom should be 8px above button top
    let top = br.top - pr.height - 8;
    if (top < 8) top = 8; // fallback if not enough space

    setCoords({ left, top });
  }, [open]);

  // Close on outside click / Esc
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!panelRef.current || !btnRef.current) return;
      if (panelRef.current.contains(e.target) || btnRef.current.contains(e.target)) return;
      closeAll();
    };
    const onKey = (e) => { if (e.key === 'Escape') closeAll(); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // --- Styles ---
  const s = {
    trigger: {
      display: 'flex', alignItems: 'center', gap: 8,
      width: '100%',
      background: 'transparent', color: 'var(--text, #cfd4e0)',
      border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14,
      padding: '12px 14px', cursor: 'pointer'
    },
    panel: {
      position: 'fixed', zIndex: 9999,
      left: coords.left, top: coords.top,
      minWidth: 280, maxWidth: 360,
      background: 'rgba(9,11,17,0.96)',
      backdropFilter: 'blur(6px)',
      borderRadius: 16,
      boxShadow: '0 10px 40px rgba(0,0,0,0.55)',
      padding: 10,
      fontSize: 12, lineHeight: '18px', color: 'var(--text, #d6d9e4)',
      border: 'none'
    },
    email: {
      padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.04)',
      marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      fontWeight: 500
    },
    item: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 12px', borderRadius: 12, cursor: 'pointer',
      background: 'transparent', color: 'inherit', textDecoration: 'none',
      marginBottom: 8
    },
    itemHover: { background: 'rgba(255,255,255,0.07)' },
    danger: { background: 'rgba(174,46,46,0.12)', color: '#ffb3b3' },
    // submenu
    submenu: {
      position: 'fixed', zIndex: 10000,
      background: 'rgba(9,11,17,0.96)',
      borderRadius: 14, padding: 8, minWidth: 240,
      boxShadow: '0 10px 36px rgba(0,0,0,0.55)',
      fontSize: 12, lineHeight: '18px'
    }
  };

  // Hover helpers
  const [hover, setHover] = useState('');
  const hoverStyle = (key, extra = {}) => ({
    ...s.item,
    ...(hover === key ? s.itemHover : {}),
    ...extra
  });

  // Compute submenu position (left & up)
  const helpItemRef = useRef(null);
  const [subCoords, setSubCoords] = useState({ left: 0, top: 0 });
  useLayoutEffect(() => {
    if (!helpOpen || !helpItemRef.current) return;
    const r = helpItemRef.current.getBoundingClientRect();
    const subW = 260; const gap = 10;
    let left = r.left - subW - gap;     // LEFT of the item
    if (left < 8) left = 8;
    // open upwards: top just above item's top
    let top = r.top - 8 - 260; // assume submenu height; adjust after mount
    if (top < 8) top = 8;
    setSubCoords({ left, top });
  }, [helpOpen]);

  const submenuRef = useRef(null);
  useLayoutEffect(() => {
    if (!helpOpen || !submenuRef.current || !helpItemRef.current) return;
    const sr = submenuRef.current.getBoundingClientRect();
    const ir = helpItemRef.current.getBoundingClientRect();
    const gap = 10;
    // Left of item
    let left = ir.left - sr.width - gap;
    if (left < 8) left = 8;
    // Align top so submenu's bottom touches item's top (open upwards)
    let top = ir.top - sr.height - gap;
    if (top < 8) top = 8;
    setSubCoords({ left, top });
  }, [helpOpen]);

  return (
    <div style={{position:'relative'}}>
      <button ref={btnRef} onClick={() => setOpen(v => !v)} style={s.trigger} aria-expanded={open}>
        <span style={{display:'inline-flex', alignItems:'center', gap:10}}>
          <span style={{display:'inline-flex', width:24, height:24, alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.08)', borderRadius:999}}>G</span>
          <span>Guest</span>
        </span>
        <span style={{opacity:0.8}}>▾</span>
      </button>

      {portalEl && open && createPortal(
        <div ref={panelRef} style={s.panel} role="menu" aria-label="User menu">
          <div style={s.email}>{email}</div>

          <a href="/upgrade" style={hoverStyle('up')} onMouseEnter={()=>setHover('up')} onMouseLeave={()=>setHover('')}>Upgrade plan <span>↗</span></a>
          <a href="/customize" style={hoverStyle('custom')} onMouseEnter={()=>setHover('custom')} onMouseLeave={()=>setHover('')}>Customize ChatGPT <span>⚙</span></a>
          <a href="/settings" style={hoverStyle('settings')} onMouseEnter={()=>setHover('settings')} onMouseLeave={()=>setHover('')}>Settings <span>🛠</span></a>

          <div ref={helpItemRef}
               style={hoverStyle('help')}
               onMouseEnter={()=>{ setHover('help'); }}
               onMouseLeave={()=>{ setHover(''); }}
               onClick={(e)=>{ e.stopPropagation(); setHelpOpen(v=>!v); }}>
            <span>Help</span> <span>▸</span>
          </div>

          <div
            style={{...s.item, ...s.danger, marginBottom:0}}
            onClick={()=>{ if(onLogout) onLogout(); }}>
            Log out <span>⎋</span>
          </div>

          {helpOpen && createPortal(
            <div ref={submenuRef} style={{...s.submenu, left: subCoords.left, top: subCoords.top}} role="menu" aria-label="Help submenu">
              <a href="https://example.com/help-center" target="_blank" rel="noreferrer" style={hoverStyle('hc', {marginBottom:6})} onMouseEnter={()=>setHover('hc')} onMouseLeave={()=>setHover('')}>Help center</a>
              <a href="https://example.com/release-notes" target="_blank" rel="noreferrer" style={hoverStyle('rn', {marginBottom:6})} onMouseEnter={()=>setHover('rn')} onMouseLeave={()=>setHover('')}>Release notes</a>
              <a href="https://example.com/terms" target="_blank" rel="noreferrer" style={hoverStyle('tp', {marginBottom:6})} onMouseEnter={()=>setHover('tp')} onMouseLeave={()=>setHover('')}>Terms & policies</a>
              <a href="https://example.com/downloads" target="_blank" rel="noreferrer" style={hoverStyle('dl', {marginBottom:6})} onMouseEnter={()=>setHover('dl')} onMouseLeave={()=>setHover('')}>Download apps</a>
              <a href="https://example.com/shortcuts" target="_blank" rel="noreferrer" style={hoverStyle('ks')} onMouseEnter={()=>setHover('ks')} onMouseLeave={()=>setHover('')}>Keyboard shortcuts</a>
            </div>,
            portalEl
          )}
        </div>,
        portalEl
      )}
    </div>
  );
}