"use client";

import { useState } from "react";

export default function Home() {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const rate = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/ai/rate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, imageUrl, locale: "ar" })
      });
      const data = await res.json();
      setResult(data);
    } catch (e:any) {
      setError(e?.message || "خطأ غير معروف");
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    setError(null); setProfile(null);
    try {
      const res = await fetch("/api/db/profile", { cache: "no-store" });
      const data = await res.json();
      setProfile(data);
    } catch (e:any) {
      setError(e?.message || "خطأ غير معروف");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>🚀 EASYWAR – فحص البوست + مثال Supabase</h1>
        <p className="muted">
          هذا قالب جاهز: يقيّم البوست (نص + رابط صورة) عبر OpenAI،
          ويجرب قراءة صف من جدول <code>profiles</code> في Supabase (عدّل حسب مشروعك).
        </p>

        <div className="row">
          <div>
            <label>الكابتشن</label>
            <textarea rows={4} value={caption} onChange={e=>setCaption(e.target.value)} placeholder="اكتب الكابتشن هنا..." />
          </div>
          <div>
            <label>رابط الصورة (اختياري)</label>
            <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="https://example.com/post.jpg" />
          </div>
          <div className="flex">
            <button className="btn" onClick={rate} disabled={loading}>
              {loading ? "جارِ التقييم..." : "قيّم البوست"}
            </button>
            <button className="btn" onClick={getProfile}>
              جلب بروفايل تجريبي من Supabase
            </button>
          </div>
          {error && <div className="result">❌ {error}</div>}
          {result && (
            <div className="result">
              <b>نتيجة التقييم:</b>{" "}
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
          {profile && (
            <div className="result">
              <b>نتيجة Supabase:</b>{" "}
              <pre>{JSON.stringify(profile, null, 2)}</pre>
            </div>
          )}
        </div>

        <hr />
        <p className="muted">
          تذكير: ضع متغيرات البيئة في <code>.env.local</code> محليًا،
          وعلى Vercel من صفحة الإعدادات.
        </p>
      </div>
    </div>
  );
}