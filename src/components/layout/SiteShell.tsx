import type { ReactNode } from "react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { ThemeProvider } from "next-themes";
import { ContactModalProvider } from "@/providers/contact-modal";
import { openEosFonts } from "@openeos/ui/fonts";

/** <html> bis .landing — geteilt vom Sprach-Layout und der Wurzel-404. */
export function SiteShell({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: AbstractIntlMessages;
  children: ReactNode;
}) {
  return (
    /* Geist und JetBrains Mono aus @openeos/ui —
       lokal eingebunden (next/font/local), ohne Anfrage bei Google. Am
       <html>, damit auch die Tailwind-Variablen in :root (theme.css) die
       --font-oe-* sehen; landing.css verbindet sie mit den --f-*-Namen. */
    <html lang={locale} className={openEosFonts.className} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          value={{ light: "light-mode", dark: "dark-mode" }}
          forcedTheme="light"
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {/* Provider INSIDE .landing — das Modal rendert als Kind des Providers
                und braucht den .landing-Scope, sonst greifen seine CSS-Regeln nicht */}
            <div className="landing">
              <div className="grain" aria-hidden="true" />
              <ContactModalProvider>{children}</ContactModalProvider>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
