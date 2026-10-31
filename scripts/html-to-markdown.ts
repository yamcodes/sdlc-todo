/**
 * Convert an HTML article to Markdown.
 *
 *   ./scripts/html-to-markdown article.html
 *   ./scripts/html-to-markdown https://example.com/post -o post.md
 *   cat article.html | ./scripts/html-to-markdown
 *
 * A full page is extracted with Mozilla Readability, then converted with
 * Turndown (GitHub Flavored Markdown). A fragment is converted as-is.
 */
import { readFile, writeFile } from "node:fs/promises"
import { parseArgs } from "node:util"
import { Readability, isProbablyReaderable } from "@mozilla/readability"
import { JSDOM } from "jsdom"
import TurndownService from "turndown"
import { gfm } from "turndown-plugin-gfm"

type ArticleMeta = {
  title: string
  author: string
  description: string
  site: string
  published: string
  lang: string
}

type ConvertOptions = {
  base?: string
  raw: boolean
  frontMatter: boolean
}

const USAGE = `Convert an HTML article to Markdown.

Usage:
  html-to-markdown <file.html | url> [-o out.md]
  cat article.html | html-to-markdown

Options:
  -o, --output <file>    Write Markdown to a file (default: stdout)
  -b, --base <url>       Resolve relative links and images against this URL
      --raw              Convert the HTML as-is, without extracting the article
      --no-front-matter  Omit the title and metadata block
  -h, --help             Show this help
`

const NOISE = "script, style, noscript, template, canvas, button"

