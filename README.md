# Chat Easy War — Skeleton (Next.js + Tailwind + Supabase + OpenAI)

Implements the v1.3 spec (MVP-ready).

## Quickstart
1) Copy `.env.example` → `.env.local` and fill values.
2) Install deps: `npm i` (or `pnpm i` / `yarn`).
3) Dev: `npm run dev`.
4) Deploy to Vercel and add envs.

## Tech
- Next.js App Router (Edge for some API routes)
- TailwindCSS + Cairo font (via next/font)
- Supabase (Auth/DB/Storage) + RLS-ready
- Upstash Redis (rate-limit + caching)
- OpenAI (stubbed; plug your key)
- SSE streaming demo for chat
- i18n hooks (scaffold)
- Basic pages: login, chat, settings, help
- API routes: /api/founder, /api/pricing, /api/ads, /api/billing, /api/integrations

> NOTE: This is a professional skeleton with stubs and TODOs that you can expand.
