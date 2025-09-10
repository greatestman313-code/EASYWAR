# EASYWAR UI Mock (Fixed)
- Next.js 14 (App Router)
- Pure JS/JSX (No TypeScript)
- Tailwind + PostCSS + Autoprefixer
- vercel.json with explicit install/build to stabilize CI

## Quick Start
```bash
npm ci || npm install
npm run dev
```

Deploy on Vercel by importing the repo. No env vars needed for this mock.

## Text → Image & Ad Generation
Set your OpenAI key in Vercel:
- `OPENAI_API_KEY`

Routes:
- `POST /api/gen/image` { prompt, size } -> { url }
- `POST /api/gen/ad` { prompt, withImage } -> { ad:{headline,body,cta}, imageUrl? }

In the chat, click the three-dot menu in the composer → choose "توليد صورة من نص" or "توليد إعلان من نص".
