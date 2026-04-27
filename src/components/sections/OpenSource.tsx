import { useTranslations } from "next-intl";
import { Github, BookOpen, Users } from "lucide-react";

export function OpenSource() {
  const t = useTranslations("openSource");

  return (
    <section className="oss" id="open-source">
      <div className="oss__centered">
        <span className="oss__icon" aria-hidden="true">
          <Github />
        </span>
        <h2 className="section-title section-title--light">
          <span>{t("titleL1")}</span>
          <span className="u-accent-light">{t("titleL2")}</span>
        </h2>
        <p className="oss__body">{t("body")}</p>
        <div className="oss__links">
          <a
            href="https://github.com/OpenEOS-Project"
            target="_blank"
            rel="noopener noreferrer"
            className="oss-card"
          >
            <Github />
            <span>{t("ctaGithub")}</span>
          </a>
          <a href="#" className="oss-card">
            <BookOpen />
            <span>{t("ctaDocs")}</span>
          </a>
          <a
            href="https://discord.gg/openeos"
            target="_blank"
            rel="noopener noreferrer"
            className="oss-card"
          >
            <Users />
            <span>{t("ctaCommunity")}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
