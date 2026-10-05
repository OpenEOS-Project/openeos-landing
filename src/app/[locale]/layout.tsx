import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { SiteShell } from "@/components/layout/SiteShell";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  /* Grundsatz fuer alles darunter; jede Seite setzt ihren eigenen Satz.
     Ohne kanonische Adresse: die 404 erbt nur diesen Teil und soll nicht
     auf die Startseite verweisen. */
  const base = await pageMetadata({ locale, path: "/" });
  delete base.alternates;
  return base;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  /* Die Middleware laesst Pfade mit Punkt durch (Dateien). Ohne diese
     Pruefung landete z. B. /wp-login.php hier als Sprache "wp-login.php"
     und bekam die Startseite mit Status 200. */
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <SiteShell locale={locale} messages={messages}>
      {children}
    </SiteShell>
  );
}
