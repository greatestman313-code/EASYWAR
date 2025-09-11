import "./globals.css";

export const metadata = {
  title: "CHAT EASY WAR",
  description: "واجهة دردشة مع توليد صور وإعلانات",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
