'use client';
export default function ReleaseNotes(){
  return (
    <div className="docWrap">
      <h1>Release notes</h1>
      <p>سجلّ تغييرات مبدئي (Placeholders):</p>
      <h3>v5.3</h3>
      <ul>
        <li>تحسين الشريط الجانبي، وسكرول داكن مع لمعان.</li>
        <li>تثبيت حساب المستخدم في الأسفل.</li>
        <li>تصغير الخط إلى 12px وCairo.</li>
      </ul>
      <h3>v5.2</h3>
      <ul>
        <li>تصحيح JSX في الصفحات (style & aside).</li>
        <li>إنشاء صفحات الأدوات (بزنس/تسويق/إعلانات).</li>
      </ul>
    </div>
  );
}
