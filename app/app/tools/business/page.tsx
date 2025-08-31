
export default function BusinessTool(){
  const content = `
Easy Founder OS — منصة موحّدة لروّاد الأعمال (Spec v1.0)
منصّة ذكاء اصطناعي متكاملة من EASY WAR تجمع 8 أدوات أساسية في تجربة واحدة...
[ضع هنا النص الكامل الذي أرسلته (قابل للتعديل لاحقًا)]
`;
  return (
    <div className="p-6 space-y-4 text-[12pt] leading-8">
      <h1 className="text-2xl font-bold">أداة البزنس — Easy Founder OS</h1>
      <p className="text-white/80">الرجاء اعتماد اللون الأبيض للخطوط واللون الرمادي الداكن للخلفية ونوع الخط Cairo.</p>
      <pre className="whitespace-pre-wrap">{content}</pre>
    </div>
  );
}
