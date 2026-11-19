import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Info } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowIcon } from "@/components/ArrowIcon";
import { Link } from "@/i18n/navigation";
import { SITE_URL, docsUrl, pageMetadata } from "@/lib/site";
import {
  RSS_PATH,
  articlePath,
  formatArticleDate,
  getArticle,
  listArticles,
  renderArticle,
} from "@/lib/ratgeber";

/*
 * Ein Ratgeber-Artikel: /ratgeber/<slug> (Datei content/ratgeber/de/<slug>.md).
 *
 * Statisch gebaut; unbekannte Adressen → 404. /en/ratgeber/<slug> zeigt
 * denselben deutschen Text mit Hinweis (siehe lib/ratgeber/index.ts),
 * kanonisch ist immer die deutsche Adresse.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

export const dynamicParams = false;

export function generateStaticParams() {
  return listArticles().map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const path = articlePath(slug);
  /* Den Text gibt es nur auf Deutsch: Titel, Beschreibung und kanonische
     Adresse sind in beiden Sprachen die deutschen. */
  const meta = await pageMetadata({
    locale: "de",
    path,
    title: `${article.title} — OpenEOS`,
    description: article.description,
  });
  meta.alternates = {
    canonical: path,
    languages: { de: path, "x-default": path },
    types: { "application/rss+xml": RSS_PATH },
  };
  meta.openGraph = {
    ...meta.openGraph,
    type: "article",
    title: article.title,
    url: path,
    publishedTime: article.date,
    authors: [article.author],
    tags: article.tags,
  };
  meta.authors = [{ name: article.author }];
  meta.keywords = article.tags;
  if (locale !== "de") meta.robots = { index: false, follow: true };
  return meta;
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getArticle(slug);
  if (!article) notFound();

  const t = await getTranslations("ratgeber");
  const { html, toc } = renderArticle(article.body, { table: t("table"), newTab: t("newTab") });
  const url = `${SITE_URL}${articlePath(slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: "de",
    keywords: article.tags.join(", "),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${SITE_URL}/og-image.png`,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: "LUXCODE by Lukas Lukic-Spitznagel",
      url: "https://luxcode.io",
      brand: { "@type": "Brand", name: "OpenEOS", url: SITE_URL },
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo_dark_trans.png` },
    },
  };

  return (
    <>
      <Header />
      <main className="ratgeber ratgeber--article">
        <script
          type="application/ld+json"
          // "<" maskiert, damit kein Text das Skript-Element beenden kann.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <div className="page-wrap">
          <Link href={articlePath()} className="ratgeber-back ratgeber-back--top">
            <ArrowLeft aria-hidden="true" />
            {t("back")}
          </Link>

          {locale !== "de" && (
            <p className="legal-banner legal-banner--info ratgeber__note" role="note">
              <Info aria-hidden="true" />
              <span>{t("germanOnly")}</span>
            </p>
          )}

          <article className="ratgeber-article" aria-labelledby="ratgeber-title">
            <header className="ratgeber-article__head">
              {article.tags.length > 0 && (
                <ul className="ratgeber-tags" aria-label={t("tags")} lang="de">
                  {article.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
              <h1 id="ratgeber-title" className="section-title ratgeber-article__title" lang="de">
                {article.title}
              </h1>
              <p className="ratgeber-article__lead" lang="de">
                {article.description}
              </p>
              <p className="ratgeber-meta">
                <time dateTime={article.date}>{formatArticleDate(article.date, locale)}</time>
                <span aria-hidden="true">·</span>
                <span>{t("author", { author: article.author })}</span>
                <span aria-hidden="true">·</span>
                <span>{t("readingTime", { minutes: article.readingMinutes })}</span>
              </p>
            </header>

            {toc.length > 1 && (
              <nav className="ratgeber-toc" aria-labelledby="ratgeber-toc-title">
                <h2 id="ratgeber-toc-title" className="ratgeber-toc__title">
                  {t("toc")}
                </h2>
                <ol lang="de">
                  {toc.map((entry) => (
                    <li key={entry.id}>
                      <a href={`#${entry.id}`}>{entry.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="ratgeber-article__body">
              <div
                className="ratgeber-doc"
                lang="de"
                /* Aus dem Repo mitgelieferter Text; der Renderer uebernimmt
                   kein HTML aus dem Markdown (lib/ratgeber/render.mjs). */
                dangerouslySetInnerHTML={{ __html: html }}
              />

              <aside className="ratgeber-cta" aria-labelledby="ratgeber-cta-title">
                <h2 id="ratgeber-cta-title">{t("cta.title")}</h2>
                <p>{t("cta.text")}</p>
                <div className="ratgeber-cta__row">
                  <a href={`${APP_URL}/register`} className="btn btn--light btn--lg">
                    <span>{t("cta.try")}</span>
                    <ArrowIcon />
                  </a>
                  <a href={docsUrl(locale)} className="btn btn--outline-light btn--lg">
                    <span>{t("cta.docs")}</span>
                  </a>
                </div>
              </aside>

              <Link href={articlePath()} className="ratgeber-back">
                <ArrowLeft aria-hidden="true" />
                {t("back")}
              </Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
