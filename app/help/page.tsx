export default function HelpPage(){
  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">المساعدة</h1>
      <section className="space-y-2">
        <h2 className="font-semibold">Help Center</h2>
        <p>محتوى قابل للتعديل لاحقًا.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-semibold">Release Notes</h2>
        <ul className="list-disc pr-6 text-neutral-300">
          <li>v1.3 — Skeleton أولي + API Stubs + SSE.</li>
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="font-semibold">Terms & Policies</h2>
        <p>نصوص افتراضية للتجربة.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-semibold">Keyboard Shortcuts</h2>
        <ul className="list-disc pr-6 text-neutral-300">
          <li>Ctrl/⌘ + Enter: إرسال</li>
          <li>Ctrl + Tab: تبويب تالي</li>
          <li>C: نسخ الرد</li>
          <li>S: حفظ</li>
        </ul>
      </section>
    </main>
  )
}
