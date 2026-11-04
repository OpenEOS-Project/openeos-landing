import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* Die Rechtstexte stehen unter ihren deutschen Adressen (/agb, /avv,
     /datenschutz, /impressum) — andere Teile von OpenEOS verlinken
     darauf. Die frueheren englischen Routen leiten dauerhaft weiter,
     auch mit Sprache (/en/terms) und Fassung (/terms/2026-11-04). */
  async redirects() {
    const moved: [string, string][] = [
      ["terms", "agb"],
      ["privacy", "datenschutz"],
      ["imprint", "impressum"],
    ];
    return moved.flatMap(([from, to]) => [
      { source: `/${from}/:path*`, destination: `/${to}/:path*`, permanent: true },
      { source: `/en/${from}/:path*`, destination: `/en/${to}/:path*`, permanent: true },
    ]);
  },

  output: "standalone",
  // @openeos/ui liefert das Font-Modul als TypeScript-Quelle aus; die
  // next/font/local-Aufrufe darin muessen von Next selbst kompiliert werden.
  transpilePackages: ["@openeos/ui"],
};

export default withNextIntl(nextConfig);
