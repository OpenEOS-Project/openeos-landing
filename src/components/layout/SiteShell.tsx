import type { ReactNode } from "react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { ThemeProvider } from "next-themes";
import { ContactModalProvider } from "@/providers/contact-modal";
import { fontVariables } from "@/lib/fonts";

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
    <html lang={locale} suppressHydrationWarning>
      <body className={`${fontVariables} antialiased`}>
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
