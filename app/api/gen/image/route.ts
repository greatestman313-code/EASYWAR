import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const SIZES = new Set(['512x512','768x768','1024x1024'])

export async function POST(req: NextRequest){
  const { prompt, size } = await req.json()
  if(!prompt || !String(prompt).trim()) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
  const apiKey = process.env.OPENAI_API_KEY
  if(!apiKey) return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 400 })
  const openai = new OpenAI({ apiKey })

  const s = SIZES.has(size) ? size : '1024x1024'
  try{
    const r = await openai.images.generate({ model: 'gpt-image-1', prompt, size: s as any })
    const url = r.data?.[0]?.url
    if(!url) return NextResponse.json({ error: 'No image URL returned', raw: r }, { status: 500 })
    return NextResponse.json({ url })
  }catch(e:any){
    return NextResponse.json({ error: 'OpenAI error', detail: e?.message || String(e) }, { status: 500 })
  }
}
