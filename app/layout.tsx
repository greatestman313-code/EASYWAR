
import type { Metadata } from "next";
export const metadata: Metadata = { title: "EASYWAR Ultra", description: "Next + Supabase + OpenAI" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="ar" dir="rtl"><body>{children}</body></html>);
}
