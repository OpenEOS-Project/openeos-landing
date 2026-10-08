import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return pageMetadata({ locale, path: "/terms", title: `${t("title")} — OpenEOS` });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="legal">
        <div className="page-wrap">
          <TermsContent />
        </div>
      </main>
      <Footer />
    </>
  );
}

function TermsContent() {
  const t = useTranslations("terms");

  return (
    <article className="legal__article prose prose-gray dark:prose-invert">
      <h1 className="text-display-sm font-semibold text-primary mb-4">
        {t("title")}
      </h1>
      <p className="text-tertiary mb-8">{t("lastUpdated")}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("scope.title")}
        </h2>
        <p className="text-tertiary">{t("scope.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("services.title")}
        </h2>
        <p className="text-tertiary whitespace-pre-line">{t("services.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("registration.title")}
        </h2>
        <p className="text-tertiary whitespace-pre-line">{t("registration.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("pricing.title")}
        </h2>
        <p className="text-tertiary whitespace-pre-line">{t("pricing.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("payment.title")}
        </h2>
        <p className="text-tertiary whitespace-pre-line">{t("payment.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("obligations.title")}
        </h2>
        <p className="text-tertiary whitespace-pre-line">{t("obligations.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("liability.title")}
        </h2>
        <p className="text-tertiary whitespace-pre-line">{t("liability.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("termination.title")}
        </h2>
        <p className="text-tertiary whitespace-pre-line">{t("termination.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("changes.title")}
        </h2>
        <p className="text-tertiary">{t("changes.content")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          {t("jurisdiction.title")}
        </h2>
        <p className="text-tertiary">{t("jurisdiction.content")}</p>
      </section>
    </article>
  );
}
