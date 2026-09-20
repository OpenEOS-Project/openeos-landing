export type ChangelogArt = 'neu' | 'verbessert' | 'behoben';

export interface ChangelogEintrag {
  datum: string;
  art: ChangelogArt;
  titel: { de: string; en: string };
  text: { de: string; en: string };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Die Änderungsliste von der API.
 *
 * Sie lag zuvor als eigene Datei hier und ein zweites Mal in der
 * angemeldeten Oberfläche. Eine Quelle genügt; gepflegt wird sie in der
 * API, wo auch das Anmelde-Fenster sie herholt.
 *
 * Fällt die Abfrage aus, bleibt die Seite leer statt zu scheitern — ein
 * fehlender Änderungsverlauf ist kein Grund, die Website auszusperren.
 */
export async function holeChangelog(): Promise<ChangelogEintrag[]> {
  if (!API_URL) {
    console.error('NEXT_PUBLIC_API_URL fehlt — Changelog bleibt leer.');
    return [];
  }

  try {
    const res = await fetch(`${API_URL}/api/public/changelog`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      // Laut scheitern lassen, sonst steht die Seite still leer da und
      // niemand erfaehrt, dass der Abruf nicht geklappt hat.
      console.error(`Changelog nicht abrufbar: HTTP ${res.status}`);
      return [];
    }

    const json = await res.json();
    return json?.data?.entries ?? [];
  } catch (fehler) {
    console.error('Changelog nicht abrufbar:', (fehler as Error).message);
    return [];
  }
}
