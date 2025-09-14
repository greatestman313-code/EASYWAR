import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest){
  const data = await req.formData()
  const file = data.get('file')
  if(!file || typeof file === 'string') return NextResponse.json({ error: 'No file' }, { status: 400 })
  // Placeholder: في الإنتاج اربط Supabase Storage/S3 هنا
  return NextResponse.json({
    fileId: 'local-'+Date.now(),
    name: (file as File).name,
    mime: (file as File).type,
    size: (file as File).size,
    url: '#'
  })
}
