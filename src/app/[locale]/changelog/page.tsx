import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { holeChangelog, type ChangelogArt, type ChangelogEintrag } from '@/lib/changelog-api';

/* Bei jedem Aufruf frisch holen statt einmal beim Bauen.
   Statisch erzeugt fror die Seite den Stand des Build-Zeitpunkts ein —
   beim ersten Mal sogar einen leeren, weil der Endpunkt da noch nicht
   ausgerollt war. Neue Einträge sollen erscheinen, ohne die Website neu
   zu bauen; die Antwort ist klein und die Seite wird selten aufgerufen. */
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('changelog');
  return { title: t('metaTitle'), description: t('sub') };
}

const ART_KLASSE: Record<ChangelogArt, string> = {
  neu: 'changelog__tag changelog__tag--neu',
  verbessert: 'changelog__tag changelog__tag--verbessert',
  behoben: 'changelog__tag changelog__tag--behoben',
};

/** Gruppiert nach Datum, damit ein Tag einmal statt fünfmal dasteht. */
function nachDatum(eintraege: ChangelogEintrag[]) {
  const gruppen = new Map<string, ChangelogEintrag[]>();
  for (const eintrag of eintraege) {
    const vorhanden = gruppen.get(eintrag.datum) ?? [];
    vorhanden.push(eintrag);
    gruppen.set(eintrag.datum, vorhanden);
  }
  return [...gruppen.entries()];
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('changelog');
  const eintraege = await holeChangelog();

  const sprache = locale === 'en' ? 'en' : 'de';
  const datumFormat = new Intl.DateTimeFormat(sprache === 'en' ? 'en-GB' : 'de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Header />
      <main className="changelog">
        <div className="changelog__inner">
          <header className="section-head">
            <h1 className="section-title">
              {t('titleL1')} <span className="u-accent">{t('titleL2')}</span>
            </h1>
            <p className="section-sub">{t('sub')}</p>
          </header>

          <div className="changelog__list">
            {nachDatum(eintraege).map(([datum, eintraege]) => (
              <section key={datum} className="changelog__group">
                <h2 className="changelog__date">
                  <time dateTime={datum}>{datumFormat.format(new Date(datum))}</time>
                  {eintraege[0]?.version && (
                    <span className="changelog__version">
                      {t('version', { version: eintraege[0].version })}
                    </span>
                  )}
                </h2>

                <div className="changelog__entries">
                  {eintraege.map((eintrag) => (
                    <article key={eintrag.titel.de} className="changelog__entry">
                      <span className={ART_KLASSE[eintrag.art]}>{t(`kinds.${eintrag.art}`)}</span>
                      <h3 className="changelog__title">{eintrag.titel[sprache]}</h3>
                      <p className="changelog__text">{eintrag.text[sprache]}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="changelog__foot">{t('foot')}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