async function main(): Promise<void> {
  const argv = process.argv.slice(2)
  let frontMatter = true
  const args: string[] = []
  for (const arg of argv) {
    if (arg === "--front-matter") frontMatter = true
    else if (arg === "--no-front-matter") frontMatter = false
    else args.push(arg)
  }

  const { values, positionals } = parseArgs({
    args,
    options: {
      output: { type: "string", short: "o" },
      base: { type: "string", short: "b" },
      raw: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
    allowPositionals: true,
    strict: true,
  })

  if (values.help) {
    console.log(USAGE)
    return
  }

  if (positionals.length > 1) {
    console.error("Pass one HTML file or URL, or pipe HTML on stdin.")
    process.exitCode = 1
    return
  }

  const source = positionals[0]
  if (!source && process.stdin.isTTY) {
    console.log(USAGE)
    process.exitCode = 1
    return
  }

  try {
    const input = await readInput(source)
    const html = input.html
    if (!html.trim()) {
      console.error("No HTML to convert.")
      process.exitCode = 1
      return
    }

    const markdown = convert(html, {
      base: resolveBase(values.base, input.pageUrl, html),
      raw: values.raw,
      frontMatter,
    })

    const body = markdown.replace(/^---\n[\s\S]*?\n---\n*/, "").trim()
    if (!body) {
      console.error("No article content found.")
      process.exitCode = 2
      return
    }

    if (values.output) await writeFile(values.output, markdown)
    else process.stdout.write(markdown)
  } catch (error) {
    console.error(errorMessage(error, source))
    process.exitCode = 1
  }
}

function convert(html: string, options: ConvertOptions): string {
  const chosen = chooseContent(html, options.base, options.raw)
  const document = prepareContent(chosen.html, options.base)
  const markdown = restoreTasks(tidy(createService().turndown(document.body.innerHTML)))
  if (!chosen.article) return markdown
  return finishArticle(markdown, chosen.meta, options.frontMatter)
}

function chooseContent(
  html: string,
  base: string | undefined,
  raw: boolean,
): { html: string; meta: ArticleMeta; article: boolean } {
  const document = parseHtml(html, base)
  prepareSource(document)
  const meta = scrapeMeta(document)

  if (raw || !looksLikeDocument(html)) {
    return { html: document.body.innerHTML, meta, article: false }
  }

  const markedLength = visibleLength(document.querySelector("article"))
  const extracted = extractArticle(document)
  const extractedLength = visibleTextLength(extracted?.textContent)
  const keepExtracted =
    Boolean(extracted?.content) &&
    (markedLength === 0 || extractedLength >= markedLength * 0.6)

  if (keepExtracted && extracted?.content) {
    return {
      html: extracted.content,
      meta: {
        title: cleanTitle(prefer(extracted.title, meta.title), prefer(extracted.siteName, meta.site)),
        author: prefer(extracted.byline, meta.author),
        description: meta.description,
        site: prefer(extracted.siteName, meta.site),
        published: prefer(extracted.publishedTime, meta.published),
        lang: prefer(extracted.lang, meta.lang),
      },
      article: true,
    }
  }

  const fresh = parseHtml(html, base)
  prepareSource(fresh)
  stripBoilerplate(fresh)
  const root =
    fresh.querySelector("article") ??
    fresh.querySelector("main") ??
    fresh.querySelector('[role="main"]') ??
    fresh.body

  return {
    html: root?.innerHTML ?? "",
    meta: { ...meta, title: cleanTitle(meta.title, meta.site) },
    article: true,
  }
}

function extractArticle(document: Document): ReturnType<Readability["parse"]> {
  if (!isProbablyReaderable(document)) return null
  return new Readability(document, { charThreshold: 80, keepClasses: true }).parse()
}

function prepareSource(document: Document): void {
  dropTrackingPixels(document)
  hydrateLazyImages(document)
  stampTaskLists(document)
  stampLinks(document)
  stampCodeLanguages(document)
}

function prepareContent(html: string, base: string | undefined): Document {
  const document = parseHtml(`<!DOCTYPE html><html><body>${html}</body></html>`, base)
  for (const el of [...document.querySelectorAll(NOISE)]) el.remove()
  hydrateLazyImages(document)
  cleanAnchors(document)
  restoreLinks(document, base)
  normalizeCodeBlocks(document)
  normalizeTables(document)
  return document
}

function parseHtml(html: string, base: string | undefined): Document {
  const dom = new JSDOM(html, base ? { url: base } : undefined)
  return dom.window.document
}

function looksLikeDocument(html: string): boolean {
  return /<!doctype html|<html[\s>]|<head[\s>]|<body[\s>]/i.test(html)
}

function stripBoilerplate(document: Document): void {
  const chrome = [
    "nav",
    "footer",
    "aside",
    '[role="navigation"]',
    '[role="banner"]',
    '[role="contentinfo"]',
    '[role="complementary"]',
  ].join(",")

  for (const el of [...document.querySelectorAll(`${NOISE}, ${chrome}`)]) {
    const tag = el.tagName
    const alwaysDrop = tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "TEMPLATE"
    if (!alwaysDrop && el.closest("article, main")) continue
    el.remove()
  }

  for (const header of [...document.querySelectorAll("header")]) {
    if (!header.closest("article, main")) header.remove()
  }
}

function dropTrackingPixels(document: Document): void {
  for (const img of [...document.querySelectorAll("img")]) {
    const width = Number(img.getAttribute("width"))
    const height = Number(img.getAttribute("height"))
    const src = img.getAttribute("src") ?? ""
    const tiny = (width > 0 && width <= 1) || (height > 0 && height <= 1)
    const tracker = /pixel|track|spacer|beacon|analytics/i.test(src)
    if (tiny || (tracker && !(img.getAttribute("alt") ?? "").trim())) img.remove()
  }
}

function hydrateLazyImages(document: Document): void {
  for (const img of document.querySelectorAll("img")) {
    const src = bestImageSrc(img)
    if (src) img.setAttribute("src", src)
  }
}

function bestImageSrc(img: Element): string {
  const src = img.getAttribute("src") ?? ""
  const lazy =
    img.getAttribute("data-src") ||
    img.getAttribute("data-original") ||
    img.getAttribute("data-lazy-src") ||
    ""
  const srcset = img.getAttribute("srcset") || img.getAttribute("data-srcset") || ""
  const fromSet = srcset.split(",")[0]?.trim().split(/\s+/)[0] ?? ""
  const placeholder = !src || src.startsWith("data:")
  if (placeholder && lazy) return lazy
  if (placeholder && fromSet) return fromSet
  return src || lazy || fromSet
}

function stampLinks(document: Document): void {
  for (const el of document.querySelectorAll("[href], [src]")) {
    const href = el.getAttribute("href")
    const src = el.getAttribute("src")
    if (href) el.setAttribute("data-original-href", href)
    if (src) el.setAttribute("data-original-src", src)
  }
}

function restoreLinks(document: Document, base: string | undefined): void {
  const pairs = [
    ["href", "data-original-href"],
    ["src", "data-original-src"],
  ] as const

  for (const el of [...document.querySelectorAll("[href], [src], [data-original-href], [data-original-src]")]) {
    for (const [attr, stamp] of pairs) {
      const original = el.getAttribute(stamp) || el.getAttribute(attr)
      if (!original) continue
      el.removeAttribute(stamp)
      if (original.startsWith("javascript:")) {
        el.removeAttribute(attr)
        continue
      }
      if (
        base &&
        !original.startsWith("#") &&
        !original.startsWith("mailto:") &&
        !original.startsWith("tel:")
      ) {
        try {
          el.setAttribute(attr, new URL(original, base).href)
        } catch {
          el.setAttribute(attr, original)
        }
      } else {
        el.setAttribute(attr, original)
      }
    }
  }
}

function cleanAnchors(document: Document): void {
  for (const anchor of [...document.querySelectorAll("a")]) {
    const href = anchor.getAttribute("href") ?? ""
    if (href.startsWith("javascript:")) anchor.removeAttribute("href")
    const text = anchor.textContent?.trim() ?? ""
    if (!text && !anchor.querySelector("img, picture, video")) {
      anchor.replaceWith(...[...anchor.childNodes])
    }
  }
}

function stampTaskLists(document: Document): void {
  for (const input of [...document.querySelectorAll('input[type="checkbox"]')]) {
    const token = (input as HTMLInputElement).checked ? "⟦task:x⟧" : "⟦task:o⟧"
    const next = input.nextSibling
    input.replaceWith(document.createTextNode(`${token} `))
    if (next?.nodeType === 3) next.textContent = (next.textContent ?? "").replace(/^ +/, "")
  }
}

function stampCodeLanguages(document: Document): void {
  for (const pre of document.querySelectorAll("pre")) {
    const code = pre.querySelector("code")
    const language = languageOf(pre) || (code ? languageOf(code) : "") || languageOf(pre.parentElement)
    if (!language) continue
    pre.setAttribute("data-language", language)
    code?.setAttribute("data-language", language)
  }
}

function languageOf(element: Element | null): string {
  if (!element) return ""
  const data = element.getAttribute("data-language") || element.getAttribute("data-lang") || ""
  if (data.trim()) return data.trim()
  const className = element.getAttribute("class") || ""
  const match =
    /(?:^|\s)(?:language|lang)-([A-Za-z0-9_+-]+)/.exec(className) ||
    /(?:^|\s)highlight-(?:text|source)-([A-Za-z0-9_+-]+)/i.exec(className) ||
    /(?:^|\s)brush:\s*([A-Za-z0-9_+-]+)/i.exec(className)
  return match?.[1] ?? ""
}

function normalizeCodeBlocks(document: Document): void {
  for (const pre of [...document.querySelectorAll("pre")]) {
    for (const button of pre.querySelectorAll("button")) button.remove()
    const code = pre.querySelector("code")
    const language = languageOf(pre) || (code ? languageOf(code) : "") || languageOf(pre.parentElement)
    const text = (pre.textContent ?? "").replace(/^\n/, "").replace(/\n$/, "")
    const codeEl = document.createElement("code")
    if (language) codeEl.className = `language-${language}`
    codeEl.textContent = text
    pre.replaceChildren(codeEl)
  }
}

function normalizeTables(document: Document): void {
  for (const table of [...document.querySelectorAll("table")]) {
    for (const el of [table, ...table.querySelectorAll("thead, tbody, tfoot, tr")]) {
      for (const child of [...el.childNodes]) {
        if (child.nodeType === 3 && !(child.textContent ?? "").trim()) child.remove()
      }
    }

    const caption = table.querySelector("caption")
    const captionText = caption?.textContent?.trim() ?? ""
    if (caption) {
      caption.remove()
      if (captionText) {
        const paragraph = document.createElement("p")
        const em = document.createElement("em")
        em.textContent = captionText
        paragraph.append(em)
        table.before(paragraph)
      }
    }

    const firstRow = table.querySelector("tr")
    if (!firstRow) continue
    const cells = [...firstRow.children]
    const header = cells.length > 0 && cells.every((cell) => cell.tagName === "TH")
    if (header) {
      if (firstRow.parentElement?.tagName !== "THEAD") {
        const thead = document.createElement("thead")
        thead.append(firstRow)
        table.prepend(thead)
      }
    } else if (!table.querySelector("thead")) {
      const thead = document.createElement("thead")
      const row = document.createElement("tr")
      for (let index = 0; index < cells.length; index += 1) {
        row.append(document.createElement("th"))
      }
      thead.append(row)
      table.prepend(thead)
    }

    for (const cell of table.querySelectorAll("th, td")) inlineCell(cell)
  }
}

function inlineCell(cell: Element): void {
  const doc = cell.ownerDocument
  if (!doc) return

  for (const list of [...cell.querySelectorAll("ul, ol")].reverse()) {
    const pieces: Node[] = []
    const items = [...list.children].filter((item) => item.tagName === "LI")
    items.forEach((item, index) => {
      if (index > 0) pieces.push(doc.createTextNode(", "))
      pieces.push(...item.childNodes)
    })
    list.replaceWith(...pieces)
  }

  for (const block of [...cell.querySelectorAll("p, div, blockquote, h1, h2, h3, h4, h5, h6")]) {
    block.replaceWith(...block.childNodes, doc.createTextNode(" "))
  }
  for (const br of cell.querySelectorAll("br")) br.replaceWith(" ")
  flattenCellText(cell)
}

function flattenCellText(cell: Element): void {
  const walker = documentWalker(cell)
  let node = walker.nextNode()
  while (node) {
    node.textContent = (node.textContent ?? "").replaceAll("|", "\\|").replace(/\s+/g, " ")
    node = walker.nextNode()
  }
}

function documentWalker(root: Node): TreeWalker {
  const owner = root.ownerDocument
  if (!owner) throw new Error("Table cell is not in a document.")
  return owner.createTreeWalker(root, 4)
}

function scrapeMeta(document: Document): ArticleMeta {
  const meta: ArticleMeta = {
    title:
      metaContent(document, 'meta[property="og:title"]') ||
      metaContent(document, 'meta[name="twitter:title"]') ||
      textOf(document, "article h1, main h1, h1") ||
      textOf(document, "title"),
    author:
      metaContent(document, 'meta[name="author"]') ||
      metaContent(document, 'meta[property="article:author"]') ||
      textOf(document, '[rel="author"], [itemprop="author"]'),
    description:
      metaContent(document, 'meta[name="description"]') ||
      metaContent(document, 'meta[property="og:description"]'),
    site: metaContent(document, 'meta[property="og:site_name"]'),
    published:
      metaContent(document, 'meta[property="article:published_time"]') ||
      document.querySelector("time[datetime]")?.getAttribute("datetime")?.trim() ||
      "",
    lang: document.documentElement.getAttribute("lang")?.trim() || "",
  }
  meta.title = cleanTitle(meta.title, meta.site)
  return meta
}

function metaContent(document: Document, selector: string): string {
  return document.querySelector(selector)?.getAttribute("content")?.trim() ?? ""
}

function textOf(document: Document, selector: string): string {
  return document.querySelector(selector)?.textContent?.replace(/\s+/g, " ").trim() ?? ""
}

function finishArticle(markdown: string, meta: ArticleMeta, frontMatter: boolean): string {
  let body = stripDuplicateTitle(markdown, meta.title)
  body = stripDuplicateByline(body, meta.author)
  if (frontMatter) {
    const block = renderFrontMatter(meta)
    return block ? `${block}\n${body}` : body
  }
  if (!meta.title || startsWithTitle(body, meta.title)) return body
  const byline = meta.author ? `*${escapeItalic(meta.author)}*\n\n` : ""
  return `# ${meta.title}\n\n${byline}${body}`
}

function renderFrontMatter(meta: ArticleMeta): string {
  const fields: Array<[string, string]> = [
    ["title", meta.title],
    ["author", meta.author],
    ["site", meta.site],
    ["published", meta.published],
    ["lang", meta.lang],
    ["description", meta.description.length <= 500 ? meta.description : ""],
  ]
  const lines = fields.filter(([, value]) => value.trim()).map(([key, value]) => `${key}: ${yamlString(value)}`)
  if (lines.length === 0) return ""
  return `---\n${lines.join("\n")}\n---\n`
}

function stripDuplicateTitle(markdown: string, title: string): string {
  if (!title) return markdown
  const match = /^#\s+(.+)\n+/.exec(markdown)
  if (!match || normalizeText(match[1] ?? "") !== normalizeText(title)) return markdown
  const rest = markdown.slice(match[0].length).trim()
  return rest ? markdown.slice(match[0].length) : markdown
}

function stripDuplicateByline(markdown: string, author: string): string {
  if (!author) return markdown
  const match = /^(?:>\s*)?\*?([^\n]+)\*?\n+/.exec(markdown)
  if (!match?.[1]) return markdown
  const line = match[1].replace(/^\*+|\*+$/g, "").trim()
  const candidates = [author, `By ${author}`, `by ${author}`]
  if (!candidates.some((candidate) => normalizeText(line) === normalizeText(candidate))) return markdown
  const rest = markdown.slice(match[0].length).trim()
  return rest ? markdown.slice(match[0].length) : markdown
}

function startsWithTitle(markdown: string, title: string): boolean {
  const match = /^#\s+(.+)/.exec(markdown)
  return Boolean(match?.[1] && normalizeText(match[1]) === normalizeText(title))
}

function createService(): TurndownService {
  const service = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    fence: "```",
    emDelimiter: "*",
    strongDelimiter: "**",
    linkStyle: "inlined",
    preformattedCode: true,
  })

  service.use(gfm)
  service.remove((node) =>
    ["script", "style", "noscript", "svg", "canvas", "button"].includes(node.nodeName.toLowerCase()),
  )
  service.addRule("listItem", {
    filter: "li",
    replacement: (content, node) => listItem(content, node),
  })
  service.addRule("gfmStrikethrough", {
    filter: (node) => ["del", "s", "strike"].includes(node.nodeName.toLowerCase()),
    replacement: (content) => (content ? `~~${content}~~` : ""),
  })
  service.addRule("figure", {
    filter: "figure",
    replacement: (content, node) => figureMarkdown(content, node),
  })
  service.addRule("media", {
    filter: ["iframe", "video", "audio", "embed"],
    replacement: (_content, node) => mediaMarkdown(node),
  })

  return service
}

