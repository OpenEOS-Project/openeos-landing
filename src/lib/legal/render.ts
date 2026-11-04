import { Marked, Renderer, type Tokens } from "marked";
import { clauseId, clauseNumber, headingAliases, plainText, slugify } from "./core.mjs";

export type TocEntry = { id: string; text: string; depth: number };

export type RenderedLegal = { html: string; toc: TocEntry[] };

type Labels = {
  /** Beschriftung des #-Links einer Ziffer, z. B. „Link zu Ziffer 4.6“. */
  clauseAnchor: (number: string) => string;
  /** Beschriftung des #-Links einer Ueberschrift. */
  headingAnchor: (text: string) => string;
  /** Beschriftung einer scrollbaren Tabelle. */
  table: string;
};

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function anchor(id: string, label: string) {
  return `<a class="legal-anchor" href="#${id}" aria-label="${escapeAttr(label)}">#</a>`;
}

/**
 * Markdown eines Rechtstexts → HTML (serverseitig, beim Bauen).
 *
 * Jede Ueberschrift bekommt eine Sprungmarke aus ihrem Text, Anhaenge,
 * Teile und Ziffern-Ueberschriften zusaetzlich eine kurze („anhang-b“,
 * „teil-a“, „ziffer-4“). Absaetze, die mit einer fetten Nummer beginnen
 * („**4.6**“), bekommen „ziffer-4-6“ und einen sichtbaren #-Link.
 */
export function renderLegal(source: string, labels: Labels): RenderedLegal {
  const used = new Set<string>();
  const toc: TocEntry[] = [];
  let seenTitle = false;
  const unique = (base: string) => {
    let id = base || "abschnitt";
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    return id;
  };

  const marked = new Marked({ gfm: true, breaks: true });
  marked.use({
    renderer: {
      heading(this: Renderer, token: Tokens.Heading) {
        const text = plainText(token.text);
        const id = unique(slugify(text));
        const aliases = headingAliases(text)
          .filter((a) => !used.has(a))
          .map((a) => {
            used.add(a);
            return `<span id="${a}" class="legal-alias" aria-hidden="true"></span>`;
          })
          .join("");
        /* Der Titel (erste Ueberschrift) gehoert nicht ins Inhaltsverzeichnis. */
        if (token.depth <= 2 && seenTitle) toc.push({ id, text, depth: token.depth });
        seenTitle = true;
        const inner = this.parser.parseInline(token.tokens);
        return `<h${token.depth} id="${id}">${aliases}${inner} ${anchor(id, labels.headingAnchor(text))}</h${token.depth}>\n`;
      },
      paragraph(this: Renderer, token: Tokens.Paragraph) {
        const inner = this.parser.parseInline(token.tokens);
        const classes: string[] = [];
        /* Eingerueckte Absaetze („   a) …“) sind Aufzaehlungen einer Ziffer. */
        if (/^[ \t]+\S/.test(token.raw)) classes.push("legal-sub");
        const number = clauseNumber(token.raw);
        let idAttr = "";
        let link = "";
        if (number) {
          const id = unique(clauseId(number));
          idAttr = ` id="${id}"`;
          link = anchor(id, labels.clauseAnchor(number));
          classes.push("legal-clause");
        }
        const cls = classes.length ? ` class="${classes.join(" ")}"` : "";
        return `<p${idAttr}${cls}>${link}${inner}</p>\n`;
      },
      table(this: Renderer, token: Tokens.Table) {
        const html = Renderer.prototype.table.call(this, token);
        return `<div class="legal-table" role="region" tabindex="0" aria-label="${escapeAttr(labels.table)}">${html}</div>\n`;
      },
      link(this: Renderer, token: Tokens.Link) {
        const html = Renderer.prototype.link.call(this, token);
        return /^https?:/.test(token.href) ? html.replace("<a ", '<a rel="noopener noreferrer" ') : html;
      },
    },
  });

  const html = marked.parse(source, { async: false });
  return { html, toc };
}
