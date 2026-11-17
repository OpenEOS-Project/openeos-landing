import { useTranslations } from "next-intl";
import {
  Smartphone,
  QrCode,
  Monitor,
  CreditCard,
  ShieldCheck,
  Ticket,
  Recycle,
  ReceiptText,
  UserCheck,
  LayoutGrid,
  Printer,
  CalendarClock,
  BarChart3,
  Sparkles,
  Webhook,
  Github,
} from "lucide-react";
import { tseComingSoon } from "@/lib/tse-availability";
import { ComingSoonBadge } from "@/components/ComingSoonBadge";

const items = [
  { key: "mobile", Icon: Smartphone },
  { key: "qrOrder", Icon: QrCode },
  { key: "kitchen", Icon: Monitor },
  { key: "payment", Icon: CreditCard },
  { key: "tse", Icon: ShieldCheck },
  { key: "tokens", Icon: Ticket },
  { key: "pfand", Icon: Recycle },
  { key: "receipts", Icon: ReceiptText },
  { key: "waiters", Icon: UserCheck },
  { key: "tables", Icon: LayoutGrid },
  { key: "printer", Icon: Printer },
  { key: "shifts", Icon: CalendarClock },
  { key: "stats", Icon: BarChart3 },
  { key: "assistant", Icon: Sparkles },
  { key: "api", Icon: Webhook },
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
            <h3 className="fbox__title">
              {t(`items.${key}.title`)}
              {/* Cloud-TSE für Bargeld in Deutschland: eigene Kachel, ggf. „Bald verfügbar“. */}
              {key === "tse" && tseComingSoon && <ComingSoonBadge />}
            </h3>
            <p>{t(`items.${key}.copy`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
