import type { Metadata } from "next";
import "./globals.css";
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "CHAT EASY WAR",
  description: "منصة دردشة وأدوات تسويق وتسعير وتحليل إعلانات",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-cairo bg-base text-white`}>{children}</body>
    </html>
  );
}
