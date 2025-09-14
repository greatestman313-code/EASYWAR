
import { NextRequest } from 'next/server'
import { renderToReadableStream } from 'react-dom/server'
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer'

export const runtime = 'nodejs'

const styles = StyleSheet.create({
  page: { padding: 24, backgroundColor: '#0b0f14', color: '#ffffff' },
  h1: { fontSize: 18, marginBottom: 8 },
  h2: { fontSize: 14, marginVertical: 6, color: '#38bdf8' },
  p: { fontSize: 10, lineHeight: 1.5 }
})

function Report({ title, content }: { title: string, content: string }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View><Text style={styles.h1}>{title}</Text></View>
        <View><Text style={styles.p}>{content}</Text></View>
      </Page>
    </Document>
  )
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const title = body?.title ?? 'تقرير CHAT EASY WAR'
  const content = (body?.text ?? '').slice(0, 50000)
  // NOTE: @react-pdf returns a stream; Vercel Node runtime will return PDF buffer
  // Here, we simulate by returning plain PDF stream
  // In practice, you'd use pdf() from @react-pdf/renderer/server, but it's ESM; stream works on Node >=18
  const stream = await renderToReadableStream(Report({ title, content }))
  return new Response(stream as any, {
    headers: { 'Content-Type': 'application/pdf' }
  })
}
