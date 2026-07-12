import { useTranslations } from "next-intl";
import { ContactTrigger } from "@/components/ContactTrigger";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";
const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? "#";

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
          <a href={DOCS_URL} className="btn btn--ghost btn--block">
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

        {/* Hardware */}
        <article className="plan">
          <header>
            <h3>{t("hardware.title")}</h3>
            <span className="plan__tag">{t("hardware.tag")}</span>
          </header>
          <div className="plan__price">
            <b>{t("hardware.price")}</b>
            <span>{t("hardware.unit")}</span>
          </div>
          <ul>
            {(t.raw("hardware.features") as string[]).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <ContactTrigger type="hardware" className="btn btn--ghost btn--block">
            {t("hardware.cta")}
          </ContactTrigger>
        </article>
      </div>

      <article className="price-gateway">
        <span className="price-gateway__badge">{t("gateway.badge")}</span>
        <div className="price-gateway__copy">
          <h3>{t("gateway.title")}</h3>
          <p>{t("gateway.copy")}</p>
          <ul className="price-gateway__features">
            {(t.raw("gateway.features") as string[]).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div className="price-gateway__buy">
          <div className="price-gateway__price">
            <b>{t("gateway.price")}</b>
            <span>{t("gateway.unit")}</span>
          </div>
          <ContactTrigger type="gateway" className="btn btn--light btn--block">
            {t("gateway.cta")}
          </ContactTrigger>
        </div>
      </article>
    </section>
  );
}
