"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";

export function LanguageSwitch() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((loc, index) => (
        <span key={loc} className="flex items-center">
          {index > 0 && <span className="text-fg-disabled mx-1">|</span>}
          <button
            onClick={() => handleChange(loc)}
            className={`px-1 py-0.5 rounded transition-colors ${
              locale === loc
                ? "text-fg-brand-primary font-medium"
                : "text-fg-quaternary hover:text-fg-quaternary_hover"
            }`}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
