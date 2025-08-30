import { marked } from "marked";
import hljs from "highlight.js";
marked.setOptions({
  highlight(code, lang){
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
});
export function renderMarkdown(md){ return marked.parse(md || ""); }
