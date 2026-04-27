"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";

export function LanguageSwitch() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="lang" role="group" aria-label="Sprache">
      {locales.map((loc, index) => (
        <span key={loc} className="flex items-center">
          {index > 0 && <span className="lang__sep">/</span>}
          <button
            type="button"
            className={`lang__btn ${locale === loc ? "is-active" : ""}`}
            onClick={() => handleChange(loc)}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
