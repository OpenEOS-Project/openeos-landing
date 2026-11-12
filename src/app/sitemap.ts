import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { SITE_URL, localePath } from "@/lib/site";
import { hasLegalDoc } from "@/lib/legal";

/* Alle oeffentlichen Seiten. Kommt eine dazu, gehoert sie hier hinein. */
const PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/screens", priority: 0.7, changeFrequency: "monthly" },
  { path: "/changelog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/feedback", priority: 0.4, changeFrequency: "yearly" },
  { path: "/impressum", priority: 0.2, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.2, changeFrequency: "yearly" },
  { path: "/agb", priority: 0.2, changeFrequency: "yearly" },
  { path: "/avv", priority: 0.2, changeFrequency: "yearly" },
  { path: "/data-act", priority: 0.3, changeFrequency: "yearly" },
];

/* Anlage 1 nur, wenn es eine Fassung gibt (lib/legal). */
const OPTIONAL_PAGES: typeof PAGES = hasLegalDoc("leistungsbeschreibung")
  ? [{ path: "/leistungsbeschreibung", priority: 0.2, changeFrequency: "yearly" }]
  : [];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...PAGES, ...OPTIONAL_PAGES].flatMap(({ path, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}${localePath(l, path)}`]),
        ),
      },
    })),
  );
}
