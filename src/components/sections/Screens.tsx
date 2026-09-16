import Image from 'next/image';
import { useTranslations } from 'next-intl';

/**
 * Echte Bildschirmfotos statt gezeichneter Andeutungen.
 *
 * Aufnahmen aus der laufenden Oberfläche, nicht nachgebaut: Wer wissen
 * will, ob ihm das System gefällt, soll es sehen, wie es ist.
 */
const SCREENS = [
  { key: 'pos', src: '/screens/kasse.webp', breit: true },
  { key: 'display', src: '/screens/anzeige.webp', breit: false },
  { key: 'dashboard', src: '/screens/dashboard.webp', breit: false },
] as const;

export function Screens() {
  const t = useTranslations('screens');

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
                src={screen.src}
                alt={t(`items.${screen.key}.alt`)}
                width={1200}
                height={screen.breit ? 703 : 750}
                className="screens__img"
                sizes="(max-width: 900px) 100vw, 50vw"
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
