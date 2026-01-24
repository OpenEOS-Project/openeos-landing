"use client";

import { useTranslations } from "next-intl";
import { Github, Twitter } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LanguageSwitch } from "./LanguageSwitch";

export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: t("features"), href: "#features" },
      { label: t("pricing"), href: "#pricing" },
      { label: t("demo"), href: "#demo" },
    ],
    resources: [
      { label: t("docs"), href: "/docs" },
      { label: t("api"), href: "/docs/api" },
      { label: t("blog"), href: "/blog" },
      { label: t("changelog"), href: "/changelog" },
    ],
    legal: [
      { label: t("imprint"), href: "/imprint" },
      { label: t("privacy"), href: "/privacy" },
      { label: t("terms"), href: "/terms" },
    ],
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/openeos", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com/openeos", label: "Twitter" },
  ];

  return (
    <footer className="bg-secondary border-t border-primary">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="col-span-2">
            <Logo className="h-8 w-auto" />
            <p className="mt-4 text-tertiary text-sm max-w-xs">
              Das moderne Kassensystem für Vereine, Veranstaltungen und
              Festbewirtungen.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-quaternary hover:text-fg-quaternary_hover transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-4">
              {t("product")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-tertiary hover:text-tertiary_hover transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-4">
              {t("resources")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-tertiary hover:text-tertiary_hover transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-4">
              {t("legal")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-tertiary hover:text-tertiary_hover transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-primary flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-tertiary text-center sm:text-left">
            <p>{t("copyright", { year: currentYear })} · {t("madeWith")} ❤️</p>
            <p className="mt-1 text-quaternary">
              {t("productBy")}
            </p>
          </div>
          <LanguageSwitch />
        </div>
      </div>
    </footer>
  );
}
