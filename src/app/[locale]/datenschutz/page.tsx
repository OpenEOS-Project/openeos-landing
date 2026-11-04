import { LegalDocumentPage, legalMetadata } from "@/components/legal/LegalDocumentPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return legalMetadata("datenschutz", await params);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <LegalDocumentPage doc="datenschutz" locale={locale} />;
}
