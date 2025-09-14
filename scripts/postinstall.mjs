/** Safe postinstall (no-op) */
import fs from 'fs/promises'
try {
  await fs.mkdir('tmp', { recursive: true })
  await fs.mkdir('models', { recursive: true })
  console.log('[postinstall] ok')
} catch (e) {
  console.warn('[postinstall] warn:', e?.message || e)
}
