/*
 * Ratgeber — Artikel aus content/ratgeber/de/<slug>.md.
 *
 * Jede Datei beginnt mit einem Kopf (Frontmatter) zwischen zwei Zeilen
 * „---“; je Zeile ein Feld, Texte in doppelten Anfuehrungszeichen, Tags
 * als Liste:
 *
 *   ---
 *   title: "Titel"
 *   description: "Ein, zwei Saetze fuer Uebersicht, Suchmaschinen und RSS."
 *   date: "2026-11-19"
 *   author: "Vorname Nachname"
 *   tags: ["Steuern", "Kasse"]
 *   ---
 *
 * Der Dateiname ist die Adresse (/ratgeber/<slug>), das Datum steht nur im
 * Kopf. Fehlt ein Feld oder ist es falsch geschrieben, bricht der Bau ab —
 * lieber dort als mit einer halben Seite online.
 *
 * Reines JavaScript ohne Next, damit `pnpm test` es direkt laden kann.
 */
import fs from "node:fs";
import path from "node:path";

export const RATGEBER_CONTENT_DIR = path.join(process.cwd(), "content", "ratgeber", "de");

/** Adresse eines Artikels: Kleinbuchstaben, Ziffern, einzelne Bindestriche. */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Woerter pro Minute fuer die Lesezeit (Sachtext, Deutsch). */
export const WORDS_PER_MINUTE = 200;

function parseValue(raw, key, file) {
  const value = raw.trim();
  if (value.startsWith('"') || value.startsWith("[")) {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`[ratgeber] ${file}: Feld „${key}“ ist kein gueltiger Text bzw. keine Liste: ${value}`);
    }
  }
  return value;
}

/**
 * Kopf und Text einer Datei trennen. Nur das hier beschriebene Format —
 * kein vollstaendiges YAML (keine mehrzeiligen Werte), dafuer ohne
 * zusaetzliche Abhaengigkeit.
 */
export function parseFrontmatter(raw, file = "Artikel") {
  const source = raw.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(source);
  if (!m) throw new Error(`[ratgeber] ${file}: Kopf („---“ … „---“) fehlt am Dateianfang.`);
  const data = {};
  for (const line of m[1].split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const kv = /^([A-Za-z][\w-]*):(.*)$/.exec(line);
    if (!kv) throw new Error(`[ratgeber] ${file}: Kopfzeile nicht lesbar: ${line}`);
    data[kv[1]] = parseValue(kv[2], kv[1], file);
  }
  return { data, body: source.slice(m[0].length) };
}

function requireText(data, key, file) {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`[ratgeber] ${file}: Feld „${key}“ fehlt oder ist leer.`);
  }
  return value.trim();
}

/** Text ohne Markdown-Auszeichnung, fuer die Wortzahl. */
export function markdownWords(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`|~-]+/g, " ")
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

/** Lesezeit in ganzen Minuten (mindestens 1). */
export function readingMinutes(md) {
  return Math.max(1, Math.ceil(markdownWords(md) / WORDS_PER_MINUTE));
}

/** Kopf pruefen und in ein Artikel-Objekt uebersetzen. */
export function parseArticle(slug, raw) {
  const file = `content/ratgeber/de/${slug}.md`;
  if (!SLUG_RE.test(slug)) {
    throw new Error(`[ratgeber] ${file}: Dateiname nur aus Kleinbuchstaben, Ziffern und Bindestrichen.`);
  }
  const { data, body } = parseFrontmatter(raw, file);
  const date = requireText(data, "date", file);
  if (!DATE_RE.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw new Error(`[ratgeber] ${file}: „date“ muss JJJJ-MM-TT sein, ist aber „${date}“.`);
  }
  const tags = data.tags ?? [];
  if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string" || !t.trim())) {
    throw new Error(`[ratgeber] ${file}: „tags“ muss eine Liste von Texten sein.`);
  }
  return {
    slug,
    title: requireText(data, "title", file),
    description: requireText(data, "description", file),
    date,
    author: requireText(data, "author", file),
    tags: tags.map((t) => t.trim()),
    readingMinutes: readingMinutes(body),
    body,
  };
}

/** Alle Artikel, neueste zuerst (bei gleichem Datum nach Adresse). */
/* Immer RATGEBER_CONTENT_DIR, nie ein uebergebenes Verzeichnis: Ein
   variabler Pfad liesse Next beim Bauen das ganze Projekt ins
   Standalone-Paket packen. Die Tests wechseln vor dem Import das
   Arbeitsverzeichnis (core.test.mjs). */

/** Alle Artikel, neueste zuerst (bei gleichem Datum nach Adresse). */
export function listArticles() {
  if (!fs.existsSync(RATGEBER_CONTENT_DIR)) return [];
  return fs
    .readdirSync(RATGEBER_CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseArticle(f.slice(0, -3), fs.readFileSync(path.join(RATGEBER_CONTENT_DIR, f), "utf8")))
    .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1));
}

/** Ein Artikel oder null (unbekannte oder ungueltige Adresse). */
export function getArticle(slug) {
  if (!SLUG_RE.test(slug)) return null;
  const file = path.join(RATGEBER_CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return parseArticle(slug, fs.readFileSync(file, "utf8"));
}
