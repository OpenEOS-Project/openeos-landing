import { Geist, JetBrains_Mono, Archivo_Black } from "next/font/google";

/* Eigene Datei, weil zwei Wurzeln sie brauchen: das Sprach-Layout und
   die 404 fuer Adressen ausserhalb jeder Sprache (app/not-found.tsx). */
const geist = Geist({
  variable: "--f-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--f-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const archivoBlack = Archivo_Black({
  variable: "--f-display",
  subsets: ["latin"],
  weight: ["400"],
});

export const fontVariables = `${geist.variable} ${jetbrainsMono.variable} ${archivoBlack.variable}`;
