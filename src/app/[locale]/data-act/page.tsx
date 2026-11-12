import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Info } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ComingSoonBadge } from "@/components/ComingSoonBadge";
import { Link } from "@/i18n/navigation";
import { docsUrl, pageMetadata } from "@/lib/site";
import { tseComingSoon } from "@/lib/tse-availability";

/*
 * Angaben nach dem Data Act (Art. 26, 28 VO (EU) 2023/2854): Standorte,
 * Rechtsordnung, Schutz vor Drittstaatenzugriff, Exportformate und
 * Anbieterwechsel. Eine Informationsseite, kein Rechtstext — verbindlich
 * sind AGB (Ziffer 10) und AVV (Anhang B, C); die Angaben hier
 * stammen aus diesen Texten und aus dem Code. Aendern sich Standorte oder
 * Unterauftragsverarbeiter, gehoert diese Seite mit angepasst.
 */

const SECTIONS = ["provider", "locations", "protection", "export", "switching"] as const;
const LOCATION_ROWS = ["hosting", "backup", "mail", "ai", "tse", "cdn", "sentry"] as const;

const MAIL = "hello@openeos.de";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dataAct" });
  return pageMetadata({ locale, path: "/data-act", title: t("metaTitle"), description: t("metaDescription") });
}

function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default async function DataActPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dataAct");

  const docs = (path: string) => {
    const DocsLink = (chunks: ReactNode) => <External href={docsUrl(locale, path)}>{chunks}</External>;
    return DocsLink;
  };
  const tags = {
    b: (chunks: ReactNode) => <strong>{chunks}</strong>,
    agb: (chunks: ReactNode) => <Link href="/agb">{chunks}</Link>,
    avv: (chunks: ReactNode) => <Link href="/avv#anhang-b">{chunks}</Link>,
    mail: (chunks: ReactNode) => <a href={`mailto:${MAIL}`}>{chunks}</a>,
    orders: docs("bestellungen/#als-csv-exportieren"),
    reports: docs("auswertung/"),
    cashaudit: docs("kassen-nachschau/"),
    apiref: docs("api"),
    tokens: docs("api-zugaenge/"),
    webhooks: docs("integrationen/webhooks/"),
    deletion: docs("daten-und-loeschung/"),
    selfhost: docs("selbst-betreiben/installation/"),
    github: (chunks: ReactNode) => <External href="https://github.com/OpenEOS-Project">{chunks}</External>,
  };
  const rich = (key: string) => t.rich(key, tags);
  const list = (key: string) => (t.raw(key) as string[]).map((_, i) => rich(`${key}.${i}`));

  return (
    <>
      <Header />
      <main className="legal data-act">
        <div className="page-wrap">
          <div className="legal__article">
            <header className="data-act__head">
              <h1 className="section-title">
                {t("titleL1")} <span className="u-accent">{t("titleL2")}</span>
              </h1>
              <p className="section-sub">{t("sub")}</p>
            </header>

            <p className="legal-banner legal-banner--info" role="note">
              <Info aria-hidden="true" />
              <span>{rich("note")}</span>
            </p>

            <nav className="legal-toc data-act__toc" aria-label={t("toc")}>
              <ol>
                {SECTIONS.map((key) => (
                  <li key={key}>
                    <a href={`#${key}`}>{t(`${key}.title`)}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="legal-doc data-act__body">
              <section aria-labelledby="provider">
                <h2 id="provider">{t("provider.title")}</h2>
                <p>{t("provider.p1")}</p>
                <p>{t("provider.p2")}</p>
              </section>

              <section aria-labelledby="locations">
                <h2 id="locations">{t("locations.title")}</h2>
                <p>{t("locations.intro")}</p>
                <div className="legal-table" role="region" aria-labelledby="locations" tabIndex={0}>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">{t("locations.colPurpose")}</th>
                        <th scope="col">{t("locations.colCompany")}</th>
                        <th scope="col">{t("locations.colLocation")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {LOCATION_ROWS.map((row) => (
                        <tr key={row} data-row={row}>
                          <td>
                            {t(`locations.rows.${row}.0`)}
                            {row === "tse" && tseComingSoon && (
                              <>
                                {" "}
                                <ComingSoonBadge />
                              </>
                            )}
                          </td>
                          <td>{t(`locations.rows.${row}.1`)}</td>
                          <td>{t(`locations.rows.${row}.2`)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p>{rich("locations.outro")}</p>
              </section>

              <section aria-labelledby="protection">
                <h2 id="protection">{t("protection.title")}</h2>
                <p>{t("protection.intro")}</p>
                <ul>
                  {list("protection.items").map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="export">
                <h2 id="export">{t("export.title")}</h2>
                <p>{rich("export.intro")}</p>
                <ul>
                  {list("export.items").map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p>{rich("export.outro")}</p>
              </section>

              <section aria-labelledby="switching">
                <h2 id="switching">{t("switching.title")}</h2>
                <p>{t("switching.intro")}</p>
                <ol>
                  {list("switching.steps").map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
                <p>{rich("switching.fees")}</p>
                <p>{rich("switching.selfhost")}</p>
              </section>

              <hr />
              <p>{rich("contact")}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
