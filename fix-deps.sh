#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Fixing package.json dependencies & scripts for EASYWAR..."

# Ensure we're in a Node project
if [ ! -f package.json ]; then
  echo "❌ package.json not found. Run this in your project root."
  exit 1
fi

# Add/upgrade required runtime deps
npm pkg set dependencies.openai="^4.57.0"
npm pkg set dependencies["@supabase/ssr"]="^0.5.0"
npm pkg set dependencies["@supabase/supabase-js"]="^2.45.4"

# Align Next/React versions known-good on Vercel
npm pkg set dependencies.next="14.2.7"
npm pkg set dependencies.react="18.3.1"
npm pkg set dependencies["react-dom"]="18.3.1"

# Make sure Vercel can call a 'vercel-build' script (falls back to build if missing)
npm pkg set scripts.vercel-build="next build"

# Optional: set engines to recommended range
node -e "let p=require('./package.json'); p.engines={node: '>=18.17.0 <19'}; require('fs').writeFileSync('package.json', JSON.stringify(p,null,2)); console.log('✅ engines set to >=18.17.0 <19')"

echo "📦 Installing updated dependencies..."
npm i

echo "✅ Done. Commit and push your changes:"
echo "   git add package.json package-lock.json"
echo "   git commit -m 'chore: add openai/@supabase deps and align next/react for Vercel'"
echo "   git push"
