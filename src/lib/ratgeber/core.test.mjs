/*
 * Tests fuer den Ratgeber (node --test, ohne weitere Abhaengigkeiten):
 * `pnpm test`. Prueft Kopf, Reihenfolge und den sicheren Renderer — und
 * dass jeder echte Artikel unter content/ratgeber/de sich lesen laesst.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, describe, test } from "node:test";

import { listArticles, parseArticle, parseFrontmatter, readingMinutes } from "./core.mjs";
import { renderArticle } from "./render.mjs";

const LABELS = { table: "Tabelle", newTab: "öffnet in neuem Tab" };

const head = (fields) =>
  `---\n${Object.entries(fields)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n")}\n---\n`;
const valid = { title: "T", description: "D", date: "2026-11-19", author: "A", tags: ["Steuern"] };

/* core.mjs liest content/ratgeber/de relativ zum Arbeitsverzeichnis beim
   Import — fuer die Liste ein eigenes Verzeichnis mit erfundenen Artikeln
   und eine zweite Instanz des Moduls (?tmp). */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ratgeber-core-"));
const tmpDir = path.join(tmp, "content", "ratgeber", "de");
after(() => fs.rmSync(tmp, { recursive: true, force: true }));
const cwd = process.cwd();
process.chdir(tmp);
const tmpCore = await import("./core.mjs?tmp");
process.chdir(cwd);

describe("Kopf", () => {
  test("liest Texte und Listen", () => {
    const { data, body } = parseFrontmatter(`${head(valid)}\nText\n`);
    assert.deepEqual(data, valid);
    assert.equal(body, "\nText\n");
  });

  test("ohne Kopf, mit fehlendem Feld oder falschem Datum: Fehler", () => {
    assert.throws(() => parseArticle("a", "Text"), /Kopf/);
    assert.throws(() => parseArticle("a", head({ ...valid, author: "" })), /author/);
    assert.throws(() => parseArticle("a", head({ ...valid, date: "19.11.2026" })), /JJJJ-MM-TT/);
    assert.throws(() => parseArticle("a", head({ ...valid, tags: "Steuern" })), /tags/);
    assert.throws(() => parseArticle("Gross_Schrift", head(valid)), /Dateiname/);
  });

  test("Lesezeit: 200 Woerter pro Minute, mindestens 1", () => {
    assert.equal(readingMinutes("kurz"), 1);
    assert.equal(readingMinutes(Array(401).fill("wort").join(" ")), 3);
  });
});

describe("Liste", () => {
  test("ohne Verzeichnis: leer", () => {
    assert.deepEqual(tmpCore.listArticles(), []);
  });

  test("neueste zuerst, unbekannte Adresse → null", () => {
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(path.join(tmpDir, "alt.md"), head({ ...valid, date: "2026-01-01" }));
    fs.writeFileSync(path.join(tmpDir, "neu.md"), head({ ...valid, date: "2026-12-24" }));
    fs.writeFileSync(path.join(tmpDir, "notiz.txt"), "kein Artikel");
    assert.deepEqual(
      tmpCore.listArticles().map((a) => a.slug),
      ["neu", "alt"],
    );
    assert.equal(tmpCore.getArticle("neu").date, "2026-12-24");
    assert.equal(tmpCore.getArticle("fehlt"), null);
    assert.equal(tmpCore.getArticle("../alt"), null);
  });
});

describe("Renderer", () => {
  test("HTML im Markdown wird Text, unsichere Links verschwinden", () => {
    const { html } = renderArticle(
      '<script>alert(1)</script>\n\nA <img src=x onerror="alert(1)"> [x](javascript:alert(1)) [y](//evil.example)\n',
      LABELS,
    );
    assert.doesNotMatch(html, /<script|<img|href="javascript|href="\/\//);
    assert.match(html, /&lt;script&gt;/);
  });

  test("externe Links in neuem Tab, eigene nicht", () => {
    const { html } = renderArticle("[a](https://example.org) [b](/faq#tse)", LABELS);
    assert.match(html, /<a href="https:\/\/example.org" target="_blank" rel="noopener noreferrer">a<span class="sr-only"> \(öffnet in neuem Tab\)<\/span><\/a>/);
    assert.match(html, /<a href="\/faq#tse">b<\/a>/);
  });

  test("Kurz-gesagt-Kasten, Tabelle, Inhaltsverzeichnis aus h2", () => {
    const { html, toc } = renderArticle(
      "# Eins\n\n> **Kurz gesagt**\n> - Punkt\n\n## Zwei\n\n## Zwei\n\n### Drei\n\n| A | B |\n|---|---|\n| 1 | 2 |\n",
      LABELS,
    );
    assert.doesNotMatch(html, /<h1/);
    assert.match(html, /<aside class="ratgeber-callout" aria-label="Kurz gesagt">\n<p class="ratgeber-callout__title">Kurz gesagt<\/p>\n<ul>/);
    assert.match(html, /<div class="ratgeber-table" role="region" tabindex="0" aria-label="Tabelle"><table>/);
    assert.deepEqual(toc, [
      { id: "eins", text: "Eins" },
      { id: "zwei", text: "Zwei" },
      { id: "zwei-2", text: "Zwei" },
    ]);
  });
});

describe("Artikel im Repo", () => {
  test("alle lesbar, mit Inhaltsverzeichnis", () => {
    const articles = listArticles();
    assert.ok(articles.length > 0);
    for (const article of articles) {
      const { toc } = renderArticle(article.body, LABELS);
      assert.ok(toc.length > 0, `${article.slug}: keine Zwischenueberschriften (##)`);
    }
  });
});
