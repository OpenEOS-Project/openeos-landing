import { LegalDocumentPage, legalMetadata, legalVersionParams } from "@/components/legal/LegalDocumentPage";

type Props = { params: Promise<{ locale: string; version: string }> };

/* Nur vorhandene Fassungen; jede andere Adresse ist eine 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return legalVersionParams("avv");
}

export async function generateMetadata({ params }: Props) {
  return legalMetadata("avv", await params);
}

export default async function Page({ params }: Props) {
  const { locale, version } = await params;
  return <LegalDocumentPage doc="avv" locale={locale} version={version} />;
}
