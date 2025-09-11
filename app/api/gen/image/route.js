import { openai, assertKey } from "@/lib/openai";

export const runtime = "edge";

export async function POST(req) {
  try {
    assertKey();
    const { prompt, size = "1024x1024" } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "prompt مطلوب" }), { status: 400 });
      }

    const resp = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size,
    });

    const b64 = resp.data?.[0]?.b64_json;
    if (!b64) return new Response(JSON.stringify({ error: "فشل التوليد" }), { status: 500 });

    return new Response(JSON.stringify({ dataUrl: `data:image/png;base64,${b64}` }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "خطأ غير متوقع" }), { status: 500 });
  }
}
