import { LegalDocumentPage, legalMetadata } from "@/components/legal/LegalDocumentPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return legalMetadata("agb", await params);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <LegalDocumentPage doc="agb" locale={locale} />;
}
