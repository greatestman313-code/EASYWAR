import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'

export async function mdToHtml(md: string) {
  const file = await unified().use(remarkParse).use(remarkHtml).process(md)
  return String(file)
}
