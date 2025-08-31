import { NextRequest } from 'next/server'

export const runtime = 'edge'

function sseToTextStream(sse: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ''
  return new ReadableStream({
    start(controller) {
      const reader = sse.getReader()
      const read = () => {
        reader.read().then(({ value, done }) => {
          if (done) { controller.close(); return }
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const data = trimmed.slice(5).trim()
            if (data === '[DONE]') { controller.close(); return }
            try {
              const json = JSON.parse(data)
              const delta = json.choices?.[0]?.delta?.content ?? ''
              if (delta) controller.enqueue(encoder.encode(delta))
            } catch {}
          }
          read()
        }).catch(()=>controller.close())
      }
      read()
    }
  })
}

export async function POST(req: NextRequest) {
  const { messages, model } = await req.json()
  const apiKey = process.env.OPENAI_API_KEY
  const usedModel = model || process.env.OPENAI_MODEL || 'gpt-4o-mini'
  if (!apiKey) return new Response('Missing OPENAI_API_KEY', { status: 500 })

  const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: usedModel, stream: true, temperature: 0.7, messages })
  })
  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text()
    return new Response('OpenAI error: '+text, { status: 500 })
  }
  const textStream = sseToTextStream(upstream.body)
  return new Response(textStream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } })
}
