# Chat Easy War — Functional MVP
ميزات عملية:
- تسجيل الدخول عبر البريد (Magic Link) و Google (Supabase Auth).
- حماية مسار /chat عبر middleware.
- إنشاء محادثات (Threads) وحفظ الرسائل (Messages) في Supabase مع RLS.
- بثّ حي من OpenAI في /api/chat وواجهة تلتقط البث.
- قائمة المحادثات في الشريط الجانبي + التنقل بينها.
- بنية جاهزة لتوسيع الأدوات والخصائص.

## تشغيل
1) أنشئ مشروع Supabase، وفعل Google OAuth (اختياري).
2) انسخ `.env.example` إلى `.env.local` واملأ القيم.
3) نفّذ سكربت `supabase/schema.sql` في SQL Editor.
4) `npm i` ثم `npm run dev`.
5) افتح `/login` وسجّل دخولك، ثم اذهب إلى `/chat`.

> ملاحظة: حتى تعمل CRUD عبر مسارات الخادم استخدم متغير `SUPABASE_SERVICE_ROLE` (لا تضعه في public)، أو استبدلها بعمل CRUD من المتصفح مع RLS مباشرة.