function listItem(content: string, node: HTMLElement): string {
  const parent = node.parentElement
  let prefix = "- "
  if (parent?.nodeName === "OL") {
    const startAttr = parent.getAttribute("start")
    const start = startAttr === null ? 1 : Number(startAttr)
    let index = 0
    for (let sibling = node.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
      if (sibling.nodeName === "LI") index += 1
    }
    prefix = `${start + index}. `
  }
  const block = /\n$/.test(content)
  let body = content.replace(/^\n+/, "").replace(/\n+$/, "")
  if (block) body += "\n"
  body = body.replaceAll("\n", `\n${" ".repeat(prefix.length)}`)
  return `${prefix}${body}${node.nextSibling ? "\n" : ""}`
}

function figureMarkdown(content: string, node: HTMLElement): string {
  const img = node.querySelector("img")
  const caption = node.querySelector("figcaption")?.textContent?.replace(/\s+/g, " ").trim() ?? ""
  const meaningful = node.querySelectorAll("p, pre, table, ul, ol, blockquote, h1, h2, h3, h4").length
  if (!img || meaningful > 0) return `\n\n${content.trim()}\n\n`
  const src = img.getAttribute("src") || ""
  if (!src) return caption ? `\n\n${caption}\n\n` : ""
  const alt = (img.getAttribute("alt") || "").replaceAll("[", "\\[").replaceAll("]", "\\]")
  const image = `![${alt}](${markdownDestination(src)})`
  return caption ? `\n\n${image}\n\n*${escapeItalic(caption)}*\n\n` : `\n\n${image}\n\n`
}

