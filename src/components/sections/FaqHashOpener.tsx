"use client";

import { useEffect } from "react";

/**
 * Sprungmarken der FAQ-Seite.
 *
 * Zeigt die Adresse auf eine Frage (/faq#bargeldlos), klappt sie auf; zeigt
 * sie auf einen Abschnitt (/faq#tse), klappt dessen erste Frage auf. Das
 * gilt beim Laden und bei Links innerhalb der Seite. Klappt jemand selbst
 * eine Frage auf, bekommt die Adresse deren Sprungmarke — so lässt sie
 * sich direkt weitergeben.
 */
export function FaqHashOpener() {
  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      const details =
        target instanceof HTMLDetailsElement
          ? target
          : target.hasAttribute("data-faq-section")
            ? target.querySelector<HTMLDetailsElement>("details.faq__item")
            : null;
      if (!details) return;

      details.open = true;
      // Erst nach dem Aufklappen ausrichten; Abstand zur Navigation über
      // scroll-margin-top im CSS.
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    };

    const rememberOpened = (event: MouseEvent) => {
      const summary = (event.target as Element | null)?.closest("summary");
      const details = summary?.parentElement;
      if (!(details instanceof HTMLDetailsElement) || !details.classList.contains("faq__item")) return;
      // Der Klick klappt gleich auf (war also zu): Sprungmarke übernehmen.
      if (!details.open && details.id) {
        window.history.replaceState(window.history.state, "", `#${details.id}`);
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    document.addEventListener("click", rememberOpened);
    return () => {
      window.removeEventListener("hashchange", openFromHash);
      document.removeEventListener("click", rememberOpened);
    };
  }, []);

  return null;
}
