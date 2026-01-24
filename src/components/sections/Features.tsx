"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Smartphone,
  QrCode,
  Monitor,
  CreditCard,
  Printer,
  Workflow,
  BarChart3,
  Github,
} from "lucide-react";

const featureIcons = {
  mobile: Smartphone,
  qrOrder: QrCode,
  display: Monitor,
  payment: CreditCard,
  printer: Printer,
  workflow: Workflow,
  stats: BarChart3,
  openSource: Github,
};

const featureKeys = [
  "mobile",
  "qrOrder",
  "display",
  "payment",
  "printer",
  "workflow",
  "stats",
  "openSource",
] as const;

export function Features() {
  const t = useTranslations("features");

  return (
    <section id="features" className="py-20 md:py-32 bg-secondary">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-display-sm md:text-display-md font-semibold text-primary"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-tertiary"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {featureKeys.map((key, index) => {
            const Icon = featureIcons[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative p-6 bg-primary rounded-2xl border border-primary hover:border-brand-200 dark:hover:border-brand-800 transition-colors group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center mb-4 group-hover:bg-brand-200 dark:group-hover:bg-brand-800/50 transition-colors">
                  <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-tertiary">
                  {t(`items.${key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
