
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const model = 'gpt-4o-mini'
const SYSTEM = 'أنت مساعد عربي ودود ومتقن، يعطي إجابات عملية ومختصرة عند الحاجة.'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const messages = Array.isArray(body?.messages) ? body.messages.slice(-20) : [{ role: 'user', content: 'مرحبا' }]
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  try {
    const resp = await client.chat.completions.create({
      model,
      temperature: 0.7,
      messages: [{ role: 'system', content: SYSTEM }, ...messages]
    })
    const reply = resp.choices?.[0]?.message?.content ?? '…'
    return NextResponse.json({ reply })
  } catch (e: any) {
    const msg = String(e?.message || e)
    const err = /insufficient_quota|billing hard limit|rate limit/i.test(msg)
      ? 'تم بلوغ حد الفوترة أو الحدّ الزمني، جرّب لاحقًا أو استخدم مفتاحًا آخر.'
      : msg
    return NextResponse.json({ error: err }, { status: 500 })
  }
}
