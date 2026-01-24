"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  const t = useTranslations("cta");

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-brand-600 dark:bg-brand-700 p-8 md:p-16"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-brand-500/30 blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-brand-700/30 blur-3xl" />
          </div>

          <div className="relative text-center">
            <h2 className="text-display-sm md:text-display-md font-semibold text-white">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg text-brand-100 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
            <div className="mt-8">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-md font-semibold text-brand-700 bg-white hover:bg-brand-50 rounded-lg transition-colors"
              >
                {t("button")}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
