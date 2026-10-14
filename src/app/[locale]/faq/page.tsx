import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  ChevronDown,
  CircleHelp,
  Code,
  Euro,
  Info,
  Lock,
  Receipt,
  TabletSmartphone,
  type LucideIcon,
} from 'lucide-react';

import { docsUrl, pageMetadata } from '@/lib/site';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactTrigger } from '@/components/ContactTrigger';
import { FaqHashOpener } from '@/components/sections/FaqHashOpener';

/*
 * Häufige Fragen.
 *
 * Abschnitte und Fragen stehen in messages/*.json unter faq.sections; die
 * Schlüssel sind zugleich die Sprungmarken (/faq#tse, /faq#bargeldlos) und
 * in beiden Sprachen gleich. Andere Teile von OpenEOS verlinken darauf —
 * ein Schlüssel wird deshalb nicht umbenannt.
 *
 * Eine Antwort ist eine Liste von Blöcken: Text ist ein Absatz, eine
 * Liste von Texten eine Aufzählung.
 */

type Block = string | string[];
type Item = { q: string; a: Block[] };
type Section = { title: string; items: Record<string, Item>; note?: string };

const ICONS: Record<string, LucideIcon> = {
  tse: Receipt,
  allgemein: CircleHelp,
  kosten: Euro,
  'open-source': Code,
  daten: Lock,
  geraete: TabletSmartphone,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });
  return pageMetadata({ locale, path: '/faq', title: t('metaTitle'), description: t('metaDescription') });
}

/** Text ohne Auszeichnung — für die strukturierten Daten. */
function plain(text: string) {
  return text.replace(/<\/?[a-zA-Z]+>/g, '');
}

function plainAnswer(blocks: Block[]) {
  return blocks.map((b) => (Array.isArray(b) ? b.map(plain).join('; ') : plain(b))).join(' ');
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('faq');
  const sections = t.raw('sections') as Record<string, Section>;

  const tags = {
    b: (chunks: ReactNode) => <strong>{chunks}</strong>,
    tse: (chunks: ReactNode) => <a href="#was-ist-eine-tse">{chunks}</a>,
    changelog: (chunks: ReactNode) => <Link href="/changelog">{chunks}</Link>,
    screens: (chunks: ReactNode) => <Link href="/screens">{chunks}</Link>,
    pricing: (chunks: ReactNode) => <Link href="/#pricing">{chunks}</Link>,
    privacy: (chunks: ReactNode) => <Link href="/privacy">{chunks}</Link>,
    selfhost: (chunks: ReactNode) => <a href={docsUrl(locale, 'selbst-betreiben/intro/')}>{chunks}</a>,
    github: (chunks: ReactNode) => (
      <a href="https://github.com/OpenEOS-Project" target="_blank" rel="noopener noreferrer">
        {chunks}
      </a>
    ),
    demo: (chunks: ReactNode) => (
      <ContactTrigger type="demo" className="faq__inline-btn">
        {chunks}
      </ContactTrigger>
    ),
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: Object.values(sections).flatMap((section) =>
      Object.values(section.items).map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: plainAnswer(item.a) },
      })),
    ),
  };

  return (
    <>
      <Header />
      <main className="faq">
        <script
          type="application/ld+json"
          // "<" maskiert, damit kein Text das Skript-Element beenden kann.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <FaqHashOpener />

        <div className="faq__inner page-wrap">
          <header className="section-head">
            <h1 className="section-title">
              {t('titleL1')} <span className="u-accent">{t('titleL2')}</span>
            </h1>
            <p className="section-sub">{t('sub')}</p>
          </header>

          <nav className="faq__topics" aria-label={t('topics')}>
            {Object.entries(sections).map(([key, section]) => {
              const Icon = ICONS[key] ?? CircleHelp;
              return (
                <a key={key} href={`#${key}`} className="faq__topic">
                  <Icon aria-hidden="true" />
                  {section.title}
                </a>
              );
            })}
          </nav>

          <div className="faq__list">
            {Object.entries(sections).map(([key, section]) => {
              const Icon = ICONS[key] ?? CircleHelp;
              return (
                <section
                  key={key}
                  id={key}
                  className="faq__group"
                  data-faq-section=""
                  aria-labelledby={`${key}-title`}
                >
                  <h2 id={`${key}-title`} className="faq__group-title">
                    <Icon aria-hidden="true" />
                    {section.title}
                  </h2>

                  <div className="faq__items">
                    {Object.entries(section.items).map(([id, item]) => (
                      <details key={id} id={id} className="faq__item">
                        <summary className="faq__q">
                          <span>{item.q}</span>
                          <ChevronDown aria-hidden="true" className="faq__chevron" />
                        </summary>
                        <div className="faq__a">
                          {item.a.map((block, i) => {
                            const path = `sections.${key}.items.${id}.a.${i}`;
                            return Array.isArray(block) ? (
                              <ul key={i}>
                                {block.map((_, j) => (
                                  <li key={j}>{t.rich(`${path}.${j}`, tags)}</li>
                                ))}
                              </ul>
                            ) : (
                              <p key={i}>{t.rich(path, tags)}</p>
                            );
                          })}
                        </div>
                      </details>
                    ))}

                    {section.note && (
                      <p className="faq__note">
                        <Info aria-hidden="true" />
                        <span>{section.note}</span>
                      </p>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          <p className="faq__foot">
            {t.rich('foot', {
              link: (chunks) => <Link href="/feedback">{chunks}</Link>,
            })}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
