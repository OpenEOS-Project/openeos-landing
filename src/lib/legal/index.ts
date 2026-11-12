import { currentVersion, extractStand, extractTitle, listVersions, readSource, type LegalDoc } from "./core.mjs";

export {
  LEGAL_DOCS,
  availableLegalDocs,
  currentVersion,
  hasLegalDoc,
  isLegalDoc,
  listVersions,
  type LegalDoc,
} from "./core.mjs";

/** Oeffentliche Adresse eines Rechtstexts (deutsche Route, ohne Sprache). */
export function legalPath(doc: LegalDoc, version?: string) {
  return version ? `/${doc}/${version}` : `/${doc}`;
}

/** PDF einer Fassung — beim Bauen von scripts/build-legal.mjs erzeugt. */
export function legalPdfPath(doc: LegalDoc, version?: string) {
  return version ? `/rechtstexte/${doc}-${version}.pdf` : `/rechtstexte/${doc}.pdf`;
}

export type LegalDocument = {
  doc: LegalDoc;
  version: string;
  current: string;
  isCurrent: boolean;
  versions: string[];
  title: string;
  stand: string;
  source: string;
};

export function getLegalDocument(doc: LegalDoc, version?: string): LegalDocument | null {
  const versions = listVersions(doc);
  /* Optionales Dokument ohne Fassung (Anlage 1): keine Seite. */
  if (!versions.length) return null;
  const current = currentVersion(doc);
  const v = version ?? current;
  if (!versions.includes(v)) return null;
  const source = readSource(doc, v);
  return {
    doc,
    version: v,
    current,
    isCurrent: v === current,
    versions,
    title: extractTitle(source),
    stand: extractStand(source),
    source,
  };
}

/** „2026-11-04“ → „4. November 2026“ bzw. „November 4, 2026“. */
export function formatVersion(version: string, locale: string) {
  const [y, m, d] = version.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
