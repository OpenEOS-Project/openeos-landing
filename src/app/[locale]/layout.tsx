import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Archivo_Black } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { locales } from "@/i18n/config";

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const metadata = messages.metadata as { title: string; description: string };

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geist.variable} ${jetbrainsMono.variable} ${archivoBlack.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          value={{ light: "light-mode", dark: "dark-mode" }}
          forcedTheme="light"
        >
          <NextIntlClientProvider messages={messages}>
            <div className="landing">
              <div className="grain" aria-hidden="true" />
              {children}
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
