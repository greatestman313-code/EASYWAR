# EASYWAR Next.js + Supabase + OpenAI (App Router, TypeScript)

مشروع جاهز للنشر على Vercel مع تكاملات Supabase و OpenAI.

## التشغيل محليًا
1. ثبّت الاعتماديات:
   ```bash
   npm i
   ```
2. أنشئ ملف `.env.local` وانسخ إليه القيم من `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
3. شغّل وضع التطوير:
   ```bash
   npm run dev
   ```
4. افتح: http://localhost:3000

## المتغيرات البيئية
- `OPENAI_API_KEY`: مفتاح OpenAI (سري، خادم فقط).
- `NEXT_PUBLIC_SUPABASE_URL`: رابط مشروع Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: المفتاح العام (Anon).

## النشر على Vercel
- ادفع الكود إلى GitHub.
- اربط المستودع في Vercel.
- أضف المتغيرات في Project → Settings → Environment Variables.
- البناء يستخدم `vercel-build: next build`.

## مسارات API
- `POST /api/ai/rate-post`: تقييم بوست (Caption/Image URL) ويعيد JSON {score, positives, negatives, is_ad, notes}.
- `GET  /api/db/profile`: مثال قراءة صف من جدول `profiles` في Supabase (عدّل الجدول حسب مشروعك).
- `GET  /api/health`: فحص صحّة سريع.

## ملاحظات
- لا حاجة إلى Tailwind؛ توجد CSS بسيطة في `app/globals.css`. يمكنك إضافة Tailwind لاحقًا.
- إن كانت سكيمتك مختلفة في Supabase، عدّل الاستعلام في `app/api/db/profile/route.ts`.