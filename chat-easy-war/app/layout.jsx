import './globals.css';

export const metadata = { title: 'CHAT EASY WAR', description: 'منصة دردشة وأدوات أعمال' };

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-bgdark text-white">{children}</body>
    </html>
  );
}
