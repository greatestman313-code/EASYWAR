import { NextRequest } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function POST(req: NextRequest){
  const body = await req.text();
  const { messages, mode, chat_id, user_id, set_title } = JSON.parse(body || "{}");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const system = {
    role: "system",
    content: [
      "أنت مساعد عربي متخصص بالتسويق والتسعير.",
      "التزم بالتنسيق الجيد، النقاط، والعناوين الواضحة.",
      "اكتب بخط Cairo على واجهة داكنة.",
      mode === 'deep' ? "حلّل بعمق واذكر الافتراضات." : "",
      mode === 'advanced' ? "أضف مصادر أفكار وأسئلة متابعة ذكية." : ""
    ].filter(Boolean).join("\n")
  };

  // Save user message
  const last = messages[messages.length-1];
  if(last?.role === "user" && chat_id){
    await admin.from("messages").insert({ chat_id, role: "user", content: last.content });
    if(set_title){
      await admin.from("chats").update({ title: last.content.slice(0, 60) }).eq("id", chat_id);
    }
  }

  // Stream from OpenAI
  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [system, ...messages].map((m:any)=>({ role: m.role, content: m.content }))
  });

  let assistantText = "";
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller){
      (async () => {
        for await (const part of stream) {
          const delta = part.choices[0]?.delta?.content || "";
          if(delta){
            assistantText += delta;
            controller.enqueue(encoder.encode(delta));
          }
        }
        controller.close();

        // Save assistant message
        if(chat_id && assistantText.trim().length>0){
          admin.from("messages").insert({ chat_id, role: "assistant", content: assistantText });
        }
      })();
    }
  });
  return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" }});
}
