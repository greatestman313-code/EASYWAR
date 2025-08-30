import "./globals.css";
import { Cairo } from "next/font/google";
export const metadata = { title: "EASY WAR — Ultra v4", description: "ChatGPT-like interface (RTL) on Next.js App Router" };
const cairo = Cairo({ subsets: ["arabic","latin"], weight: ["400","500","600","700"], variable: "--font-cairo" });
export default function RootLayout({ children }){
  return (<html lang="ar" dir="rtl"><body className={cairo.className}>{children}</body></html>);
}
