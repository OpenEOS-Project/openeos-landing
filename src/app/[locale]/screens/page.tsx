import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { pageMetadata } from '@/lib/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Journey } from '@/components/sections/Journey';
import { Screens } from '@/components/sections/Screens';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'screens' });
  return pageMetadata({ locale, path: '/screens', title: t('metaTitle'), description: t('sub') });
}

/**
 * Eigene Seite für die Bilder.
 *
 * Auf der Startseite nahmen Bildstrecke und Bildschirmfotos zusammen mehr
 * Platz ein als alles andere. Wer wissen will, wie es aussieht, sucht das
 * gezielt — wie bei den Neuerungen auch.
 */
export default async function ScreensPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="screens-page">
        <Journey />
        <Screens />
      </main>
      <Footer />
    </>
  );
}
