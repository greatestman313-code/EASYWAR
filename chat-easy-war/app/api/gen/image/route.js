export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function callImage(key, org, prompt, size){
  const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${key}` };
  if (org) headers["OpenAI-Organization"] = org;
  const resp = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST", headers, body: JSON.stringify({ model: "gpt-image-1", prompt, size })
  });
  const text = await resp.text(); let data; try{ data = JSON.parse(text); }catch{ data = { raw: text }; }
  return { ok: resp.ok, status: resp.status, data };
}

export async function POST(req){
  try{
    const { prompt = "", size = "1024x1024" } = await req.json();
    if (!prompt.trim()) return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
    const org = process.env.OPENAI_ORG || process.env.OPENAI_ORGANIZATION || null;
    const keysList = (process.env.OPENAI_API_KEYS?.split(',').map(s=>s.trim()).filter(Boolean) ?? []).concat(process.env.OPENAI_API_KEY || []).filter(Boolean);
    if (keysList.length === 0) return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), { status: 400 });
    const allowed = new Set(["512x512","768x768","1024x1024"]);
    const imgSize = allowed.has(size) ? size : "1024x1024";
    let lastErr = null;
    for (const key of keysList){
      const r = await callImage(key, org, prompt, imgSize);
      if (r.ok){
        const first = Array.isArray(r.data?.data) ? r.data.data[0] : null;
        const url = first?.url || (first?.b64_json ? `data:image/png;base64,${first.b64_json}` : null);
        if (url) return Response.json({ url });
        return new Response(JSON.stringify({ error:"No image URL returned", raw:r.data }), { status: 500 });
      }
      const m = (r.data?.error?.message || "").toLowerCase();
      const quotaish = m.includes("billing hard limit") || m.includes("insufficient_quota") || r.status === 429;
      if (!quotaish){ lastErr = r; break; }
      lastErr = r;
    }
    const detail = lastErr?.data?.error?.message || lastErr?.data?.message || lastErr?.data?.raw || 'Unknown error';
    return new Response(JSON.stringify({ error: "OpenAI image error", detail }), { status: lastErr?.status || 500 });
  }catch(e){ return new Response(JSON.stringify({ error: "Server error", detail: String(e) }), { status: 500 }); }
}
