# EASYWAR Chat – نسخة متكاملة

## التشغيل محليًا
1) انسخ `.env.example` إلى `.env.local` وضع مفتاح OpenAI الخاص بك.
2) `npm install`
3) `npm run dev` ثم افتح `http://localhost:3000`

## على Vercel
- أضف `OPENAI_API_KEY` في Project → Settings → Environment Variables.
- `NEXT_PUBLIC_APP_NAME=CHAT EASY WAR`
- ابني وانطلق.

## ميزات
- إدخال يتمدّد للأعلى، Enter للإرسال و Shift+Enter لسطر جديد.
- قائمة (+) تطلع للأعلى وتحتوي "توليد صورة من نص" و "اقتراح إعلان سريع".
- شريط أسفل الرسائل: حفظ/نسخ/لايك/دسلايك لـ AI، ونسخ فقط للمستخدم.
- توليد صور (gpt-image-1) ونسخة إعلان مختصرة (gpt-4o-mini).
