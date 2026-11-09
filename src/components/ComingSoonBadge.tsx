import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";

/** Kleines Abzeichen „Bald verfügbar“ (siehe lib/tse-availability). */
export function ComingSoonBadge() {
  const t = useTranslations("tse");
  return (
    <span className="soon-badge">
      <Clock aria-hidden="true" />
      {t("comingSoon")}
    </span>
  );
}
