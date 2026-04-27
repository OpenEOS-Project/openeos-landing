"use client";

import { useEffect, useRef, useState } from "react";

const LINES: string[] = [
  '<span class="c"># install</span>',
  '<span class="p">$</span> git clone <span class="v">github.com/OpenEOS-Project/openeos-api</span>',
  '<span class="c">Cloning into \'openeos-api\'...</span>',
  '<span class="p">$</span> cd openeos-api && docker compose up -d',
  '<span class="ok">✓</span> <span class="c">postgres</span> started',
  '<span class="ok">✓</span> <span class="c">redis</span> started',
  '<span class="ok">✓</span> <span class="c">openeos-api</span> on :<span class="v">3000</span>',
  '<span class="ok">✓</span> <span class="c">openeos-web</span> on :<span class="v">3001</span>',
  '<span class="ok">✓</span> <span class="c">openeos-printer-agent</span> connected',
  "",
  '<span class="p">$</span> openeos event create <span class="v">"Sommerfest 2026"</span>',
  '<span class="ok">✓</span> event <span class="v">evt_8f2a</span> ready · 🍻',
];

export function Terminal() {
  const [visible, setVisible] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    let i = 0;

    const step = () => {
      if (cancelledRef.current) return;
      if (i >= LINES.length) {
        timerRef.current = setTimeout(() => {
          i = 0;
          setVisible(0);
          step();
        }, 4000);
        return;
      }
      i += 1;
      setVisible(i);
      timerRef.current = setTimeout(step, 500 + Math.random() * 400);
    };

    timerRef.current = setTimeout(step, 400);

    return () => {
      cancelledRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <pre className="term__body" aria-hidden="true">
      {LINES.slice(0, visible).map((line, idx) => (
        <div
          key={idx}
          dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
        />
      ))}
    </pre>
  );
}
