# CHAT EASY WAR — Starter (Next.js + Supabase + OpenAI + FastAPI Vision)

> سكلتون جاهز للنشر على Vercel + خدمة رؤية مستقلة.

## تشغيل محلي
```bash
cp .env.example .env.local
npm i
npm run dev
```

## نشر على Vercel
- Node 20.x (محدد عبر engines).
- لا تعتمد على تنزيل أوزان YOLO داخل Vercel.

## خدمة الرؤية (اختياري)
```bash
cd services/vision
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# حمّل أوزان YOLO محليًا في مجلد المشروع الأعلى:
cd ../.. && node scripts/fetch-yolo-weights.mjs
# شغّل الخدمة
cd services/vision && uvicorn main:app --host 0.0.0.0 --port 8000
```

## SQL
- موجودة تحت `supabase/sql/*` (pricing.sql, ads.sql). نفّذها في Supabase.

## المهم:
- اربط `/app/api/upload` مع Supabase Storage لاحقًا.
- فعّل Supabase Auth/RLS حسب الدور.
- استبدل YOLO postprocess بمنطق فعلي عند توفر مخطط النموذج.
