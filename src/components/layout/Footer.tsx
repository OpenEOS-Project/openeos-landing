import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ContactTrigger } from "@/components/ContactTrigger";
import { docsUrl } from "@/lib/site";
import { hasLegalDoc } from "@/lib/legal";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const year = new Date().getFullYear();
  /* Anlage 1 erst verlinken, wenn es eine Fassung gibt (lib/legal). */
  const serviceDescription = hasLegalDoc("leistungsbeschreibung");

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
            <Link href="/screens">{t("screens")}</Link>
            <Link href="/#pricing">{t("pricing")}</Link>
            <ContactTrigger type="demo">{t("demo")}</ContactTrigger>
          </div>
          <div>
            <b>{t("resources")}</b>
            <a href={docsUrl(locale)}>{t("docs")}</a>
            <Link href="/changelog">{t("changelog")}</Link>
            <Link href="/faq">{t("faq")}</Link>
            <Link href="/feedback">{t("feedback")}</Link>
            {/* AGPL-3.0 § 13: Quellcode-Link */}
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
            <Link href="/impressum">{t("imprint")}</Link>
            <Link href="/datenschutz">{t("privacy")}</Link>
            <Link href="/agb">{t("terms")}</Link>
            <Link href="/avv">{t("dpa")}</Link>
            {serviceDescription && (
              <Link href="/leistungsbeschreibung">{t("serviceDescription")}</Link>
            )}
            <Link href="/data-act">{t("dataAct")}</Link>
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
