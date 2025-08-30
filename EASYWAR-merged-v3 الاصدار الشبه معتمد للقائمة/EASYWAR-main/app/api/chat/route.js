import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { prompt, mode = "fast", history = [] } = body;
  if (!prompt) {
    return NextResponse.json({ ok: false, error: "Missing 'prompt'." }, { status: 400 });
  }
  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  if (mode === "deep") {
    await delay(1200);
    const reply = [
      "تحليل عميق (تجريبي):",
      "- فهمت طلبك: " + prompt,
      "- اعتبارات إضافية بناءً على المحادثة (" + history.length + " رسالة).",
      "- مخرجات مقترحة بنسخة موجزة + نقاط منظمة.",
      "",
      "🧠 نسخة موجزة:",
      "هذا رد تجريبي — اربطه لاحقًا بـ OpenAI لإجابة حقيقية."
    ].join("\n");
    return NextResponse.json({ ok: true, reply, meta: { mode } });
  }

  return NextResponse.json({ ok: true, reply: `Echo: ${prompt}`, meta: { mode } });
}
