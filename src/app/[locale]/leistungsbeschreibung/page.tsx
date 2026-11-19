import { LegalDocumentPage, legalMetadata } from "@/components/legal/LegalDocumentPage";

/* Anlage 1 zu den AGB. Erscheint erst, wenn eine Fassung unter
   content/legal/de/leistungsbeschreibung/<JJJJ-MM-TT>.md liegt — vorher
   ist die Adresse eine 404 (siehe OPTIONAL_LEGAL_DOCS in lib/legal). */

type Props = { params: Promise<{ locale: string }> };

/* Neu erzeugen, damit eine kuenftige Fassung an ihrem Datum aktuell wird
   (ohne neuen Deploy). Wert muss hier als Zahl stehen (Next). */
export const revalidate = 300;

export async function generateMetadata({ params }: Props) {
  return legalMetadata("leistungsbeschreibung", await params);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <LegalDocumentPage doc="leistungsbeschreibung" locale={locale} />;
}
