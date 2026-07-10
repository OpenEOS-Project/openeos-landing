import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "hello@openeos.de";
const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? "#";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="foot__top">
        <div className="foot__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_dark_trans.png" alt="OpenEOS" />
          <p>{t("tagline")}</p>
        </div>

        <div className="foot__cols">
          <div>
            <b>{t("product")}</b>
            <Link href="/#features">{t("features")}</Link>
            <Link href="/#pricing">{t("pricing")}</Link>
            <a href={`mailto:${DEMO_EMAIL}?subject=Demo-Anfrage%20OpenEOS`}>{t("demo")}</a>
          </div>
          <div>
            <b>{t("resources")}</b>
            <a href={DOCS_URL}>{t("docs")}</a>
            <a
              href="https://github.com/OpenEOS-Project"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("github")}
            </a>
          </div>
          <div>
            <b>{t("legal")}</b>
            <Link href="/imprint">{t("imprint")}</Link>
            <Link href="/privacy">{t("privacy")}</Link>
            <Link href="/terms">{t("terms")}</Link>
          </div>
        </div>
      </div>

      <div className="foot__bot">
        <span>{t("copyright", { year })}</span>
        <a
          href="https://luxcode.io"
          target="_blank"
          rel="noopener noreferrer"
          className="foot__by"
        >
          {t("productBy")}
        </a>
      </div>
    </footer>
  );
}
