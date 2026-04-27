"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitch } from "./LanguageSwitch";

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`nav ${open ? "is-open" : ""}`}>
        <Link href="/" className="nav__logo" aria-label="OpenEOS" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_dark_trans.png" alt="OpenEOS" />
        </Link>

        <div className="nav__inner">
          <nav className="nav__links" aria-label="Hauptnavigation">
            <Link href="/#features">{t("features")}</Link>
            <Link href="/#pricing">{t("pricing")}</Link>
            <Link href="/#open-source">{t("openSource")}</Link>
          </nav>
        </div>

        <div className="nav__right">
          <div className="nav__desktop-only">
            <LanguageSwitch />
          </div>
          <a href="#" className="btn btn--ghost nav__login">
            {t("login")}
          </a>
          <a href="#" className="btn btn--primary nav__register">
            <span>{t("register")}</span>
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
          <button
            type="button"
            className="nav__burger"
            aria-label="Menü"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {open && (
        <>
          <div className="nav__backdrop" onClick={close} aria-hidden="true" />
          <aside className="nav__panel" role="dialog" aria-label="Mobile-Navigation">
            <div className="nav__panel-head">
              <Link href="/" className="nav__panel-logo" aria-label="OpenEOS" onClick={close}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo_dark_trans.png" alt="OpenEOS" />
              </Link>
              <button
                type="button"
                className="nav__close"
                aria-label="Menü schließen"
                onClick={close}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <nav className="nav__panel-links" aria-label="Hauptnavigation">
              <Link href="/#features" onClick={close}>{t("features")}</Link>
              <Link href="/#pricing" onClick={close}>{t("pricing")}</Link>
              <Link href="/#open-source" onClick={close}>{t("openSource")}</Link>
            </nav>
            <div className="nav__panel-actions">
              <LanguageSwitch />
              <a href="#" className="btn btn--ghost btn--block" onClick={close}>
                {t("login")}
              </a>
              <a href="#" className="btn btn--primary btn--block" onClick={close}>
                {t("register")}
              </a>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
