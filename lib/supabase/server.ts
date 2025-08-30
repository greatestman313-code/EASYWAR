
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

export function createSupabaseServer() {
  const cookieStore = cookies();

  // توافق كامل مع @supabase/ssr في بيئات CI/Vercel مع اختلافات التايبنج
  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        }
      }
    } as any
  );

  return client;
}
