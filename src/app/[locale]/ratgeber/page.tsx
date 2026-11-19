import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Info, Rss } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/site";
import { RSS_PATH, articlePath, formatArticleDate, listArticles } from "@/lib/ratgeber";

/*
 * Ratgeber: Uebersicht aller Artikel, neueste zuerst. Die Artikel stehen
 * als Markdown unter content/ratgeber/de/<slug>.md (lib/ratgeber) und
 * sind nur auf Deutsch; /en/ratgeber sagt das und verlinkt sie trotzdem.
 */

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ratgeber" });
  const meta = await pageMetadata({
    locale,
    path: articlePath(),
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
  meta.alternates = { ...meta.alternates, types: { "application/rss+xml": RSS_PATH } };
  return meta;
}

export default async function RatgeberPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ratgeber");
  const articles = listArticles();

  return (
    <>
      <Header />
      <main className="ratgeber">
        <div className="page-wrap">
          <header className="section-head">
            <h1 className="section-title">{t("title")}</h1>
            <p className="section-sub">{t("sub")}</p>
          </header>

          {locale !== "de" && (
            <p className="legal-banner legal-banner--info ratgeber__note" role="note">
              <Info aria-hidden="true" />
              <span>{t("germanOnly")}</span>
            </p>
          )}

          {articles.length ? (
            <section aria-label={t("articles")}>
              <ul className="ratgeber__list">
                {articles.map((article) => (
                  <li key={article.slug}>
                    <article className="ratgeber-card" lang="de">
                      <h2 className="ratgeber-card__title">
                        <Link href={articlePath(article.slug)}>{article.title}</Link>
                      </h2>
                      <p className="ratgeber-card__desc">{article.description}</p>
                      <p className="ratgeber-meta" lang={locale}>
                        <time dateTime={article.date}>{formatArticleDate(article.date, locale)}</time>
                        <span aria-hidden="true">·</span>
                        <span>{t("readingTime", { minutes: article.readingMinutes })}</span>
                      </p>
                      {article.tags.length > 0 && (
                        <ul className="ratgeber-tags" aria-label={t("tags")}>
                          {article.tags.map((tag) => (
                            <li key={tag}>{tag}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <p className="ratgeber__empty">{t("empty")}</p>
          )}

          <p className="ratgeber__rss">
            <a href={RSS_PATH}>
              <Rss aria-hidden="true" />
              {t("rss")}
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
