export async function POST(req) {
  try {
    const { prompt, size = "1024x1024" } = await req.json();
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), { status: 400 });
    }
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
    }

    // OpenAI Images API (Generations)
    const resp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size
      })
    });

    if (!resp.ok) {
      const msg = await resp.text();
      return new Response(JSON.stringify({ error: "OpenAI error", detail: msg }), { status: 500 });
    }
    const data = await resp.json();
    const url = data?.data?.[0]?.url || null;
    if (!url) return new Response(JSON.stringify({ error: "No image url" }), { status: 500 });

    return new Response(JSON.stringify({ url }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error", detail: String(e) }), { status: 500 });
  }
}
