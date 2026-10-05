import { defaultLocale } from "@/i18n/config";
import { SiteShell } from "@/components/layout/SiteShell";
import { NotFoundContent } from "@/components/NotFoundContent";

/*
 * 404 fuer Adressen, die zu keiner Sprache gehoeren (z. B. /irgendwas.php:
 * Pfade mit Punkt laufen an der Middleware vorbei, das Sprach-Layout lehnt
 * sie ab). Das Wurzel-Layout reicht nur durch, also bringt diese Seite
 * <html> selbst mit — in der Standardsprache, eine andere ist nicht bekannt.
 */
export default async function RootNotFound() {
  const messages = (await import(`../../messages/${defaultLocale}.json`)).default;
  return (
    <SiteShell locale={defaultLocale} messages={messages}>
      <NotFoundContent />
    </SiteShell>
  );
}
