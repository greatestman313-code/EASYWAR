export default function ForbiddenPage(){
  return (
    <div className="min-h-dvh bg-bgdark text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="text-2xl font-bold mb-2">403 — وصول مرفوض</div>
        <div className="opacity-80 mb-4">ليس لديك صلاحية الوصول إلى هذه الصفحة.</div>
        <a href="/" className="px-4 py-2 rounded bg-neon text-black inline-block">العودة للرئيسية</a>
      </div>
    </div>
  );
}
