# CHAT EASY WAR — Skeleton (RTL, Tailwind, Next 14)

> نسخة مصححة للبناء على Vercel مع `postcss.config.cjs` (CJS) لتفادي خطأ ESM.

## تشغيل محلي
```bash
npm i
npm run dev
```

## البناء
```bash
npm run build && npm start
```

## ملاحظات
- RTL افتراضي، خط Cairo محمّل من Google Fonts.
- تم وضع صفحات الأدوات كـ placeholders حاليًا — اربط منطق التسعير/الإعلانات لاحقًا.
- API `/api/chat` يُرجع ردًا تجريبيًا — استبدله بربط OpenAI.

## إصلاح Vercel
- استخدمنا `postcss.config.cjs` لتجنّب خطأ: "module is not defined in ES module scope".
