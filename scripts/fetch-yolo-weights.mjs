import { mkdir, stat, writeFile } from 'fs/promises'
import https from 'https'
import path from 'path'

const URL = process.env.YOLO_ONNX_URL || 'https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.onnx'
const OUT_DIR = 'models'
const OUT_FILE = path.join(OUT_DIR, 'yolov8n.onnx')

async function download(url, dest) {
  await mkdir(path.dirname(dest), { recursive: true })
  return new Promise((resolve, reject) => {
    const chunks = []
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('HTTP '+res.statusCode))
      res.on('data', c=>chunks.push(c))
      res.on('end', async ()=>{ await writeFile(dest, Buffer.concat(chunks)); resolve() })
    }).on('error', reject)
  })
}

try{
  await stat(OUT_FILE); console.log('[weights] exists', OUT_FILE)
}catch{
  console.log('[weights] downloading', URL)
  await download(URL, OUT_FILE)
  console.log('[weights] saved', OUT_FILE)
}
