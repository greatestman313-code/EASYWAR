
# EASYWAR Next.js + Supabase + OpenAI (App Router, TypeScript)

- ✔ App Router + TypeScript
- ✔ next.config.mjs (Vercel-compatible)
- ✔ Supabase SSR (createServerClient) – ثابت بدون أخطاء Types
- ✔ OpenAI integration (chat completions)
- ✔ واجهة اختبار + مسارات API

## تشغيل
```bash
npm i
cp .env.example .env.local
npm run dev
```
ثم افتح http://localhost:3000

## متغيرات البيئة
انسخ القيم في `.env.local` وأضفها في Vercel:
```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

## مسارات API
- `POST /api/ai/rate-post` → {score, positives, negatives, is_ad, notes}
- `GET /api/db/profile` → مثال قراءة من جدول `profiles`
- `GET /api/health` → فحص صحي
