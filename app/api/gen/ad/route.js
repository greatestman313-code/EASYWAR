export async function POST(req) {
  try {
    const { prompt, withImage = false, size = "1024x1024" } = await req.json();
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), { status: 400 });
    }
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
    }

    // Generate ad copy (headline, body, cta) via Chat Completions
    const chatResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: "You are an ad copywriter. Return concise Arabic output in JSON with keys: headline, body, cta." },
          { role: "user", content: `أنشئ إعلانًا مختصرًا باللغة العربية بناءً على هذا الوصف: ${prompt}. أعد فقط JSON بلا شرح.` }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!chatResp.ok) {
      const msg = await chatResp.text();
      return new Response(JSON.stringify({ error: "OpenAI chat error", detail: msg }), { status: 500 });
    }
    const chatData = await chatResp.json();
    let ad = {};
    try { ad = JSON.parse(chatData.choices?.[0]?.message?.content || "{}"); } catch { ad = {}; }

    let imageUrl = null;
    if (withImage) {
      const imgResp = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: `إعلان بصري بتنسيق سوشيال احترافي مستوحى من: ${prompt}. نمط داكن أنيق وهوية Neon Blue.`,
          size
        })
      });
      if (imgResp.ok) {
        const d = await imgResp.json();
        imageUrl = d?.data?.[0]?.url || null;
      }
    }

    return new Response(JSON.stringify({ ad, imageUrl }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error", detail: String(e) }), { status: 500 });
  }
}
