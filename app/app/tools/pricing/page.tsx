
export default function PricingTool(){
  const content = `
Easy Smart Pricing — منصة تسعير ذكية للمنتجات والخدمات (Spec v1.0)
يشمل الوحدات والتحليلات والنماذج الرياضية...
[ضع هنا النص الكامل الذي أرسلته (قابل للتعديل لاحقًا)]
`;
  return (
    <div className="p-6 space-y-4 text-[12pt] leading-8">
      <h1 className="text-2xl font-bold">أداة التسعير — Easy Smart Pricing</h1>
      <p className="text-white/80">الرجاء اعتماد اللون الأبيض للخطوط واللون الرمادي الداكن للخلفية ونوع الخط Cairo.</p>
      <pre className="whitespace-pre-wrap">{content}</pre>
    </div>
  );
}
