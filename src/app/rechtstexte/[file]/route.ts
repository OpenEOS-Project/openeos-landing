import { currentVersion, isLegalDoc, legalPdfPath } from "@/lib/legal";

/*
 * /rechtstexte/<doc>.pdf — PDF der aktuellen Fassung.
 *
 * Gebaut werden nur die PDFs je Fassung (public/rechtstexte/<doc>-<fassung>.pdf,
 * scripts/build-legal.mjs); die liefert Next direkt aus. Die Adresse ohne
 * Fassung leitet hier zur Laufzeit weiter, damit sie ab dem Datum einer
 * kuenftigen Fassung ohne neuen Deploy auf diese zeigt.
 */
export const dynamic = "force-dynamic";

const FILE_RE = /^([a-z]+)\.pdf$/;

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const doc = FILE_RE.exec(file)?.[1];
  const version = doc && isLegalDoc(doc) ? currentVersion(doc) : null;
  if (!doc || !isLegalDoc(doc) || !version) {
    return new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return new Response(null, {
    status: 307,
    headers: {
      /* Relativ: hinter dem Proxy kennt der Server seinen oeffentlichen Host nicht sicher. */
      Location: legalPdfPath(doc, version),
      "Cache-Control": "public, max-age=300",
    },
  });
}
