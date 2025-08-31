export async function streamChatResponse(prompt: string): Promise<ReadableStream> {
  // Stub: Replace with OpenAI streaming implementation
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      const chunks = ['يجري التحليل… ', 'قيد المعالجة… ', 'هذه إجابة مبدئية.']
      let i = 0
      const interval = setInterval(() => {
        if (i >= chunks.length) { controller.close(); clearInterval(interval); return }
        controller.enqueue(encoder.encode(chunks[i++]))
      }, 500)
    }
  })
}
