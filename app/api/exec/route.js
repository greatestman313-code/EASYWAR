import { NextResponse } from "next/server";
export async function GET(request){
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "Guest";
  return NextResponse.json({ ok:true, hello: name });
}
