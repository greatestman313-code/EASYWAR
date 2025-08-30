'use client';
import { useEffect, useState } from 'react';

const TRAITS = ['Chatty','Witty','Straight shooting','Encouraging','Gen Z','Traditional','Forward thinking'];

export default function Customize(){
  const [form, setForm] = useState({ name:'', job:'', personality:'Default', traits:[], notes:'', enable:true, caps:{web:true, code:true, canvas:true, voice:true} });
  useEffect(()=>{
    if (typeof window==='undefined') return;
    const raw = localStorage.getItem('ew_prefs');
    if (raw) try{ setForm(JSON.parse(raw)); }catch{}
  },[]);
  const save = ()=>{
    localStorage.setItem('ew_prefs', JSON.stringify(form));
    alert('Saved!');
  };
  const toggleTrait = (t)=>{
    setForm(f=>({...f, traits: f.traits.includes(t)? f.traits.filter(x=>x!==t): [...f.traits, t]}));
  };
  return (
    <div className="docWrap">
      <h1>Customize ChatGPT</h1>
      <div className="formGrid">
        <label>What should ChatGPT call you?
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Nickname" />
        </label>
        <label>What do you do?
          <input value={form.job} onChange={e=>setForm({...form, job:e.target.value})} placeholder="Interior designer" />
        </label>
        <label>What personality should ChatGPT have?
          <select value={form.personality} onChange={e=>setForm({...form, personality:e.target.value})}>
            <option>Default</option><option>Friendly</option><option>Direct</option><option>Playful</option>
          </select>
        </label>
        <div>
          <div>What traits should ChatGPT have?</div>
          <div className="chips">
            {TRAITS.map(t=>(
              <button key={t} className={form.traits.includes(t)?'chip active':'chip'} onClick={()=>toggleTrait(t)} type="button">+ {t}</button>
            ))}
            <button className="chip" onClick={()=>setForm({...form, traits:[]})} type="button">↺ Reset</button>
          </div>
        </div>
        <label>Anything else ChatGPT should know about you?
          <textarea rows={4} value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} placeholder="Interests, values, or preferences to keep in mind" />
        </label>

        <details open>
          <summary>Advanced</summary>
          <div className="toggles">
            <label><input type="checkbox" checked={form.caps.web} onChange={e=>setForm({...form, caps:{...form.caps, web:e.target.checked}})} /> Web Search</label>
            <label><input type="checkbox" checked={form.caps.code} onChange={e=>setForm({...form, caps:{...form.caps, code:e.target.checked}})} /> Code</label>
            <label><input type="checkbox" checked={form.caps.canvas} onChange={e=>setForm({...form, caps:{...form.caps, canvas:e.target.checked}})} /> Canvas</label>
            <label><input type="checkbox" checked={form.caps.voice} onChange={e=>setForm({...form, caps:{...form.caps, voice:e.target.checked}})} /> Advanced Voice</label>
          </div>
        </details>
        <label className="inline">
          <input type="checkbox" checked={form.enable} onChange={e=>setForm({...form, enable:e.target.checked})} /> Enable for new chats
        </label>

        <div className="actions">
          <button className="btn ghost" onClick={()=>history.back()}>Cancel</button>
          <button className="btn" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
