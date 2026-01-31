"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50 to-transparent dark:from-brand-950/20 dark:to-transparent -z-10" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-display-lg md:text-display-xl lg:text-display-2xl font-semibold text-primary tracking-tight"
          >
            {t("title")}
            <br />
            <span className="text-brand-600 dark:text-brand-400">
              {t("titleHighlight")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg md:text-xl text-tertiary max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-md font-semibold text-white bg-brand-solid hover:bg-brand-solid_hover rounded-lg transition-colors shadow-xs-skeumorphic w-full sm:w-auto"
            >
              {t("cta.start")}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-md font-semibold text-secondary bg-primary hover:bg-primary_hover ring-1 ring-primary ring-inset rounded-lg transition-colors shadow-xs-skeumorphic w-full sm:w-auto"
            >
              <Play className="w-5 h-5" />
              {t("cta.demo")}
            </a>
          </motion.div>
        </div>

        {/* Hero Image / Screenshot placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 md:mt-20"
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="aspect-[16/10] rounded-xl bg-secondary border border-primary shadow-2xl overflow-hidden">
              {/* Placeholder for app screenshot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-brand-600 dark:text-brand-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-tertiary text-sm">
                    App Screenshot
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative gradient blobs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-600/20 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
