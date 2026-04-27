import { useTranslations } from "next-intl";
import { HeroDemo } from "./HeroDemo";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="hero" id="top">
      <div className="hero__inner">
        <div className="hero__copy">
          <div className="pill">
            <span className="pill__dot" />
            <span>{t("pill")}</span>
          </div>

          <h1 className="hero__title">
            <span>{t("titleL1")}</span>
            <span className="u-stroke">{t("titleL2")}</span>
            <span className="u-accent">{t("titleL3")}</span>
          </h1>

          <p className="hero__sub">{t("sub")}</p>

          <div className="hero__cta">
            <a href="#" className="btn btn--primary btn--lg">
              <span>{t("ctaStart")}</span>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d="M5 10h10M10 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  fill="none"
                  strokeLinecap="square"
                />
              </svg>
            </a>
            <a href="#demo" className="btn btn--ghost btn--lg">
              {t("ctaDemo")}
            </a>
          </div>
        </div>

        <HeroDemo />

        <dl className="hero__stats">
          <div>
            <dt>{t("stat1Label")}</dt>
            <dd>{t("stat1Value")}</dd>
          </div>
          <div>
            <dt>{t("stat2Label")}</dt>
            <dd>{t("stat2Value")}</dd>
          </div>
          <div>
            <dt>{t("stat3Label")}</dt>
            <dd>{t("stat3Value")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
