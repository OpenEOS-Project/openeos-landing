/** Der Pfeil aus "Kostenlos starten" — ein Zeichen fuer alle Schaltflaechen,
 *  statt mal SVG, mal "→" aus der Schrift. */
export function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M5 10h10M10 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="square"
      />
    </svg>
  );
}
