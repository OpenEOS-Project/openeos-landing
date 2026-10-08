import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

/**
 * Echte Bildschirmfotos statt gezeichneter Andeutungen.
 *
 * Aufnahmen aus der laufenden Oberfläche, nicht nachgebaut: Wer wissen
 * will, ob ihm das System gefällt, soll es sehen, wie es ist.
 */
/* Je Sprache ein eigener Satz unter /screens/<sprache>/, damit die
   englische Seite keine deutsche Kasse zeigt. Alle Aufnahmen 2400x1500
   (16:10, doppelte Auflösung) — so stehen die Rahmen im Raster gleich
   hoch und die Bildunterschriften auf einer Linie. Nachgestellt per
   Skript gegen Staging, ohne echte Bestellungen. */
const SCREENS = [
  { key: 'pos', file: 'pos-order', breit: true },
  { key: 'floor', file: 'pos-floor', breit: false },
  { key: 'editor', file: 'tables-editor', breit: false },
  { key: 'station', file: 'station', breit: false },
  { key: 'customer', file: 'customer', breit: false },
  { key: 'dashboard', file: 'dashboard', breit: false },
  { key: 'shifts', file: 'shifts', breit: false },
] as const;

export function Screens() {
  const t = useTranslations('screens');
  const sprache = useLocale() === 'en' ? 'en' : 'de';

  return (
    <section className="screens" id="screens">
      <header className="section-head">
        <h2 className="section-title">
          {t('titleL1')} <span className="u-accent">{t('titleL2')}</span>
        </h2>
        <p className="section-sub">{t('sub')}</p>
      </header>

      <div className="screens__grid">
        {SCREENS.map((screen) => (
          <figure
            key={screen.key}
            className={`screens__item${screen.breit ? ' screens__item--wide' : ''}`}
          >
            <div className="screens__frame">
              <Image
                src={`/screens/${sprache}/${screen.file}.webp`}
                alt={t(`items.${screen.key}.alt`)}
                width={2400}
                height={1500}
                className="screens__img"
                sizes={screen.breit ? '(max-width: 1280px) 100vw, 1168px' : '(max-width: 860px) 100vw, 570px'}
              />
            </div>
            <figcaption className="screens__caption">
              <b>{t(`items.${screen.key}.title`)}</b>
              <span>{t(`items.${screen.key}.text`)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
