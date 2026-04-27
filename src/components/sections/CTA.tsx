import { useTranslations } from "next-intl";

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
        <a href="#" className="btn btn--primary btn--lg">
          {t("ctaRegister")}
        </a>
        <a href="#demo" className="btn btn--ghost btn--lg">
          {t("ctaDemo")}
        </a>
      </div>
    </section>
  );
}
