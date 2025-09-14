
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  const { idea } = await req.json()
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const prompt = `حلّل الفكرة التالية بنموذج SWOT وخطة أولية ونصائح تمويلية مختصرة:\n\n${idea}`
  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: 'أنت مستشار أعمال عربي مختصر ودقيق.' }, { role: 'user', content: prompt }]
  })
  const reply = resp.choices?.[0]?.message?.content ?? ''
  return NextResponse.json({ reply })
}
