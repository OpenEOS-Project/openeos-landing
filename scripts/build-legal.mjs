#!/usr/bin/env node
/*
 * Rechtstexte vorbereiten — laeuft vor `next build` und `next dev`.
 *
 * 1. Platzhalter pruefen: „[…]“ oder „[Text]“, das kein Markdown-Link ist.
 *    Produktion (NEXT_PUBLIC_SITE_ENV=production oder LEGAL_STRICT=1):
 *    Liste ausgeben und mit Fehler abbrechen. Sonst (Staging, CI, lokal):
 *    nur warnen.
 * 2. PDFs erzeugen: public/rechtstexte/<doc>-<fassung>.pdf fuer jede
 *    Fassung und public/rechtstexte/<doc>.pdf fuer die aktuelle.
 *    pdfkit statt Headless-Browser, damit der Bau auch im Alpine-Image
 *    laeuft. Schrift: Geist (SIL OFL 1.1) aus dem npm-Paket „geist“.
 *
 * Aufruf: node scripts/build-legal.mjs [--check]   (--check: keine PDFs)
 */
import fs from "node:fs";
import path from "node:path";
import { Lexer } from "marked";
import PDFDocument from "pdfkit";

import {
  LEGAL_DOCS,
  currentVersion,
  extractStand,
  extractTitle,
  findPlaceholders,
  listVersions,
  readRaw,
  readSource,
  sourcePath,
} from "../src/lib/legal/core.mjs";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "rechtstexte");
const FONT_DIR = path.join(ROOT, "node_modules", "geist", "dist", "fonts", "geist-sans");
const SITE = "openeos.de";

const strict = process.env.NEXT_PUBLIC_SITE_ENV === "production" || process.env.LEGAL_STRICT === "1";
const checkOnly = process.argv.includes("--check");

/* ---------------------------------------------------------------- 1. */

function checkPlaceholders() {
  const hits = [];
  for (const doc of LEGAL_DOCS) {
    for (const version of listVersions(doc)) {
      const file = path.relative(ROOT, sourcePath(doc, version));
      for (const h of findPlaceholders(readRaw(doc, version))) hits.push(`${file}:${h.line}  ${h.text}`);
    }
  }
  if (!hits.length) {
    console.log("[legal] Keine Platzhalter in den Rechtstexten.");
    return;
  }
  const list = hits.map((h) => `  ${h}`).join("\n");
  if (strict) {
    console.error(
      `[legal] FEHLER: ${hits.length} Platzhalter in den Rechtstexten — der Produktions-Build bricht ab.\n${list}\n` +
        "[legal] Platzhalter ausfuellen (neue Fassung unter content/legal/de/) und erneut bauen.",
    );
    process.exit(1);
  }
  console.warn(
    `[legal] WARNUNG: ${hits.length} Platzhalter in den Rechtstexten (Produktions-Build wuerde abbrechen):\n${list}`,
  );
}

/* ---------------------------------------------------------------- 2. */

const FONTS = {
  regular: "Geist-Regular.ttf",
  semibold: "Geist-SemiBold.ttf",
  bold: "Geist-Bold.ttf",
  italic: "Geist-Italic.ttf",
  semibolditalic: "Geist-SemiBoldItalic.ttf",
};

const PAGE = { size: "A4", margins: { top: 78, bottom: 70, left: 62, right: 62 } };
const COLOR = { text: "#111111", mute: "#5f6368", line: "#c9c9c9", head: "#efefef" };
const SIZE = { body: 9.8, small: 8, table: 7.6, h: { 1: 15, 2: 12.5, 3: 10.8, 4: 10 } };

function fontFor({ bold, italic }) {
  if (bold && italic) return "semibolditalic";
  if (bold) return "semibold";
  if (italic) return "italic";
  return "regular";
}

