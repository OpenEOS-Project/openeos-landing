import { useTranslations } from "next-intl";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";
const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "hello@openeos.de";

export function CTA() {
  const t = useTranslations("cta");

  return (
    <section className="cta-block">
      <h2>
        <span>{t("titleL1")}</span>
        <span className="u-accent">{t("titleL2")}</span>
      </h2>
      <p>{t("sub")}</p>
      <div className="cta-block__row">
        <a href={`${APP_URL}/register`} className="btn btn--primary btn--lg">
          {t("ctaRegister")}
        </a>
        <a
          href={`mailto:${DEMO_EMAIL}?subject=Demo-Anfrage%20OpenEOS`}
          className="btn btn--ghost btn--lg"
        >
          {t("ctaDemo")}
        </a>
      </div>
    </section>
  );
}
