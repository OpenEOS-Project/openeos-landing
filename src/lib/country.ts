/*
 * Laendername im Impressum in der Sprache der Seite.
 *
 * IMPRINT_COUNTRY steht auf den Servern als "Deutschland" — die englische
 * Seite zeigte deshalb "Deutschland". Erkannte Namen und ISO-Codes werden
 * ueber Intl.DisplayNames uebersetzt; alles andere bleibt, wie es gesetzt
 * ist.
 */
const KNOWN_COUNTRIES: Record<string, string> = {
  de: "DE",
  deutschland: "DE",
  germany: "DE",
  at: "AT",
  österreich: "AT",
  oesterreich: "AT",
  austria: "AT",
  ch: "CH",
  schweiz: "CH",
  switzerland: "CH",
};

export function localizeCountry(value: string, locale: string): string {
  const code = KNOWN_COUNTRIES[value.trim().toLowerCase()];
  if (!code) return value;
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? value;
  } catch {
    return value;
  }
}
