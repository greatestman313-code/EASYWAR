export const metadata = {
  title: "CHAT EASY WAR",
  description: "واجهة دردشة Mock"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