/** Inline-Tokens von marked → Textstuecke mit Schrift und Link. */
function segments(tokens, style = { bold: false, italic: false }, link = null, out = []) {
  for (const t of tokens ?? []) {
    switch (t.type) {
      case "strong":
        segments(t.tokens, { ...style, bold: true }, link, out);
        break;
      case "em":
        segments(t.tokens, { ...style, italic: true }, link, out);
        break;
      case "link":
        segments(t.tokens, style, t.href, out);
        break;
      case "br":
        out.push({ text: "\n", font: fontFor(style), link });
        break;
      case "codespan":
        out.push({ text: decode(t.text), font: fontFor(style), link });
        break;
      case "text":
      case "escape":
        if (t.tokens?.length) segments(t.tokens, style, link, out);
        else out.push({ text: decode(t.text), font: fontFor(style), link });
        break;
      default:
        out.push({ text: decode(t.raw ?? ""), font: fontFor(style), link });
    }
  }
  return out;
}

function decode(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function plain(tokens) {
  return segments(tokens).map((s) => s.text).join("");
}

class LegalPdf {
  constructor({ title, stand, url }) {
    this.title = title;
    this.stand = stand;
    this.url = url;
    this.doc = new PDFDocument({
      ...PAGE,
      bufferPages: true,
      autoFirstPage: true,
      lang: "de-DE",
      displayTitle: true,
      info: { Title: title, Author: "LUXCODE by Lukas Lukic-Spitznagel", Subject: `Stand: ${stand}`, Creator: SITE },
    });
    for (const [name, file] of Object.entries(FONTS)) this.doc.registerFont(name, path.join(FONT_DIR, file));
    this.doc.font("regular").fontSize(SIZE.body).fillColor(COLOR.text);
    this.left = PAGE.margins.left;
    this.width = this.doc.page.width - PAGE.margins.left - PAGE.margins.right;
    this.firstHeading = true;
  }

  get bottom() {
    return this.doc.page.height - PAGE.margins.bottom;
  }

  ensure(height) {
    if (this.doc.y + height > this.bottom) this.doc.addPage();
  }

  gap(pt) {
    if (this.doc.y > PAGE.margins.top + 1) this.doc.y += pt;
  }

  /** Text aus mehreren Stuecken (fett/kursiv/Link) als ein Absatz. */
  rich(segs, { x = this.left, width = this.width, size = SIZE.body, color = COLOR.text, lineGap = 2.2 } = {}) {
    /* Zeilenumbrueche (Anschrift im Impressum) beenden die Kette:
       pdfkit setzt "\n" in fortgesetztem Text sonst als Leerraum. */
    const lines = [[]];
    for (const s of segs) {
      s.text.split("\n").forEach((piece, i) => {
        if (i > 0) lines.push([]);
        if (piece) lines[lines.length - 1].push({ ...s, text: piece });
      });
    }
    if (lines[0].length) lines[0][0] = { ...lines[0][0], text: lines[0][0].text.replace(/^\s+/, "") };
    this.doc.fontSize(size).fillColor(color);
    lines.forEach((parts) => {
      if (!parts.length) {
        this.doc.font("regular").fontSize(size);
        this.doc.y += this.doc.currentLineHeight(true) + lineGap;
        return;
      }
      parts.forEach((s, i) => {
        this.doc.font(s.font);
        const opts = { continued: i < parts.length - 1, width, lineGap, link: s.link ?? null, underline: false };
        if (i === 0) this.doc.text(s.text, x, this.doc.y, opts);
        else this.doc.text(s.text, opts);
      });
    });
    this.doc.x = this.left;
  }

  heightOf(segs, { width = this.width, size = SIZE.body, lineGap = 2.2 } = {}) {
    const text = segs.map((s) => s.text).join("");
    this.doc.font("semibold").fontSize(size);
    return this.doc.heightOfString(text, { width, lineGap });
  }

  heading(token) {
    const level = Math.min(token.depth, 4);
    const size = this.firstHeading ? 17 : SIZE.h[level];
    const segs = segments(token.tokens).map((s) => ({ ...s, font: "bold" }));
    const h = this.heightOf(segs, { size });
    /* Ueberschrift nie allein am Seitenende. */
    this.gap(this.firstHeading ? 0 : level === 1 ? 16 : level === 2 ? 12 : 8);
    this.ensure(h + 46);
    const title = plain(token.tokens);
    if (level <= 2 && !this.firstHeading) this.doc.outline.addItem(title);
    this.rich(segs, { size, lineGap: 1.5 });
    this.doc.y += level === 1 ? 6 : 4;
    this.firstHeading = false;
  }

  paragraph(token) {
    const indent = /^[ \t]+\S/.test(token.raw) ? 16 : 0;
    const segs = segments(token.tokens);
    this.ensure(Math.min(this.heightOf(segs, { width: this.width - indent }), 30));
    this.rich(segs, { x: this.left + indent, width: this.width - indent });
    this.doc.y += 6;
  }

  list(token) {
    token.items.forEach((item, i) => {
      const marker = token.ordered ? `${(token.start || 1) + i}.` : "•";
      const inner = item.tokens.flatMap((t) => (t.type === "text" || t.type === "paragraph" ? [t] : []));
      const segs = inner.flatMap((t) => segments(t.tokens ?? [{ type: "text", text: t.text }]));
      this.ensure(14);
      const y = this.doc.y;
      this.doc.font("regular").fontSize(SIZE.body).fillColor(COLOR.text);
      this.doc.text(marker, this.left + 4, y, { width: 14, lineBreak: false });
      this.doc.y = y;
      this.rich(segs, { x: this.left + 18, width: this.width - 18 });
      this.doc.y += 3;
    });
    this.doc.y += 4;
  }

  hr() {
    this.gap(4);
    this.ensure(12);
    const y = this.doc.y;
    this.doc.moveTo(this.left, y).lineTo(this.left + this.width, y).lineWidth(0.6).strokeColor(COLOR.line).stroke();
    this.doc.y = y + 10;
  }

  table(token) {
    const cols = token.header.length;
    const pad = 4;
    const header = token.header.map((c) => plain(c.tokens));
    const rows = token.rows.map((r) => r.map((c) => plain(c.tokens)));

    /* Spaltenbreiten nach Textmenge, kurze Spalten (Nr.) schmal. */
    const weight = header.map((h, i) => {
      const lens = [h, ...rows.map((r) => r[i] ?? "")].map((s) => s.length);
      const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
      return Math.max(Math.sqrt(avg), Math.sqrt(Math.max(...lens)) * 0.6, 2.2);
    });
    const total = weight.reduce((a, b) => a + b, 0);
    const widths = weight.map((w) => (w / total) * this.width);

    const measure = (cells, font) => {
      this.doc.font(font).fontSize(SIZE.table);
      return Math.max(...cells.map((c, i) => this.doc.heightOfString(c || " ", { width: widths[i] - pad * 2, lineGap: 1 }))) + pad * 2;
    };
    const drawRow = (cells, font, fill) => {
      const h = measure(cells, font);
      const y = this.doc.y;
      let x = this.left;
      if (fill) this.doc.rect(this.left, y, this.width, h).fill(fill);
      cells.forEach((c, i) => {
        this.doc.font(font).fontSize(SIZE.table).fillColor(COLOR.text);
        this.doc.text(c, x + pad, y + pad, { width: widths[i] - pad * 2, lineGap: 1 });
        x += widths[i];
      });
      /* Rahmen */
      this.doc.lineWidth(0.5).strokeColor(COLOR.line);
      this.doc.rect(this.left, y, this.width, h).stroke();
      x = this.left;
      for (let i = 0; i < cols - 1; i++) {
        x += widths[i];
        this.doc.moveTo(x, y).lineTo(x, y + h).stroke();
      }
      this.doc.x = this.left;
      this.doc.y = y + h;
    };

    const headH = measure(header, "semibold");
    this.ensure(headH + measure(rows[0] ?? header, "regular"));
    drawRow(header, "semibold", COLOR.head);
    for (const row of rows) {
      const h = measure(row, "regular");
      if (this.doc.y + h > this.bottom) {
        this.doc.addPage();
        drawRow(header, "semibold", COLOR.head);
      }
      drawRow(row, "regular", null);
    }
    this.doc.y += 10;
  }

  render(tokens) {
    for (const t of tokens) {
      if (t.type === "heading") this.heading(t);
      else if (t.type === "paragraph") this.paragraph(t);
      else if (t.type === "list") this.list(t);
      else if (t.type === "hr") this.hr();
      else if (t.type === "table") this.table(t);
      else if (t.type === "space") continue;
      else if (t.tokens) this.paragraph(t);
    }
  }

  /** Kopf (Titel, Stand) und Fuss (Adresse, Seitenzahl) auf jede Seite. */
  decorate() {
    const range = this.doc.bufferedPageRange();
    const total = range.count;
    for (let i = range.start; i < range.start + total; i++) {
      this.doc.switchToPage(i);
      const { margins } = this.doc.page;
      const saved = { top: margins.top, bottom: margins.bottom };
      margins.top = 0;
      margins.bottom = 0;
      const w = this.width;
      const topY = 36;
      this.doc.font("semibold").fontSize(SIZE.small).fillColor(COLOR.mute);
      const standText = `Stand: ${this.stand}`;
      const standW = this.doc.font("regular").widthOfString(standText);
      this.doc.font("semibold").text(this.title, this.left, topY, { width: w - standW - 16, lineBreak: false, ellipsis: true });
      this.doc.font("regular").text(standText, this.left + w - standW, topY, { width: standW + 1, lineBreak: false });
      this.doc.moveTo(this.left, topY + 14).lineTo(this.left + w, topY + 14).lineWidth(0.5).strokeColor(COLOR.line).stroke();

      const footY = this.doc.page.height - 44;
      this.doc.moveTo(this.left, footY - 8).lineTo(this.left + w, footY - 8).lineWidth(0.5).strokeColor(COLOR.line).stroke();
      this.doc.font("regular").fontSize(SIZE.small).fillColor(COLOR.mute);
      this.doc.text(this.url, this.left, footY, { width: w / 2, lineBreak: false, link: `https://${this.url}` });
      const pageText = `Seite ${i - range.start + 1} von ${total}`;
      const pw = this.doc.widthOfString(pageText);
      this.doc.text(pageText, this.left + w - pw, footY, { width: pw + 1, lineBreak: false });
      margins.top = saved.top;
      margins.bottom = saved.bottom;
    }
  }

  async save(file) {
    this.decorate();
    const done = new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(file);
      stream.on("finish", resolve);
      stream.on("error", reject);
      this.doc.pipe(stream);
    });
    this.doc.end();
    await done;
  }
}

