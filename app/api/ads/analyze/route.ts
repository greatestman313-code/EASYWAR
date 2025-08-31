import { NextRequest } from 'next/server'
export const runtime = 'edge'
export async function POST(req: NextRequest) {
  const body = await req.json()
  // TODO: OCR + color extraction + scoring
  return Response.json({
    ok: true,
    module: 'ads.analyze',
    score: 82,
    dimensions: { copy: 26, visual: 20, usp: 12, audience: 12, tech: 12 },
    received: body
  })
}
