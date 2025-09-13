export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req){
  try{
    const { messages = [] } = await req.json();
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), { status: 400 });
    }
    const chatMessages = (messages || []).slice(-20).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '')
    }));
    if (chatMessages.length === 0) chatMessages.push({ role: 'user', content: 'مرحبا' });

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: "أنت مساعد عربي ودود ومتقن، يعطي إجابات عملية ومختصرة عند الحاجة." },
          ...chatMessages
        ]
      })
    });

    if (!resp.ok) {
      const msg = await resp.text();
      return new Response(JSON.stringify({ error: "OpenAI chat error", detail: msg }), { status: 500 });
    }
    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "…";
    return Response.json({ reply });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error", detail: String(e) }), { status: 500 });
  }
}
