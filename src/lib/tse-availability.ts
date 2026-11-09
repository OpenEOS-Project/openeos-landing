/*
 * Cloud-TSE (Bargeld in Deutschland): schon buchbar oder „Bald verfügbar“?
 *
 * Kommt beim Bauen ins Image (NEXT_PUBLIC_*), wie SITE_ENV in site.ts:
 * Produktion (main) baut mit "true", Staging (dev) mit "false" — gesetzt
 * in .github/workflows/build-deploy.yaml. Nur "true" schaltet auf „Bald
 * verfügbar“; fehlt die Angabe (lokal, CI), gilt die Cloud-TSE als
 * verfügbar.
 *
 * Betroffen sind Preise, das Feature „Zahlung“ und die FAQ (#tse). Die
 * Rechtstexte bleiben, wie sie sind.
 */
export const tseComingSoon = process.env.NEXT_PUBLIC_TSE_COMING_SOON === "true";
