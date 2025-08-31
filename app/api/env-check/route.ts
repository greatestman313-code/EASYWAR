export async function GET() {
  return Response.json({
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE,
  });
}
