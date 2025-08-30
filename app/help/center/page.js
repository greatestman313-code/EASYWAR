'use client';
export default function HelpCenter(){
  return (
    <div className="docWrap">
      <h1>Help center</h1>
      <p>مرحبًا! هذه صفحة مركز المساعدة. المحتوى هنا مؤقت لغاية التخصيص.</p>
      <h2>البدء السريع</h2>
      <ol>
        <li>أنشئ محادثة جديدة من الشريط الجانبي.</li>
        <li>ارفع ملفاتك أو سجّل صوتك من زر +.</li>
        <li>جرّب أدوات البزنس/التسويق/تحليل الصور من التبويبات.</li>
      </ol>
      <h2>الأسئلة الشائعة</h2>
      <details><summary>كيف أحفظ محادثة؟</summary><p>تُحفظ تلقائيًا في قائمة المحادثات على اليمين.</p></details>
      <details><summary>كيف أخصّص الردود؟</summary><p>من قائمة الحساب ← Customize.</p></details>
    </div>
  );
}
