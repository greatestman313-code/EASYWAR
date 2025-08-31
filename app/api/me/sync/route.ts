import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { id, email, name, avatar_url } = await req.json();
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  await client.from("users_profile").upsert({ id, email, name, avatar_url }, { onConflict: "id" });
  return NextResponse.json({ ok: true });
}
