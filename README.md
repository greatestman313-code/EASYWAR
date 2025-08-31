# Chat Easy War — Functional MVP (Fixed)
إصلاحات:
- منع Prerender لصفحة /login (`export const dynamic = 'force-dynamic'`).
- تهيئة Supabase Client بشكل Lazy لتجنب الخطأ "supabaseKey is required" أثناء البناء.
- حماية مسارات API من غياب `SUPABASE_SERVICE_ROLE` برسالة واضحة بدل فشل صامت.
- بقية الميزات: Auth + Threads/Messages + OpenAI Streaming.

## تشغيل
1) انسخ `.env.example` إلى `.env.local` واملأ القيم.
2) على Supabase: نفّذ `supabase/schema.sql`.
3) `npm i` ثم `npm run dev`.
4) افتح `/login` ثم `/chat`.

## النشر على Vercel
أضف المتغيرات: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY` (واختياريًا `SUPABASE_SERVICE_ROLE`).
ثم أعد النشر.


## Env Check
أضفنا مسار فحص البيئة على `/api/env-check` ليتأكد أن المتغيرات مضبوطة بدون كشف القيم.
