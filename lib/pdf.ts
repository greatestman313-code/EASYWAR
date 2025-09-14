import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function htmlToSimplePDF(html: string) {
  // Minimal: render as plain text. (You can switch to html-to-image pipeline later.)
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const text = html.replace(/<[^>]+>/g, '').slice(0, 4000)
  const fontSize = 10
  const margin = 40
  const maxWidth = 595 - margin * 2

  // naive wrapping
  const words = text.split(/\s+/)
  let line = ''
  let y = 800
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    const width = font.widthOfTextAtSize(test, fontSize)
    if (width > maxWidth) {
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(1,1,1) })
      y -= 14
      line = w
    } else {
      line = test
    }
  }
  if (line) page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(1,1,1) })
  const bytes = await pdfDoc.save()
  return Buffer.from(bytes)
}
