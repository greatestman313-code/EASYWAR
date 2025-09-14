import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest){
  const { messages = [] } = await req.json()
  const apiKey = process.env.OPENAI_API_KEY
  if(!apiKey) return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 400 })
  const openai = new OpenAI({ apiKey })

  const sys = { role:'system', content:'أنت مساعد عربي ودود ومتقن، يعطي إجابات عملية ومختصرة عند الحاجة.' }
  try{
    const chat = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [sys as any, ...messages.slice(-20)]
    })
    const reply = chat.choices?.[0]?.message?.content ?? '…'
    return NextResponse.json({ reply })
  }catch(e:any){
    return NextResponse.json({ error: 'OpenAI error', detail: e?.message || String(e) }, { status: 500 })
  }
}
