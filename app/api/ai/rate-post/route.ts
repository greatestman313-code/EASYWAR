import { NextResponse } from "next/server";
  import { openai } from "@/lib/openai";

  export const runtime = "nodejs";
  export const dynamic = "force-dynamic";

  type RequestBody = {
    caption?: string;
    imageUrl?: string;
    locale?: "ar" | "en";
  };

  export async function POST(req: Request) {
    try {
      const { caption = "", imageUrl = "", locale = "ar" } = (await req.json()) as RequestBody;

      const sys = locale === "ar"
        ? `أنت خبير تسويق. قيّم بوست انستغرام بناءً على النص والصورة (إن وجدت).
أعد JSON فقط بهذه البنية: 
{ "score": number (0-10), "positives": string[], "negatives": string[], "is_ad": boolean, "notes": string }`
        : `You are a marketing expert. Evaluate an Instagram-style post given text and optional image.
Return ONLY valid JSON:
{ "score": number (0-10), "positives": string[], "negatives": string[], "is_ad": boolean, "notes": string }`;

      const userParts = [
        caption ? `Caption:\n${caption}` : "",
        imageUrl ? `Image URL:\n${imageUrl}` : ""
      ].filter(Boolean).join("\n\n");

      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: userParts || "No content provided." }
        ]
      });

      const text = resp.choices[0]?.message?.content?.trim() || "{}";

      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({ raw: text }, { status: 200 });
      }
    } catch (err: any) {
      console.error("rate-post error:", err);
      return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
    }
  }