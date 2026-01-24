"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Github, BookOpen, Users } from "lucide-react";

export function OpenSource() {
  const t = useTranslations("openSource");

  const links = [
    {
      icon: Github,
      label: t("github"),
      href: "https://github.com/openeos",
      description: "Star us on GitHub",
    },
    {
      icon: BookOpen,
      label: t("docs"),
      href: "/docs",
      description: "Read the docs",
    },
    {
      icon: Users,
      label: t("community"),
      href: "https://discord.gg/openeos",
      description: "Join Discord",
    },
  ];

  return (
    <section
      id="open-source"
      className="py-20 md:py-32 bg-gradient-to-b from-transparent via-brand-50/50 to-transparent dark:from-transparent dark:via-brand-950/20 dark:to-transparent"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/50 mb-6"
          >
            <Github className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-display-sm md:text-display-md font-semibold text-primary"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-tertiary"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 px-6 py-4 bg-primary rounded-xl border border-primary hover:border-brand-200 dark:hover:border-brand-800 transition-colors w-full sm:w-auto"
              >
                <link.icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                <span className="font-semibold text-primary">{link.label}</span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
