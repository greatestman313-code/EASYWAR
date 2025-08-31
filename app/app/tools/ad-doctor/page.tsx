
export default function AdDoctorTool(){
  const content = `
Easy Ad Doctor — فكرة موحّدة شاملة لتحليل وتحسين الإعلانات (Spec v1.0)
يشمل وحدات التحليل، التقارير، محاكاة A/B ...
[ضع هنا النص الكامل الذي أرسلته (قابل للتعديل لاحقًا)]
`;
  return (
    <div className="p-6 space-y-4 text-[12pt] leading-8">
      <h1 className="text-2xl font-bold">تحليل الإعلانات — Easy Ad Doctor</h1>
      <p className="text-white/80">الرجاء اعتماد اللون الأبيض للخطوط واللون الرمادي الداكن للخلفية ونوع الخط Cairo.</p>
      <pre className="whitespace-pre-wrap">{content}</pre>
    </div>
  );
}
