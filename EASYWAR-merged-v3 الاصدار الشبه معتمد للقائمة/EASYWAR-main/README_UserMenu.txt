UserMenu v1.2 — Drop-in
=======================

الغرض
-----
قائمة حساب المستخدم كـ Overlay يفتح للأعلى، وقائمة Help فرعية تفتح لليسار وفوق.
بدون حدود قص/قصاصة من القائمة الجانبية (باستخدام portal + position:fixed).

التركيب
-------
1) انسخ `app/components/UserMenu.js` إلى مشروعك بنفس المسار.
2) في المكان الذي يظهر فيه حساب المستخدم داخل الشريط الجانبي:
   ```jsx
   import UserMenu from '@/app/components/UserMenu';

   <UserMenu email={currentUserEmail || 'guest@example.com'} onLogout={()=>{/* TODO: signOut() */}} />
   ```

خصائص
------
- حجم خط 12px لكل عناصر اللوحة.
- فتح لأعلى عبر حساب ارتفاع اللوحة بعد الـ mount.
- Help submenu تخرج يسارًا وفوق (تُحسب إحداثياتها من عنصر Help).
- إغلاق بالنقر خارج اللوحة أو زر Escape.
- روابط الـ Help حالياً placeholders ويمكنك تغييرها.

ملاحظات
-------
- إن كان لديك CSS عام يفرض `overflow:hidden` على body أو حاوية الجذر، لا مشكلة — اللوحات `position: fixed` في `document.body`.
- يمكنك تعديل الألوان عبر CSS variables مثل `--text` إن كانت موجودة لديك.