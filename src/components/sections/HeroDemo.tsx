"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type CatalogItem = { n: string; p: number; c: number };

const CATALOG: CatalogItem[] = [
  { n: "Pils 0,5", p: 4.5, c: 145 },
  { n: "Weizen 0,5", p: 4.8, c: 145 },
  { n: "Radler", p: 4.5, c: 145 },
  { n: "Spezi", p: 3.5, c: 60 },
  { n: "Apfelschorle", p: 3.5, c: 60 },
  { n: "Wasser", p: 3.0, c: 60 },
  { n: "Bratwurst", p: 5.0, c: 20 },
  { n: "Steak", p: 7.5, c: 20 },
  { n: "Pommes", p: 4.0, c: 20 },
];

type ReceiptItem = { id: number; qty: number; name: string; sum: number };

function fmt(value: number) {
  return value.toFixed(2).replace(".", ",") + " €";
}

function nowLabel() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function HeroDemo() {
  const t = useTranslations("hero");

  const [pickedIdx, setPickedIdx] = useState(-1);
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [total, setTotal] = useState(0);
  const [receiptNo, setReceiptNo] = useState(421);
  const [time, setTime] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const itemIdRef = useRef(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => {
        if (cancelledRef.current) return;
        fn();
      }, delay);
      timersRef.current.push(id);
    };

    const cycle = () => {
      if (cancelledRef.current) return;
      setReceiptNo((n) => n + 1);
      setTotal(0);
      setItems([]);
      setPickedIdx(-1);
      setPaid(false);
      setTime(nowLabel());

      const itemCount = 2 + Math.floor(Math.random() * 4);
      let i = 0;
      let runningTotal = 0;

      const tick = () => {
        if (cancelledRef.current) return;
        if (i >= itemCount) {
          setPaid(true);
          schedule(cycle, 2200);
          return;
        }
        const pick = CATALOG[Math.floor(Math.random() * CATALOG.length)];
        const qty = Math.random() < 0.3 ? 2 : 1;
        const sum = pick.p * qty;
        runningTotal += sum;
        const pickedIndex = CATALOG.indexOf(pick);

        itemIdRef.current += 1;
        const newItem: ReceiptItem = {
          id: itemIdRef.current,
          qty,
          name: pick.n,
          sum,
        };

        setPickedIdx(pickedIndex);
        setTotal(runningTotal);
        setItems((prev) => {
          const next = [...prev, newItem];
          return next.length > 6 ? next.slice(next.length - 6) : next;
        });

        i++;
        schedule(tick, 650 + Math.random() * 500);
      };

      schedule(tick, 400);
    };

    schedule(cycle, 200);

    return () => {
      cancelledRef.current = true;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  return (
    <div className="hero__stage">
      <div className="device" aria-hidden="true">
        <div className="device__bar">
          <span className="device__dot" />
          <span className="device__dot" />
          <span className="device__dot" />
          <span className="device__url">openeos · kasse.bar</span>
        </div>
        <div className="device__screen">
          <div className="ds__hd">
            <b>● {t("devicePicker")}</b>
            <span>{t("deviceLocation")}</span>
          </div>
          <div className="ds__grid">
            {CATALOG.map((it, i) => (
              <button
                key={it.n}
                type="button"
                tabIndex={-1}
                className={`ds__btn ${i === pickedIdx ? "is-picked" : ""}`}
                style={{ ["--c" as string]: it.c }}
              >
                <b>{it.n}</b>
                <span>{it.p.toFixed(2).replace(".", ",")} €</span>
              </button>
            ))}
          </div>
          <div className="ds__sum">
            <span>{t("receiptTotal")}</span>
            <b>{fmt(total)}</b>
          </div>
        </div>
      </div>

      <div className="receipt" aria-hidden="true">
        <div className="receipt__head">
          <strong>OpenEOS</strong>
        </div>
        <div className="receipt__meta">
          <span>{time ?? "—"}</span>
          <span>#{String(receiptNo).padStart(4, "0")}</span>
        </div>
        <ul className="receipt__items">
          {items.map((it) => (
            <li key={it.id} className="is-adding">
              <span className="qty">{it.qty}×</span>
              <b>{it.name}</b>
              <span>{fmt(it.sum)}</span>
            </li>
          ))}
        </ul>
        <div className="receipt__sum">
          <span>{t("receiptTotal")}</span>
          <span>{fmt(total)}</span>
        </div>
        <div
          className="receipt__pay"
          style={paid ? { color: "var(--green-ink)" } : undefined}
        >
          {paid ? "✓ BEZAHLT · SumUp" : "— SumUp · Kontaktlos —"}
        </div>
        <div className="receipt__foot">openeos.de · danke! 🍻</div>
      </div>
    </div>
  );
}
