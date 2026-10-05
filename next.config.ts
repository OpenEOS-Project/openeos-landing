import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* Deutsche Adressen fuer die Rechtstexte.
     Die Routen heissen englisch (privacy, imprint, terms). Wer die
     deutsche Adresse eintippt — und in Impressumsangaben steht sie oft —
     landete bisher auf einer 404. */
  async redirects() {
    return [
      { source: '/datenschutz', destination: '/privacy', permanent: true },
      { source: '/impressum', destination: '/imprint', permanent: true },
      { source: '/agb', destination: '/terms', permanent: true },
    ];
  },

  output: "standalone",
  // @openeos/ui liefert das Font-Modul als TypeScript-Quelle aus; die
  // next/font/local-Aufrufe darin muessen von Next selbst kompiliert werden.
  transpilePackages: ["@openeos/ui"],
};

export default withNextIntl(nextConfig);
