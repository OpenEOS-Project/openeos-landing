import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Download, Info, Archive, CalendarClock } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrintButton } from "@/components/legal/PrintButton";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/site";
import {
  formatVersion,
  getLegalDocument,
  legalPath,
  legalPdfPath,
  listVersions,
  type LegalDoc,
} from "@/lib/legal";
import { renderLegal } from "@/lib/legal/render";

/*
 * Ein Rechtstext (Impressum, Datenschutz, AGB, AVV, Anlage 1) in einer Fassung.
 *
 * Adressen (andere Teile von OpenEOS verlinken darauf — nicht aendern):
 *   /<doc>              aktuelle Fassung (neueste, deren Datum erreicht ist)
 *   /<doc>/<JJJJ-MM-TT> jede Fassung, auch die aktuelle und kuenftige
 *                       (unbekannt → 404)
 *   /rechtstexte/<doc>-<JJJJ-MM-TT>.pdf und /rechtstexte/<doc>.pdf
 *   #<ueberschrift>, #anhang-b, #ziffer-4-6 als Sprungmarken
 * Englisch (/en/…) zeigt denselben deutschen Text mit einem Hinweis.
 */

type Params = { locale: string; version?: string };

/** Fassungen fuer generateStaticParams einer [version]-Route. */
export function legalVersionParams(doc: LegalDoc) {
  return listVersions(doc).map((version) => ({ version }));
}

export async function legalMetadata(doc: LegalDoc, { locale, version }: Params): Promise<Metadata> {
  const data = getLegalDocument(doc, version);
  if (!data) return {};
  const t = await getTranslations({ locale, namespace: "legal" });
  const other = !data.isCurrent;
  const date = formatVersion(data.version, locale);
  const meta = await pageMetadata({
    locale,
    /* Die aktuelle Fassung ist auch unter /<doc>/<datum> erreichbar;
       kanonisch ist dann /<doc>. */
    path: other ? legalPath(doc, data.version) : legalPath(doc),
    title: !other
      ? t(`docs.${doc}.metaTitle`)
      : data.status === "upcoming"
        ? `${t(`docs.${doc}.metaTitle`)} (${t("upcomingTitle", { date })})`
        : `${t(`docs.${doc}.metaTitle`)} (${date})`,
    description: t(`docs.${doc}.metaDescription`),
  });
  /* Alte und kuenftige Fassungen gehoeren nicht in die Suchergebnisse. */
  if (other) meta.robots = { index: false, follow: true };
  return meta;
}

export async function LegalDocumentPage({ doc, locale, version }: Params & { doc: LegalDoc }) {
  setRequestLocale(locale);
  const data = getLegalDocument(doc, version);
  if (!data) notFound();

  const t = await getTranslations({ locale, namespace: "legal" });
  const { html, toc } = renderLegal(data.source, {
    clauseAnchor: (number) => t("clauseAnchor", { number }),
    headingAnchor: (text) => t("headingAnchor", { text }),
    table: t("table"),
  });
  const pdf = legalPdfPath(doc, data.version);
  const pdfName = `openeos-${doc}-${data.version}.pdf`;
  /* Hinweis auf der aktuellen Fassung, wenn schon eine neue angekuendigt ist. */
  const nextVersion = data.upcoming[0];
  /* Inhaltsverzeichnis erst ab ein paar Abschnitten (nicht im Impressum). */
  const showToc = toc.length > 8;

  return (
    <>
      <Header />
      <main className="legal">
        <div className="page-wrap">
          <div className="legal__article">
            {data.status === "archived" && data.current && (
              <p className="legal-banner" role="note">
                <Archive aria-hidden="true" />
                <span>
                  {t.rich("archived", {
                    date: formatVersion(data.version, locale),
                    current: formatVersion(data.current, locale),
                    link: (chunks) => <Link href={legalPath(doc)}>{chunks}</Link>,
                  })}
                </span>
              </p>
            )}
            {data.status === "upcoming" && (
              <p className="legal-banner legal-banner--upcoming" role="note">
                <CalendarClock aria-hidden="true" />
                <span>
                  {data.current
                    ? t.rich("upcoming", {
                        date: formatVersion(data.version, locale),
                        current: formatVersion(data.current, locale),
                        link: (chunks) => <Link href={legalPath(doc)}>{chunks}</Link>,
                      })
                    : t("upcomingOnly", { date: formatVersion(data.version, locale) })}
                </span>
              </p>
            )}
            {data.isCurrent && nextVersion && (
              <p className="legal-banner legal-banner--info" role="note">
                <CalendarClock aria-hidden="true" />
                <span>
                  {t.rich("upcomingNotice", {
                    date: formatVersion(nextVersion, locale),
                    link: (chunks) => <Link href={legalPath(doc, nextVersion)}>{chunks}</Link>,
                  })}
                </span>
              </p>
            )}
            {locale !== "de" && (
              <p className="legal-banner legal-banner--info" role="note">
                <Info aria-hidden="true" />
                <span>{t("germanOnly")}</span>
              </p>
            )}

            <div className="legal-actions">
              <a className="btn btn--ghost" href={pdf} download={pdfName}>
                <Download aria-hidden="true" />
                {t("downloadPdf")}
              </a>
              <PrintButton label={t("print")} />
            </div>

            {showToc && (
              <details className="legal-toc">
                <summary>{t("contents")}</summary>
                <ol lang="de">
                  {toc.map((entry) => (
                    <li key={entry.id} className={`legal-toc__d${entry.depth}`}>
                      <a href={`#${entry.id}`}>{entry.text}</a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <article
              className="legal-doc"
              lang="de"
              /* Vom Repo mitgelieferter, geprueft unveraenderter Text —
                 keine Nutzereingabe. */
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <aside className="legal-versions" aria-labelledby="legal-versions-title">
              <h2 id="legal-versions-title">{t("versions")}</h2>
              <ul>
                {data.versions.map((v) => (
                  <li key={v}>
                    {v === data.version ? (
                      <strong aria-current="page">{formatVersion(v, locale)}</strong>
                    ) : (
                      <Link href={v === data.current ? legalPath(doc) : legalPath(doc, v)}>
                        {formatVersion(v, locale)}
                      </Link>
                    )}
                    {v === data.current && <span className="legal-versions__tag">{t("currentLabel")}</span>}
                    {data.upcoming.includes(v) && (
                      <span className="legal-versions__tag legal-versions__tag--upcoming">
                        {t("upcomingLabel")}
                      </span>
                    )}
                    <a className="legal-versions__pdf" href={legalPdfPath(doc, v)} download={`openeos-${doc}-${v}.pdf`}>
                      {t("pdf")}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
