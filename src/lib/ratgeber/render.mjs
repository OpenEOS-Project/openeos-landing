/*
 * Markdown eines Ratgeber-Artikels → HTML (serverseitig, beim Bauen).
 *
 * Bewusst enger als die Rechtstexte (lib/legal/render.ts):
 * - HTML im Markdown wird nicht uebernommen, sondern als Text angezeigt.
 * - Links nur auf http(s), mailto und eigene Pfade/Sprungmarken; andere
 *   (javascript: …) bleiben reiner Text. Externe Links oeffnen in einem
 *   neuen Tab (rel="noopener noreferrer").
 * - Ein Zitat, das mit einer fetten Zeile beginnt („**Kurz gesagt**“),
 *   wird zum Hinweiskasten mit dieser Zeile als Titel.
 * - Tabellen stehen in einem seitlich scrollbaren Rahmen.
 * - Der Titel kommt aus dem Kopf und ist die einzige h1 der Seite; eine
 *   „# Ueberschrift“ im Text wird deshalb zur h2. Die h2 bilden das
 *   Inhaltsverzeichnis.
 */
import { Marked, Renderer } from "marked";
import { plainText, slugify } from "../legal/core.mjs";

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

const SAFE_HREF = /^(https?:\/\/|mailto:|\/(?!\/)|#)/i;
const EXTERNAL_HREF = /^https?:\/\//i;

/**
 * @param {string} source Markdown ohne Kopf
 * @param {{ table: string; newTab: string }} labels
 *   table: Beschriftung einer scrollbaren Tabelle,
 *   newTab: Hinweis fuer Screenreader an externen Links.
 */
export function renderArticle(source, labels) {
  const used = new Set();
  const toc = [];
  const unique = (base) => {
    const root = base || "abschnitt";
    let id = root;
    for (let n = 2; used.has(id); n++) id = `${root}-${n}`;
    used.add(id);
    return id;
  };

  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    renderer: {
      heading(token) {
        const depth = Math.min(Math.max(token.depth, 2), 4);
        const text = plainText(token.text);
        const id = unique(slugify(text));
        if (depth === 2) toc.push({ id, text });
        return `<h${depth} id="${id}">${this.parser.parseInline(token.tokens)}</h${depth}>\n`;
      },
      html(token) {
        return escapeHtml(token.text);
      },
      link(token) {
        const inner = this.parser.parseInline(token.tokens);
        const href = token.href.trim();
        if (!SAFE_HREF.test(href)) return inner;
        const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
        if (!EXTERNAL_HREF.test(href)) return `<a href="${escapeHtml(href)}"${title}>${inner}</a>`;
        return (
          `<a href="${escapeHtml(href)}"${title} target="_blank" rel="noopener noreferrer">` +
          `${inner}<span class="sr-only"> (${escapeHtml(labels.newTab)})</span></a>`
        );
      },
      image(token) {
        const href = token.href.trim();
        if (!/^(https:\/\/|\/(?!\/))/i.test(href)) return escapeHtml(token.text);
        const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
        return `<img src="${escapeHtml(href)}" alt="${escapeHtml(token.text)}"${title} loading="lazy" decoding="async">`;
      },
      blockquote(token) {
        const [first, ...rest] = token.tokens;
        const isTitle =
          first?.type === "paragraph" && first.tokens?.length === 1 && first.tokens[0].type === "strong";
        if (!isTitle) return `<blockquote>\n${this.parser.parse(token.tokens)}</blockquote>\n`;
        const label = plainText(first.text);
        return (
          `<aside class="ratgeber-callout" aria-label="${escapeHtml(label)}">\n` +
          `<p class="ratgeber-callout__title">${this.parser.parseInline(first.tokens[0].tokens)}</p>\n` +
          `${this.parser.parse(rest)}</aside>\n`
        );
      },
      table(token) {
        const html = Renderer.prototype.table.call(this, token);
        return `<div class="ratgeber-table" role="region" tabindex="0" aria-label="${escapeHtml(labels.table)}">${html}</div>\n`;
      },
    },
  });

  const html = marked.parse(source, { async: false });
  return { html, toc };
}
