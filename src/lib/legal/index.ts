import {
  extractStand,
  extractTitle,
  legalToday,
  listVersions,
  readSource,
  splitVersions,
  versionStatus,
  type LegalDoc,
  type LegalVersionStatus,
} from "./core.mjs";

export {
  LEGAL_DOCS,
  availableLegalDocs,
  currentVersion,
  hasLegalDoc,
  isLegalDoc,
  legalToday,
  listVersions,
  upcomingVersions,
  type LegalDoc,
  type LegalVersionStatus,
} from "./core.mjs";

/*
 * Welche Fassung aktuell ist, haengt vom Datum ab. Die Seiten werden
 * statisch gebaut und alle 5 Minuten neu erzeugt (`revalidate` in
 * src/app/[locale]/<doc>/…/page.tsx): So wird eine kuenftige Fassung an
 * ihrem Datum ohne neuen Deploy zur aktuellen.
 */

/** Oeffentliche Adresse eines Rechtstexts (deutsche Route, ohne Sprache). */
export function legalPath(doc: LegalDoc, version?: string) {
  return version ? `/${doc}/${version}` : `/${doc}`;
}

/**
 * PDF einer Fassung — beim Bauen von scripts/build-legal.mjs erzeugt.
 * Ohne Fassung: /rechtstexte/<doc>.pdf leitet zur Laufzeit auf das PDF
 * der aktuellen Fassung weiter (src/app/rechtstexte/[file]/route.ts).
 */
export function legalPdfPath(doc: LegalDoc, version?: string) {
  return version ? `/rechtstexte/${doc}-${version}.pdf` : `/rechtstexte/${doc}.pdf`;
}

export type LegalDocument = {
  doc: LegalDoc;
  version: string;
  /** Geltende Fassung; null, wenn das Dokument nur kuenftige Fassungen hat. */
  current: string | null;
  status: LegalVersionStatus;
  isCurrent: boolean;
  /** Alle Fassungen, neueste zuerst (auch kuenftige). */
  versions: string[];
  /** Kuenftige Fassungen, die naechste zuerst. */
  upcoming: string[];
  title: string;
  stand: string;
  source: string;
};

/**
 * Ein Rechtstext in einer Fassung. Ohne `version` die aktuelle — null,
 * wenn es keine gibt (unbekannte Fassung, oder nur kuenftige Fassungen).
 */
export function getLegalDocument(doc: LegalDoc, version?: string, now = new Date()): LegalDocument | null {
  const versions = listVersions(doc);
  /* Optionales Dokument ohne Fassung (Anlage 1): keine Seite. */
  if (!versions.length) return null;
  const today = legalToday(now);
  const { current, upcoming } = splitVersions(versions, today);
  const v = version ?? current;
  if (!v || !versions.includes(v)) return null;
  const source = readSource(doc, v);
  const status = versionStatus(v, current, today);
  return {
    doc,
    version: v,
    current,
    status,
    isCurrent: status === "current",
    versions,
    upcoming,
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
