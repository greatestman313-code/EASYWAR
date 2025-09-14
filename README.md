
# CHAT EASY WAR — Full Stack (Next.js + Supabase + FastAPI Vision)

## 🔧 Quick start

1) **Create Supabase project** → copy credentials into `.env.local` from `.env.example`.
2) Run SQL:
   ```sql
   -- paste contents of supabase/schema.sql
   ```
3) Create Storage bucket `assets` (public).
4) **Install & run:**
   ```bash
   pnpm i   # or npm i / yarn
   pnpm dev
   ```
5) **Vision service:**
   ```bash
   pip install -r services/vision/requirements.txt
   python services/vision/download_weights.py
   uvicorn services.vision.api:app --port 8001
   ```

## 📦 Scripts
- `pnpm vision:dev` → start FastAPI (requires Python deps)
- `scripts/postinstall.mjs` downloads optional fonts

## 🔐 RLS & Roles
- `profiles.role`: 'guest'|'user'|'admin'
- `middleware.ts` protects `/chat/admin` for admins only.

## 🧠 OpenAI
- Real integration in `/app/api/chat/route.ts` and tools/business route.

## 🗃 Storage
- `/api/upload` uploads to Supabase Storage bucket `assets` and returns a public URL.

## 🧪 Exports
- Markdown → HTML: `/api/export/markdown`
- PDF via @react-pdf: `/api/export/pdf`

## 🛰 Vision
- ONNX YOLOv8 integration (download weights first), OCR + simple saliency.
- Proxy routes: `/api/vision/*`

## 🚀 Deploy
- Vercel + Node 20.x; set env vars; deploy. FastAPI can be hosted separately.

