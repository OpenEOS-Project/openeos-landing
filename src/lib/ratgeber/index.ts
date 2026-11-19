export { getArticle, listArticles, type Article } from "./core.mjs";
export { renderArticle, type ArticleTocEntry } from "./render.mjs";

/*
 * Die Artikel gibt es nur auf Deutsch. /en/ratgeber/<slug> zeigt denselben
 * deutschen Text mit englischem Rahmen und einem Hinweis (wie die
 * Rechtstexte): Wer Englisch eingestellt hat, wird von der Middleware von
 * /ratgeber/<slug> ohnehin dorthin umgeleitet. Kanonisch ist die deutsche
 * Adresse.
 */

/** Oeffentliche Adresse (deutsch, ohne Sprache). */
export function articlePath(slug?: string) {
  return slug ? `/ratgeber/${slug}` : "/ratgeber";
}

export const RSS_PATH = "/ratgeber/rss.xml";

/** „2026-11-19“ → „19. November 2026“ bzw. „November 19, 2026“. */
export function formatArticleDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
