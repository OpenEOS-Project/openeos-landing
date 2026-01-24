"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, Server, Cloud, Zap } from "lucide-react";

const packages = [
  { days: 1, price: 25, perDay: 25, discount: null },
  { days: 5, price: 110, perDay: 22, discount: 12 },
  { days: 10, price: 200, perDay: 20, discount: 20 },
];

export function Pricing() {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="py-20 md:py-32">
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Self-Hosted */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative p-8 bg-primary rounded-2xl border border-primary"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <Server className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-primary">
              {t("selfHosted.title")}
            </h3>
            <p className="text-tertiary mt-1">{t("selfHosted.description")}</p>
            <div className="mt-6">
              <span className="text-display-md font-semibold text-primary">
                {t("selfHosted.price")}
              </span>
            </div>
            <ul className="mt-8 space-y-4">
              {(t.raw("selfHosted.features") as string[]).map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span className="text-tertiary">{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="/docs"
              className="mt-8 block w-full text-center px-6 py-3 text-md font-semibold text-secondary bg-primary hover:bg-primary_hover ring-1 ring-primary ring-inset rounded-lg transition-colors"
            >
              {t("selfHosted.cta")}
            </a>
          </motion.div>

          {/* SaaS - Featured */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative p-8 bg-brand-50 dark:bg-brand-950/30 rounded-2xl border-2 border-brand-500"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 text-sm font-medium text-white bg-brand-solid rounded-full">
                Empfohlen
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center mb-6">
              <Cloud className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-semibold text-primary">
              {t("saas.title")}
            </h3>
            <p className="text-tertiary mt-1">{t("saas.description")}</p>
            <div className="mt-6">
              <span className="text-display-md font-semibold text-primary">
                {t("saas.price")}
              </span>
              <span className="text-tertiary ml-2">{t("saas.period")}</span>
            </div>
            <ul className="mt-8 space-y-4">
              {(t.raw("saas.features") as string[]).map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-tertiary">{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="/register"
              className="mt-8 block w-full text-center px-6 py-3 text-md font-semibold text-white bg-brand-solid hover:bg-brand-solid_hover rounded-lg transition-colors shadow-xs-skeumorphic"
            >
              {t("saas.cta")}
            </a>
          </motion.div>

          {/* SaaS Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative p-8 bg-primary rounded-2xl border border-primary"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-semibold text-primary">
              {t("saasPro.title")}
            </h3>
            <p className="text-tertiary mt-1">{t("saasPro.description")}</p>
            <div className="mt-6">
              <span className="text-display-md font-semibold text-primary">
                {t("saasPro.price")}
              </span>
              <span className="text-tertiary ml-2">{t("saasPro.period")}</span>
            </div>
            <ul className="mt-8 space-y-4">
              {(t.raw("saasPro.features") as string[]).map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-tertiary">{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="/register"
              className="mt-8 block w-full text-center px-6 py-3 text-md font-semibold text-secondary bg-primary hover:bg-primary_hover ring-1 ring-primary ring-inset rounded-lg transition-colors"
            >
              {t("saasPro.cta")}
            </a>
          </motion.div>
        </div>

        {/* Prepaid Packages Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <h3 className="text-lg font-semibold text-primary text-center mb-6">
            {t("packages.title")}
          </h3>
          <div className="bg-primary rounded-xl border border-primary overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-tertiary">
                    Paket
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-tertiary">
                    Preis
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-tertiary">
                    {t("packages.perDay")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-tertiary">
                    {t("packages.savings")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary">
                {packages.map((pkg) => (
                  <tr key={pkg.days}>
                    <td className="px-6 py-4 text-sm font-medium text-primary">
                      {pkg.days} Event-Tag{pkg.days > 1 ? "e" : ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-tertiary">
                      {pkg.price} €
                    </td>
                    <td className="px-6 py-4 text-sm text-tertiary">
                      {pkg.perDay} €
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {pkg.discount ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">
                          {pkg.discount}%
                        </span>
                      ) : (
                        <span className="text-tertiary">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Hardware Rental */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-tertiary">
            <span className="font-medium text-secondary">
              {t("hardware.title")}:
            </span>{" "}
            {t("hardware.price")}
          </p>
          <p className="text-sm text-quaternary mt-1">
            {t("hardware.description")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
