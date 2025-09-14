
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { remark } from 'remark'
import html from 'remark-html'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const md = (body?.markdown || '').toString()
  const processed = await remark().use(html).process(md)
  return NextResponse.json({ html: String(processed) })
}
