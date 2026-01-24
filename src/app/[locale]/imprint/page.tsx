import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImprintContent />
        </div>
      </main>
      <Footer />
    </>
  );
}

function ImprintContent() {
  const t = useTranslations("imprint");

  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <h1 className="text-display-sm font-semibold text-primary mb-8">
        {t("title")}
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("responsible.title")}
        </h2>
        <p className="text-tertiary whitespace-pre-line">{t("responsible.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("contact.title")}
        </h2>
        <p className="text-tertiary whitespace-pre-line">{t("contact.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("disclaimer.title")}
        </h2>
        <h3 className="text-lg font-medium text-secondary mb-2">
          {t("disclaimer.liability.title")}
        </h3>
        <p className="text-tertiary mb-4">{t("disclaimer.liability.content")}</p>

        <h3 className="text-lg font-medium text-secondary mb-2">
          {t("disclaimer.links.title")}
        </h3>
        <p className="text-tertiary">{t("disclaimer.links.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("copyright.title")}
        </h2>
        <p className="text-tertiary">{t("copyright.content")}</p>
      </section>
    </article>
  );
}
