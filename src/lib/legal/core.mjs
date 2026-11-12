/*
 * Rechtstexte — gemeinsamer Kern fuer die Seiten (Next) und den
 * PDF-Bau (scripts/build-legal.mjs).
 *
 * Die Texte liegen unveraendert unter content/legal/de/<doc>/<fassung>.md,
 * die Fassung ist das Datum des „Stand“ als JJJJ-MM-TT. Alte Fassungen
 * bleiben als Datei liegen (Archiv); die neueste je Dokument ist die
 * aktuelle. Am Wortlaut wird hier nichts geaendert — entfernt werden nur
 * interne Anmerkungen, falls eine Fassung welche enthaelt.
 */
import fs from "node:fs";
import path from "node:path";

/** Reihenfolge = Reihenfolge in Fusszeile und Sitemap. */
export const LEGAL_DOCS = ["impressum", "datenschutz", "agb", "avv", "leistungsbeschreibung"];

/**
 * Dokumente, die (noch) fehlen duerfen: ohne Fassung gibt es weder Seite
 * noch PDF, Link oder Sitemap-Eintrag, und der Bau laeuft trotzdem durch.
 * Anlage 1 (Leistungsbeschreibung und Preisliste) erscheint, sobald
 * content/legal/de/leistungsbeschreibung/<JJJJ-MM-TT>.md existiert.
 */
export const OPTIONAL_LEGAL_DOCS = ["leistungsbeschreibung"];

export const LEGAL_CONTENT_DIR = path.join(process.cwd(), "content", "legal", "de");

const VERSION_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isLegalDoc(doc) {
  return LEGAL_DOCS.includes(doc);
}

/** Alle Fassungen eines Dokuments, neueste zuerst. */
export function listVersions(doc) {
  const dir = path.join(LEGAL_CONTENT_DIR, doc);
  if (OPTIONAL_LEGAL_DOCS.includes(doc) && !fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.slice(0, -3))
    .filter((v) => VERSION_RE.test(v))
    .sort()
    .reverse();
}

/** Gibt es mindestens eine Fassung? (Pflichtdokumente: immer.) */
export function hasLegalDoc(doc) {
  return listVersions(doc).length > 0;
}

/** Dokumente mit mindestens einer Fassung, in der Reihenfolge von LEGAL_DOCS. */
export function availableLegalDocs() {
  return LEGAL_DOCS.filter(hasLegalDoc);
}

export function currentVersion(doc) {
  const [latest] = listVersions(doc);
  if (!latest) throw new Error(`Keine Fassung fuer Rechtstext "${doc}" in ${LEGAL_CONTENT_DIR}`);
  return latest;
}

export function sourcePath(doc, version) {
  return path.join(LEGAL_CONTENT_DIR, doc, `${version}.md`);
}

export function readRaw(doc, version) {
  return fs.readFileSync(sourcePath(doc, version), "utf8");
}

/**
 * Entfernt Anmerkungen fuer die Pruefung, die nicht veroeffentlicht werden:
 * Zeilen, die mit „*Anmerkung:*“ beginnen, und einen Abschnitt
 * „Anhang – Prüfhinweise“ bis zur naechsten gleich hohen Ueberschrift.
 */
export function cleanSource(raw) {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let skipLevel = 0;
  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (skipLevel) {
      if (heading && heading[1].length <= skipLevel) skipLevel = 0;
      else continue;
    }
    if (heading && /^Anhang\s*[–—-]\s*Prüfhinweise/i.test(heading[2].trim())) {
      skipLevel = heading[1].length;
      continue;
    }
    if (/^\s*\*Anmerkung:\*/.test(line)) continue;
    out.push(line);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

export function readSource(doc, version) {
  return cleanSource(readRaw(doc, version));
}

/** Text ohne Markdown-Auszeichnung (fuer Titel, Sprungmarken, PDF). */
export function plainText(md) {
  return md
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

/** Erste Ueberschrift erster Ordnung = Titel des Dokuments. */
export function extractTitle(source) {
  const m = /^#\s+(.+)$/m.exec(source);
  return m ? plainText(m[1]) : "";
}

/** „Stand: 4. November 2026“ → „4. November 2026“. */
export function extractStand(source) {
  const m = /Stand:\s*([^*\n]+)/.exec(source);
  return m ? m[1].trim() : "";
}

/**
 * Stabile Sprungmarke aus einer Ueberschrift:
 * „1. Geltungsbereich und Anbieter“ → „1-geltungsbereich-und-anbieter“,
 * „Anhang B – Unterauftragsverarbeiter“ → „anhang-b-unterauftragsverarbeiter“.
 * Umlaute werden umschrieben (ä → ae, ß → ss).
 */
export function slugify(text) {
  return plainText(text)
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Zusaetzliche kurze Sprungmarken einer Ueberschrift. */
export function headingAliases(text) {
  const t = plainText(text);
  const aliases = [];
  let m;
  if ((m = /^Anhang\s+([A-Z])\b/.exec(t))) aliases.push(`anhang-${m[1].toLowerCase()}`);
  if ((m = /^Teil\s+([A-Z])\b/.exec(t))) aliases.push(`teil-${m[1].toLowerCase()}`);
  if ((m = /^(\d+)\.\s/.exec(t))) aliases.push(`ziffer-${m[1]}`);
  return aliases;
}

/**
 * Nummer einer Ziffer, wenn der Absatz mit einer fetten Nummer beginnt
 * („**4.6** …“, „**6.8 Mitwirkung.** …“) — sonst null.
 */
export function clauseNumber(raw) {
  const m = /^\s*\*\*(\d+(?:\.\d+)+)(?=[\s.*])/.exec(raw);
  return m ? m[1] : null;
}

export function clauseId(number) {
  return `ziffer-${number.replace(/\./g, "-")}`;
}

/**
 * Platzhalter im Text: „[…]“ oder „[Text]“, das kein Markdown-Link ist.
 * Liefert [{ line, text }].
 */
export function findPlaceholders(source) {
  const hits = [];
  source.split("\n").forEach((line, i) => {
    const re = /\[([^\]\n]*)\](?![(:[])/g;
    let m;
    while ((m = re.exec(line))) hits.push({ line: i + 1, text: m[0] });
  });
  return hits;
}
