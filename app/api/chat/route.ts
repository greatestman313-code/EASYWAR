import { NextRequest } from 'next/server'
import { ratelimit } from '@/lib/rateLimit'
import { streamChatResponse } from '@/lib/openai'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  if (ratelimit) {
    const ip = req.headers.get('x-forwarded-for') ?? 'global'
    const { success } = await ratelimit.limit(`chat:${ip}`)
    if (!success) {
      return new Response('Rate limit exceeded', { status: 429 })
    }
  }

  const { prompt } = await req.json()
  const stream = await streamChatResponse(prompt || '')
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Transfer-Encoding': 'chunked'
    }
  })
}
