"use client";

import { Printer } from "lucide-react";

/** Druckt die Seite; die Druckansicht blendet Kopf, Fuss und Knoepfe aus. */
export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className="btn btn--ghost" onClick={() => window.print()}>
      <Printer aria-hidden="true" />
      {label}
    </button>
  );
}
