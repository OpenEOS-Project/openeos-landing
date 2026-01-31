import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { locales } from "@/i18n/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
      <body className={`${inter.variable} antialiased bg-primary text-primary`}>
        <ThemeProvider
          attribute="class"
          value={{ light: "light-mode", dark: "dark-mode" }}
          enableSystem
          defaultTheme="system"
        >
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
