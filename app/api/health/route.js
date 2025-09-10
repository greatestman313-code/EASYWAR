export async function GET() {
  const ok = !!process.env.OPENAI_API_KEY;
  return new Response(JSON.stringify({
    ok,
    hasOpenAIKey: ok,
    version: "v1.2.1"
  }), { status: ok ? 200 : 500, headers: { "content-type": "application/json" } });
}
