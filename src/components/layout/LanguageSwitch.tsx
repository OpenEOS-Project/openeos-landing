"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";

export function LanguageSwitch() {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="lang" role="group" aria-label={t("language")}>
      {locales.map((loc, index) => (
        <span key={loc} className="flex items-center">
          {index > 0 && <span className="lang__sep">/</span>}
          <button
            type="button"
            className={`lang__btn ${locale === loc ? "is-active" : ""}`}
            onClick={() => handleChange(loc)}
            lang={loc}
            aria-label={localeNames[loc]}
            aria-pressed={locale === loc}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
