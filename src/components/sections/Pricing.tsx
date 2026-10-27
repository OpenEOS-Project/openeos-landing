import { useLocale, useTranslations } from "next-intl";
import { docsUrl } from "@/lib/site";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

export interface PricingPackage {
  slug: string;
  name: string;
  credits: number;
  price: number;
  savingsPercent: number;
}

export interface PricingSubscription {
  name: string;
  description: string | null;
  priceMonthly: number;
}

export interface PricingData {
  packages: PricingPackage[];
  subscription: PricingSubscription | null;
}

function formatEuro(value: number) {
  return `${value.toLocaleString("de-DE")} €`;
}

export function Pricing({ pricingData }: { pricingData?: PricingData | null }) {
  const t = useTranslations("pricing");
  const locale = useLocale();

  // Optional override from API: if a "1-day" package is available, use its price.
  const oneDayPkg = pricingData?.packages?.find((p) => p.slug === "1-day");
  const saasPrice = oneDayPkg ? formatEuro(oneDayPkg.price) : t("saas.price");

  return (
    <section className="pricing" id="pricing">
      <header className="section-head">
        <h2 className="section-title">
          <span>{t("titleL1")}</span>
          <span className="u-accent">{t("titleL2")}</span>
        </h2>
        <p className="section-sub">{t("sub")}</p>
      </header>

      <div className="plans">
        {/* Self-Hosted */}
        <article className="plan">
          <header>
            <h3>{t("selfHosted.title")}</h3>
            <span className="plan__tag">{t("selfHosted.tag")}</span>
          </header>
          <div className="plan__price">
            <b>{t("selfHosted.price")}</b>
            <span>{t("selfHosted.unit")}</span>
          </div>
          <ul>
            {(t.raw("selfHosted.features") as string[]).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <a href={docsUrl(locale, "selbst-betreiben/intro/")} className="btn btn--ghost btn--block">
            {t("selfHosted.cta")}
          </a>
        </article>

        {/* SaaS — featured */}
        <article className="plan plan--featured">
          <header>
            <h3>{t("saas.title")}</h3>
            <span className="plan__tag plan__tag--hot">{t("saas.tag")}</span>
          </header>
          <div className="plan__price">
            <b>{saasPrice}</b>
            <span>{t("saas.unit")}</span>
          </div>
          <span className="plan__bonus">★ {t("saas.bonus")}</span>
          <ul>
            {(t.raw("saas.features") as string[]).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <a href={`${APP_URL}/register`} className="btn btn--light btn--block">
            {t("saas.cta")}
          </a>
        </article>
      </div>
    </section>
  );
}
