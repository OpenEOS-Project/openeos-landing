import { LegalDocumentPage, legalMetadata } from "@/components/legal/LegalDocumentPage";

type Props = { params: Promise<{ locale: string }> };

/* Neu erzeugen, damit eine kuenftige Fassung an ihrem Datum aktuell wird
   (ohne neuen Deploy). Wert muss hier als Zahl stehen (Next). */
export const revalidate = 300;

export async function generateMetadata({ params }: Props) {
  return legalMetadata("impressum", await params);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <LegalDocumentPage doc="impressum" locale={locale} />;
}
