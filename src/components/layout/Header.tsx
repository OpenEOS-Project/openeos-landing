"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitch } from "./LanguageSwitch";
import { Logo } from "./Logo";

export function Header() {
  const t = useTranslations("nav");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/#features", label: t("features") },
    { href: "/#pricing", label: t("pricing") },
    { href: "/#open-source", label: t("openSource") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-lg border-b border-primary">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Navigation (Left side) */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-tertiary hover:text-tertiary_hover transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Actions (Right side) */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitch />
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-semibold text-tertiary hover:text-tertiary_hover transition-colors"
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-brand-solid hover:bg-brand-solid_hover rounded-lg transition-colors shadow-xs-skeumorphic"
            >
              {t("register")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-primary_hover transition-colors text-fg-quaternary"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary border-b border-primary">
          <div className="px-4 py-4 space-y-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-tertiary hover:text-tertiary_hover transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-primary flex items-center justify-between">
              <LanguageSwitch />
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-tertiary hover:text-tertiary_hover transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-brand-solid hover:bg-brand-solid_hover rounded-lg transition-colors"
                >
                  {t("register")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
