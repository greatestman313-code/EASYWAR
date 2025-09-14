import { NextResponse } from "next/server";

export async function POST(req: Request){
  const body = await req.json().catch(()=>({}));
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const last = messages[messages.length-1]?.content ?? "مرحبا";
  // placeholder reply
  const reply = `تلقيت: ${last}
(هذه استجابة تجريبية — اربط OpenAI لاحقًا)`;
  return NextResponse.json({ reply });
}
