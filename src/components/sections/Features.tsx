import { useTranslations } from "next-intl";
import {
  Smartphone,
  QrCode,
  Monitor,
  CreditCard,
  Printer,
  BarChart3,
  Github,
  CalendarClock,
} from "lucide-react";

const items = [
  { key: "mobile", Icon: Smartphone },
  { key: "qrOrder", Icon: QrCode },
  { key: "kitchen", Icon: Monitor },
  { key: "payment", Icon: CreditCard },
  { key: "printer", Icon: Printer },
  { key: "shifts", Icon: CalendarClock },
  { key: "stats", Icon: BarChart3 },
  { key: "openSource", Icon: Github },
] as const;

export function Features() {
  const t = useTranslations("features");

  return (
    <section className="features" id="features">
      <header className="section-head">
        <h2 className="section-title">
          <span>{t("titleL1")}</span>
          <span className="u-accent">{t("titleL2")}</span>
        </h2>
        <p className="section-sub">{t("sub")}</p>
      </header>

      <div className="features__grid">
        {items.map(({ key, Icon }) => (
          <article key={key} className="fbox">
            <span className="fbox__icon" aria-hidden="true">
              <Icon />
            </span>
            <h3>{t(`items.${key}.title`)}</h3>
            <p>{t(`items.${key}.copy`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
