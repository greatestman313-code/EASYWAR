
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const base = process.env.VISION_BASE_URL || 'http://localhost:8001'
  const body = await req.json()
  const r = await fetch(`${base}/analyze`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } })
  const js = await r.json()
  return NextResponse.json(js, { status: r.status })
}
