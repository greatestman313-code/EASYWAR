import { openai, assertKey } from "@/lib/openai";
export const runtime = "edge";

export async function POST(req) {
  try {
    assertKey();
    const { context = "", lang = "ar" } = await req.json();

    const messages = [
      { role: "system", content: "أنت خبير إعلانات. أعد نسخة إعلان قصيرة: عنوان قوي + CTA." },
      { role: "user", content: `اللغة: ${lang}\nالسياق:\n${context}\nأعد: عنوان (<= 12 كلمة) + CTA واضح.` },
    ];

    const r = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.8,
    });

    const text = r.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ text }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "خطأ غير متوقع" }), { status: 500 });
  }
}
