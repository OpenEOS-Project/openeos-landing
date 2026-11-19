/*
 * Tests fuer die Auswahl der aktuellen Fassung (node --test, ohne
 * weitere Abhaengigkeiten): `pnpm test`.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, describe, test } from "node:test";

/* core.mjs liest content/legal/de relativ zum Arbeitsverzeichnis — fuer die
   Tests ein eigenes Verzeichnis mit erfundenen Fassungen. */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "legal-core-"));
const files = {
  agb: ["2026-11-18", "2027-01-01", "2026-12-01"],
  avv: ["2026-11-18"],
  leistungsbeschreibung: ["2027-03-01"],
  impressum: ["2026-11-12"],
  /* Pflichtdokument ohne Fassung: nicht verfuegbar (der Bau bricht ab). */
  datenschutz: [],
};
for (const [doc, versions] of Object.entries(files)) {
  fs.mkdirSync(path.join(tmp, "content", "legal", "de", doc), { recursive: true });
  for (const v of versions) fs.writeFileSync(path.join(tmp, "content", "legal", "de", doc, `${v}.md`), `# ${doc}\n`);
}
fs.writeFileSync(path.join(tmp, "content", "legal", "de", "agb", "notiz.md"), "keine Fassung\n");
const cwd = process.cwd();
process.chdir(tmp);
const core = await import("./core.mjs");
process.chdir(cwd);
after(() => fs.rmSync(tmp, { recursive: true, force: true }));

/* Zeitpunkt in UTC → Kalendertag in Berlin. */
const at = (iso) => new Date(iso);

describe("legalToday (Europe/Berlin)", () => {
  test("Winterzeit: Mitternacht in Berlin ist 23:00 UTC", () => {
    assert.equal(core.legalToday(at("2026-12-31T22:59:59Z")), "2026-12-31");
    assert.equal(core.legalToday(at("2026-12-31T23:00:00Z")), "2027-01-01");
  });

  test("Sommerzeit: Mitternacht in Berlin ist 22:00 UTC", () => {
    assert.equal(core.legalToday(at("2027-07-14T21:59:59Z")), "2027-07-14");
    assert.equal(core.legalToday(at("2027-07-14T22:00:00Z")), "2027-07-15");
  });

  test("unabhaengig von der Zeitzone des Servers", () => {
    const saved = process.env.TZ;
    try {
      for (const tz of ["UTC", "America/Los_Angeles", "Pacific/Kiritimati"]) {
        process.env.TZ = tz;
        assert.equal(core.legalToday(at("2026-12-31T23:30:00Z")), "2027-01-01", tz);
        assert.equal(core.legalToday(at("2026-12-31T12:00:00Z")), "2026-12-31", tz);
      }
    } finally {
      if (saved === undefined) delete process.env.TZ;
      else process.env.TZ = saved;
    }
  });
});

describe("splitVersions", () => {
  const versions = ["2026-11-18", "2027-01-01", "2026-12-01", "2026-01-01"];

  test("aktuell ist die neueste Fassung mit Datum <= heute", () => {
    assert.deepEqual(core.splitVersions(versions, "2026-12-15"), {
      current: "2026-12-01",
      upcoming: ["2027-01-01"],
      archived: ["2026-11-18", "2026-01-01"],
    });
  });

  test("am Stichtag selbst gilt die neue Fassung, am Vortag noch nicht", () => {
    assert.equal(core.splitVersions(versions, "2026-11-30").current, "2026-11-18");
    assert.deepEqual(core.splitVersions(versions, "2026-11-30").upcoming, ["2026-12-01", "2027-01-01"]);
    assert.equal(core.splitVersions(versions, "2026-12-01").current, "2026-12-01");
    assert.equal(core.splitVersions(versions, "2027-01-01").current, "2027-01-01");
    assert.deepEqual(core.splitVersions(versions, "2027-01-01").upcoming, []);
  });

  test("nur kuenftige Fassungen: keine aktuelle", () => {
    assert.deepEqual(core.splitVersions(["2027-03-01", "2027-02-01"], "2026-12-01"), {
      current: null,
      upcoming: ["2027-02-01", "2027-03-01"],
      archived: [],
    });
  });

  test("keine Fassungen", () => {
    assert.deepEqual(core.splitVersions([], "2026-12-01"), { current: null, upcoming: [], archived: [] });
  });
});

describe("versionStatus", () => {
  test("aktuell, kuenftig, archiviert", () => {
    assert.equal(core.versionStatus("2026-12-01", "2026-12-01", "2026-12-15"), "current");
    assert.equal(core.versionStatus("2027-01-01", "2026-12-01", "2026-12-15"), "upcoming");
    assert.equal(core.versionStatus("2026-11-18", "2026-12-01", "2026-12-15"), "archived");
    assert.equal(core.versionStatus("2027-03-01", null, "2026-12-15"), "upcoming");
  });
});

describe("Fassungen aus content/legal/de", () => {
  test("listVersions: nur JJJJ-MM-TT.md, neueste zuerst (auch kuenftige)", () => {
    assert.deepEqual(core.listVersions("agb"), ["2027-01-01", "2026-12-01", "2026-11-18"]);
  });

  test("currentVersion folgt dem Berliner Kalendertag", () => {
    assert.equal(core.currentVersion("agb", at("2026-11-30T22:59:59Z")), "2026-11-18");
    assert.equal(core.currentVersion("agb", at("2026-11-30T23:00:00Z")), "2026-12-01");
    assert.equal(core.currentVersion("agb", at("2027-06-01T10:00:00Z")), "2027-01-01");
    assert.deepEqual(core.upcomingVersions("agb", at("2026-11-20T10:00:00Z")), ["2026-12-01", "2027-01-01"]);
  });

  test("vor der ersten Fassung gibt es keine aktuelle", () => {
    assert.equal(core.currentVersion("agb", at("2026-11-17T12:00:00Z")), null);
  });

  test("Dokument nur mit kuenftiger Fassung ist noch nicht verfuegbar", () => {
    const before = at("2027-02-28T12:00:00Z");
    assert.equal(core.currentVersion("leistungsbeschreibung", before), null);
    assert.equal(core.hasLegalDoc("leistungsbeschreibung", before), false);
    assert.deepEqual(core.upcomingVersions("leistungsbeschreibung", before), ["2027-03-01"]);
    assert.equal(core.hasLegalDoc("leistungsbeschreibung", at("2027-03-01T12:00:00Z")), true);
  });

  test("availableLegalDocs: nur Dokumente mit geltender Fassung", () => {
    assert.deepEqual(core.availableLegalDocs(at("2026-12-15T12:00:00Z")), ["impressum", "agb", "avv"]);
    assert.deepEqual(core.availableLegalDocs(at("2027-03-01T12:00:00Z")), ["impressum", "agb", "avv", "leistungsbeschreibung"]);
  });
});
