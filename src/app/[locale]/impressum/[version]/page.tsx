import { LegalDocumentPage, legalMetadata, legalVersionParams } from "@/components/legal/LegalDocumentPage";

type Props = { params: Promise<{ locale: string; version: string }> };

/* Nur vorhandene Fassungen; jede andere Adresse ist eine 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return legalVersionParams("impressum");
}

export async function generateMetadata({ params }: Props) {
  return legalMetadata("impressum", await params);
}

export default async function Page({ params }: Props) {
  const { locale, version } = await params;
  return <LegalDocumentPage doc="impressum" locale={locale} version={version} />;
}
