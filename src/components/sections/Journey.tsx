import Image from 'next/image';
import { useTranslations } from 'next-intl';

/**
 * Der Weg einer Bestellung durchs Festzelt, in fünf Bildern.
 *
 * Dieselben Zeichnungen, die im Admin-Login stehen. Sie erzählen genau
 * das, was die Website sonst nur behauptet — und ersparen die Frage, was
 * dieses System eigentlich den ganzen Abend tut.
 */
const PANELS = ['checkout', 'receipt', 'runner', 'kitchen', 'tent'] as const;

export function Journey() {
  const t = useTranslations('journey');

  return (
    <section className="journey" id="journey">
      <header className="section-head">
        <h2 className="section-title">
          {t('titleL1')} <span className="u-accent">{t('titleL2')}</span>
        </h2>
        <p className="section-sub">{t('sub')}</p>
      </header>

      <ol className="journey__strip">
        {PANELS.map((key, index) => (
          <li key={key} className="journey__panel">
            <div className="journey__frame">
              <Image
                src={`/comic/panel-${index + 1}.webp`}
                alt={t(`panels.${key}.alt`)}
                width={760}
                height={1013}
                className="journey__img"
                sizes="(max-width: 700px) 80vw, (max-width: 1100px) 40vw, 20vw"
              />
            </div>
            <div className="journey__copy">
              <span className="journey__step">{t(`panels.${key}.step`)}</span>
              <p>{t(`panels.${key}.copy`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
