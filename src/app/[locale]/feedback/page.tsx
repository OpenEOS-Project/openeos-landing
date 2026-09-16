import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FeedbackForm } from '@/components/sections/FeedbackForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('feedback');
  return { title: t('metaTitle'), description: t('sub') };
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('feedback');

  return (
    <>
      <Header />
      <main className="feedback">
        <div className="feedback__inner">
          <header className="section-head">
            <h1 className="section-title">
              {t('titleL1')} <span className="u-accent">{t('titleL2')}</span>
            </h1>
            <p className="section-sub">{t('sub')}</p>
          </header>

          <FeedbackForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
