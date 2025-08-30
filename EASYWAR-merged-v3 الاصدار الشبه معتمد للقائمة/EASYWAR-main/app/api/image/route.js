import { NextResponse } from "next/server";

export async function POST(request) {
  const { prompt } = await request.json().catch(()=>({}));
  if (!prompt) return NextResponse.json({ ok:false, error:"Missing 'prompt'." }, { status:400 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='576'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#0f1f4d'/>
        <stop offset='100%' stop-color='#6ea8ff'/>
      </linearGradient></defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='sans-serif' font-size='36'>
        EASYWAR — ${prompt.slice(0,40)}
      </text>
    </svg>`);
    const url = `data:image/svg+xml;charset=utf-8,${svg}`;
    return NextResponse.json({ ok:true, url, note:"Set OPENAI_API_KEY to get real images." });
  }
  return NextResponse.json({ ok:true, url:"about:blank", note:"Hook to OpenAI images when key is set." });
}