async function buildPdf(doc, version) {
  const source = readSource(doc, version);
  const tokens = Lexer.lex(source, { gfm: true, breaks: true });
  const pdf = new LegalPdf({
    title: extractTitle(source),
    stand: extractStand(source),
    url: `${SITE}/${doc}/${version}`,
  });
  /* Erstellungsdatum = Fassung: gleiche Eingabe, gleiche Datei. */
  const [y, m, d] = version.split("-").map(Number);
  pdf.doc.info.CreationDate = new Date(Date.UTC(y, m - 1, d));
  pdf.doc.info.ModDate = pdf.doc.info.CreationDate;
  pdf.render(tokens);
  const file = path.join(OUT_DIR, `${doc}-${version}.pdf`);
  const pages = pdf.doc.bufferedPageRange().count;
  await pdf.save(file);
  return { file, pages };
}

async function buildPdfs() {
  for (const f of Object.values(FONTS)) {
    if (!fs.existsSync(path.join(FONT_DIR, f))) {
      console.error(`[legal] Schrift fehlt: ${path.join(FONT_DIR, f)} — devDependency „geist“ installiert?`);
      process.exit(1);
    }
  }
  /* Frisch erzeugen: keine Reste aus frueheren Laeufen. */
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const doc of LEGAL_DOCS) {
    for (const version of listVersions(doc)) {
      const { file, pages } = await buildPdf(doc, version);
      console.log(`[legal] ${path.relative(ROOT, file)} (${pages} S.)`);
    }
    const current = currentVersion(doc);
    fs.copyFileSync(path.join(OUT_DIR, `${doc}-${current}.pdf`), path.join(OUT_DIR, `${doc}.pdf`));
    console.log(`[legal] public/rechtstexte/${doc}.pdf = ${current}`);
  }
}

checkPlaceholders();
if (!checkOnly) await buildPdfs();
