import { LegalDocumentPage, legalMetadata, legalVersionParams } from "@/components/legal/LegalDocumentPage";

type Props = { params: Promise<{ locale: string; version: string }> };

/* Nur vorhandene Fassungen; jede andere Adresse ist eine 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return legalVersionParams("datenschutz");
}

export async function generateMetadata({ params }: Props) {
  return legalMetadata("datenschutz", await params);
}

export default async function Page({ params }: Props) {
  const { locale, version } = await params;
  return <LegalDocumentPage doc="datenschutz" locale={locale} version={version} />;
}
