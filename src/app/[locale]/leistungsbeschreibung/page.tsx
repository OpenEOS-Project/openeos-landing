import { LegalDocumentPage, legalMetadata } from "@/components/legal/LegalDocumentPage";

/* Anlage 1 zu den AGB. Erscheint erst, wenn eine Fassung unter
   content/legal/de/leistungsbeschreibung/<JJJJ-MM-TT>.md liegt — vorher
   ist die Adresse eine 404 (siehe OPTIONAL_LEGAL_DOCS in lib/legal). */

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return legalMetadata("leistungsbeschreibung", await params);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <LegalDocumentPage doc="leistungsbeschreibung" locale={locale} />;
}
