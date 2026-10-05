import { useTranslations } from "next-intl";
import { ContactTrigger } from "@/components/ContactTrigger";
import { ArrowIcon } from "@/components/ArrowIcon";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

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
          <span>{t("ctaRegister")}</span>
          <ArrowIcon />
        </a>
        <ContactTrigger type="demo" className="btn btn--ghost btn--lg">
          <span>{t("ctaDemo")}</span>
          <ArrowIcon />
        </ContactTrigger>
      </div>
    </section>
  );
}
