
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const sb = supabaseServer()
  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  const ext = file.name.split('.').pop()?.toLowerCase()
  const allowed = ['png','jpg','jpeg','webp','mp4','pdf','txt','mp3','wav']
  if (!ext || !allowed.includes(ext)) return NextResponse.json({ error: 'Unsupported type' }, { status: 400 })
  const buf = Buffer.from(await file.arrayBuffer())
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { data, error } = await sb.storage.from('assets').upload(path, buf, {
    contentType: file.type,
    upsert: false
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const { data: pub } = sb.storage.from('assets').getPublicUrl(data.path)
  return NextResponse.json({ path: data.path, url: pub.publicUrl, mime: file.type, size: buf.length })
}
