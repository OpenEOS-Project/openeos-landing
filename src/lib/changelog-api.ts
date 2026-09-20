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
  if (!API_URL) return [];

  try {
    const res = await fetch(`${API_URL}/api/public/changelog`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];

    const json = await res.json();
    return json?.data?.entries ?? [];
  } catch {
    return [];
  }
}
