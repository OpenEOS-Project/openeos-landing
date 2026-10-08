import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowIcon } from "@/components/ArrowIcon";

export function NotFoundContent() {
  const t = useTranslations("notFound");

  return (
    <>
      {/* not-found kann keine Metadaten exportieren; React hebt den Titel
          selbst in den <head>. */}
      <title>{t("metaTitle")}</title>
      <meta name="robots" content="noindex" />
      <Header />
      <main className="not-found">
        <div className="not-found__inner page-wrap">
          <p className="not-found__code">404</p>
          <h1 className="section-title">
            {t("titleL1")} <span className="u-accent">{t("titleL2")}</span>
          </h1>
          <p className="section-sub">{t("sub")}</p>
          <div className="not-found__actions">
            <Link href="/" className="btn btn--primary btn--lg">
              <span>{t("home")}</span>
              <ArrowIcon />
            </Link>
            <Link href="/changelog" className="btn btn--ghost btn--lg">
              {t("changelog")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
