export const runtime = "edge";
export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  return new Response(JSON.stringify({ ok: true, hasKey }), {
    headers: { "content-type": "application/json" },
  });
}
