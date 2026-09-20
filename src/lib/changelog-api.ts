export type ChangelogArt = 'neu' | 'verbessert' | 'behoben';

export interface ChangelogEintrag {
  datum: string;
  art: ChangelogArt;
  titel: { de: string; en: string };
  text: { de: string; en: string };
  /** Veroeffentlichung, in der dieser Eintrag erschienen ist. */
  version: string | null;
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

/**
 * Die zuletzt veroeffentlichte Version — fuer das Badge im Kopf der
 * Startseite.
 *
 * Anders als die Liste selbst darf dieser Wert zwischengespeichert
 * werden: er aendert sich nur bei einer Veroeffentlichung, und die
 * Startseite ist die meistbesuchte Seite. Fuenf Minuten Frist, wie beim
 * Abruf der Preise gleich daneben.
 *
 * Ohne Antwort bleibt der Rueckgabewert leer und das Badge faellt auf
 * seinen Text ohne Nummer zurueck — lieber keine Zahl als eine falsche.
 */
export async function holeAktuelleVersion(): Promise<string | null> {
  if (!API_URL) {
    console.error('NEXT_PUBLIC_API_URL fehlt — Badge bleibt ohne Version.');
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/api/public/changelog`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error(`Version nicht abrufbar: HTTP ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json?.data?.latestVersion ?? null;
  } catch (fehler) {
    console.error('Version nicht abrufbar:', (fehler as Error).message);
    return null;
  }
}
