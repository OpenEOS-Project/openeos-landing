import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

/*
 * Wo die Seite laeuft und ob sie in Suchmaschinen gehoert.
 *
 * Beides kommt beim Bauen ins Image (NEXT_PUBLIC_*): Staging und
 * Produktion sind getrennte Images (:dev und :latest), und die meisten
 * Seiten werden statisch erzeugt — ein Laufzeitwert kaeme bei ihnen nie
 * an. Gesetzt in .github/workflows/build-deploy.yaml.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://openeos.de").replace(/\/+$/, "");

/* Fehlt die Angabe, verraet die App-Adresse den Staging-Build: lieber
   einmal zu oft "noindex" als Staging in den Suchergebnissen. */
export const IS_STAGING =
  process.env.NEXT_PUBLIC_SITE_ENV === "staging" ||
  (!process.env.NEXT_PUBLIC_SITE_ENV && (process.env.NEXT_PUBLIC_APP_URL ?? "").includes(".staging."));

const DOCS_BASE = (process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.openeos.de").replace(/\/+$/, "");

/** Handbuch in der Sprache der Seite. Pfade mit abschliessendem
 *  Schraegstrich: ohne ihn leitet die Doku erst um. */
export function docsUrl(locale: string, path = ""): string {
  const prefix = locale === "en" ? "/en" : "";
  return `${DOCS_BASE}${prefix}/${path.replace(/^\/+/, "")}`;
}

/** Pfad einer Seite in einer Sprache — Deutsch ohne Praefix ("as-needed"). */
export function localePath(locale: string, path: string): string {
  const rest = path === "/" ? "" : path;
  if (locale === defaultLocale) return rest || "/";
  return `/${locale}${rest}`;
}

export const OG_IMAGE = { width: 1200, height: 630 } as const;

/**
 * Vollstaendige Metadaten einer Seite.
 *
 * Next fuehrt openGraph/twitter nicht feldweise zusammen: setzt eine
 * Seite nur den Titel, bliebe og:title der der Startseite. Deshalb baut
 * jede Seite ihren Satz komplett hierueber.
 */
export async function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title?: string;
  description?: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const fullTitle = title ?? t("title");
  const desc = description ?? t("description");
  const url = localePath(locale, path);
  const image = {
    url: locale === "en" ? "/og-image-en.png" : "/og-image.png",
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
    alt: t("ogImageAlt"),
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description: desc,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l: Locale) => [l, localePath(l, path)])),
        "x-default": localePath(defaultLocale, path),
      },
    },
    openGraph: {
      type: "website",
      siteName: "OpenEOS",
      title: fullTitle,
      description: desc,
      url,
      locale: locale === "en" ? "en_US" : "de_DE",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [image],
    },
    robots: IS_STAGING ? { index: false, follow: false } : undefined,
  };
}
