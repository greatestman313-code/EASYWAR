import { NextRequest } from 'next/server'
export const runtime = 'edge'
export async function POST(req: NextRequest) {
  const body = await req.json()
  // TODO: validate with Zod, call LLM, save to Supabase
  return Response.json({ ok: true, module: 'founder.diagnose', received: body })
}
