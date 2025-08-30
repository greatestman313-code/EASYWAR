import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EASYWAR – AI & Supabase Boilerplate",
  description: "Next.js App Router + TypeScript + Supabase + OpenAI"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}