function mediaMarkdown(node: HTMLElement): string {
  const src = node.getAttribute("src") || node.querySelector("source")?.getAttribute("src") || ""
  if (!src) return ""
  const label = node.getAttribute("title") || node.getAttribute("aria-label") || hostLabel(src)
  return `\n\n[${label}](${markdownDestination(src)})\n\n`
}

function hostLabel(src: string): string {
  try {
    return new URL(src).hostname.replace(/^www\./, "")
  } catch {
    return src
  }
}

function markdownDestination(url: string): string {
  if (/[\s()]/.test(url)) return `<${url}>`
  return url
}

function restoreTasks(markdown: string): string {
  return markdown.replaceAll("⟦task:x⟧", "[x]").replaceAll("⟦task:o⟧", "[ ]")
}

function tidy(markdown: string): string {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n")
  const output: string[] = []
  let inFence = false
  let blankRun = 0

  for (const line of lines) {
    const fence = /^(```+|~~~+)/.test(line.trim())
    if (fence) inFence = !inFence
    if (!inFence && !fence && line.trim() === "") {
      blankRun += 1
      if (blankRun <= 1) output.push("")
      continue
    }
    blankRun = 0
    output.push(inFence ? line : line.replace(/[ \t]+$/, ""))
  }

  return `${output.join("\n").trim()}\n`
}

function cleanTitle(title: string, site: string): string {
  const trimmed = title.replace(/\s+/g, " ").trim()
  const siteName = site.trim()
  if (!trimmed || !siteName) return trimmed
  const pattern = new RegExp(`\\s*[|–—-]\\s*${escapeRegExp(siteName)}\\s*$`, "i")
  return trimmed.replace(pattern, "").trim() || trimmed
}

function prefer(primary: string | null | undefined, fallback: string): string {
  const value = primary?.replace(/\s+/g, " ").trim()
  return value || fallback
}

function visibleLength(element: Element | null): number {
  return visibleTextLength(element?.textContent)
}

function visibleTextLength(text: string | null | undefined): number {
  return text?.replace(/\s+/g, " ").trim().length ?? 0
}

function normalizeText(value: string): string {
  return value
    .replace(/\\([\\`*_{}[\]()#+\-.!|])/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
}

function yamlString(value: string): string {
  const escaped = value.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replace(/\s+/g, " ").trim()
  return `"${escaped}"`
}

function escapeItalic(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("*", "\\*")
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

type LoadedHtml = {
  html: string
  pageUrl?: string
}

async function readInput(source: string | undefined): Promise<LoadedHtml> {
  if (!source || source === "-") return { html: await readStdin() }
  if (/^https?:\/\//i.test(source)) return fetchHtml(source)
  return { html: await readFile(source, "utf8") }
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk))
  return Buffer.concat(chunks).toString("utf8")
}

async function fetchHtml(url: string): Promise<LoadedHtml> {
  let response: Response
  try {
    response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    })
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(`Could not fetch ${url} (${reason}).`)
  }
  if (!response.ok) throw new Error(`Could not fetch ${url} (${response.status}).`)
  const type = response.headers.get("content-type") ?? ""
  if (type && !/html|xml|text\/plain/i.test(type)) {
    throw new Error(`Expected HTML from ${url}, got ${type}.`)
  }
  return { html: await response.text(), pageUrl: response.url }
}

function resolveBase(explicit: string | undefined, pageUrl: string | undefined, html: string): string | undefined {
  if (explicit) return explicit
  const tag = /<base\s[^>]*href=["']([^"']+)["']/i.exec(html)?.[1]
  if (!tag) return pageUrl
  try {
    return new URL(tag, pageUrl).href
  } catch {
    return pageUrl
  }
}

function errorMessage(error: unknown, source: string | undefined): string {
  if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
    return `File not found: ${source}`
  }
  if (error instanceof Error) return error.message
  return String(error)
}

await main()
