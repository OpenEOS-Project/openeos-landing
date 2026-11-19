import { getTranslations } from "next-intl/server";

import { SITE_URL } from "@/lib/site";
import { RSS_PATH, articlePath, listArticles } from "@/lib/ratgeber";

/*
 * RSS-Feed des Ratgebers: /ratgeber/rss.xml (RSS 2.0, deutsch).
 *
 * Ausserhalb von [locale]: Pfade mit Punkt laesst die Middleware durch.
 * Beim Bauen erzeugt; neue Artikel kommen mit dem naechsten Deploy.
 */

export const dynamic = "force-static";

function xml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** „2026-11-19“ → RFC 822, wie RSS es verlangt. */
function rssDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export async function GET() {
  const t = await getTranslations({ locale: "de", namespace: "ratgeber" });
  const articles = listArticles();
  const channelUrl = `${SITE_URL}${articlePath()}`;

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}${articlePath(a.slug)}`;
      return [
        "    <item>",
        `      <title>${xml(a.title)}</title>`,
        `      <link>${xml(url)}</link>`,
        `      <guid isPermaLink="true">${xml(url)}</guid>`,
        `      <pubDate>${rssDate(a.date)}</pubDate>`,
        `      <dc:creator>${xml(a.author)}</dc:creator>`,
        `      <description>${xml(a.description)}</description>`,
        ...a.tags.map((tag) => `      <category>${xml(tag)}</category>`),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(t("rssTitle"))}</title>
    <link>${xml(channelUrl)}</link>
    <description>${xml(t("sub"))}</description>
    <language>de-DE</language>
    <atom:link href="${xml(`${SITE_URL}${RSS_PATH}`)}" rel="self" type="application/rss+xml"/>
${articles[0] ? `    <lastBuildDate>${rssDate(articles[0].date)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
