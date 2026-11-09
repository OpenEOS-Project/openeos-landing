# OpenEOS Landing Page

> Marketing-Website für OpenEOS - Das moderne Kassensystem für Vereine & Events.

## Entwicklung & Lizenz

**Entwickelt von:** LUXCODE by Lukas Lukic-Spitznagel

**Copyright:** Copyright (C) 2026 LUXCODE by Lukas Lukic-Spitznagel und Mitwirkende

**Lizenz:** GNU Affero General Public License v3.0 oder (nach deiner Wahl) jede spätere Version (`AGPL-3.0-or-later`), siehe [LICENSE](./LICENSE) und [NOTICE](./NOTICE)

**Bildherkunft:** Comic-Illustrationen (`public/comic/`): erstellt vom Rechteinhaber mit Higgsfield AI. Screenshots (`public/screens/`): Aufnahmen von OpenEOS selbst.

## Beschreibung

Die OpenEOS Landing Page ist die offizielle Marketing- und Informationswebsite für das OpenEOS Kassensystem. Sie bietet:

- Produktübersicht und Feature-Beschreibungen
- Preismodelle (Self-Hosted & SaaS)
- Open Source Informationen
- Zugang zu Login und Registrierung
- Rechtliche Seiten (Impressum, Datenschutz, AGB, AVV) mit Archiv und PDF

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** TailwindCSS + Untitled UI
- **Animationen:** Framer Motion
- **i18n:** next-intl (Deutsch & Englisch)
- **Themes:** next-themes (Dark/Light Mode)

## Entwicklung

```bash
pnpm install
pnpm dev
```

### Cloud-TSE „Bald verfügbar“

`NEXT_PUBLIC_TSE_COMING_SOON=true` (beim Bauen) zeigt die Cloud-TSE für Bargeld in Deutschland auf Preisen, Features und in der FAQ (`/faq#tse`) als „Bald verfügbar“; jeder andere Wert oder keiner zeigt sie als verfügbar. Die CI baut derzeit Produktion (`main`) und Staging (`dev`) mit `true`, damit sich die Texte auf Staging prüfen lassen (`.github/workflows/build-deploy.yaml`); ist die Cloud-TSE live, beide auf `false` stellen. Ausgewertet wird der Schalter nur in `src/lib/tse-availability.ts`.

## Rechtstexte

Impressum, Datenschutzerklärung, AGB und AVV liegen als Markdown im Repo, unverändert so, wie sie freigegeben wurden:

```
content/legal/de/<doc>/<JJJJ-MM-TT>.md     doc = impressum | datenschutz | agb | avv
```

Der Dateiname ist der „Stand“ der Fassung. **Alte Fassungen werden nie gelöscht** (Archiv); die neueste Datei je Dokument ist die aktuelle. Eine neue Fassung = neue Datei mit neuem Datum, der Wortlaut wird nicht im Code angepasst.

**Adressen** (andere OpenEOS-Repos verlinken darauf — nicht ändern):

| Adresse | Inhalt |
|---|---|
| `/agb`, `/avv`, `/datenschutz`, `/impressum` | aktuelle Fassung (`/en/…`: derselbe deutsche Text mit englischem Hinweis) |
| `/agb/2026-11-04` usw. | bestimmte Fassung; ältere mit Hinweis „Archivierte Fassung“, unbekannte → 404 |
| `/rechtstexte/<doc>-<JJJJ-MM-TT>.pdf`, `/rechtstexte/<doc>.pdf` | PDF einer Fassung bzw. der aktuellen |
| `#1-geltungsbereich-und-anbieter`, `#anhang-b`, `#ziffer-4-6` | Sprungmarken: Überschrift (Slug, Umlaute als ae/oe/ue/ss), kurze Marken `anhang-a…c`, `teil-a…c`, `ziffer-<n>` für „n. …“-Überschriften, `ziffer-<x>-<y>` für Absätze mit fetter Nummer (`**4.6**`) |
| `/terms`, `/privacy`, `/imprint` (auch `/en/…` und `/…/<fassung>`) | dauerhafte Weiterleitung auf die deutschen Adressen |

**Bauen:** `scripts/build-legal.mjs` läuft vor `next build` und `next dev` (`pnpm legal` einzeln) und

1. prüft die Texte auf Platzhalter (`[…]` oder `[Text]` ohne Link). Mit `NEXT_PUBLIC_SITE_ENV=production` oder `LEGAL_STRICT=1` bricht der Build mit Datei:Zeile ab, sonst (Staging, CI, lokal) gibt es nur eine Warnung;
2. erzeugt die PDFs nach `public/rechtstexte/` (nicht im Repo, `.gitignore`).

Die PDFs entstehen mit [pdfkit](https://pdfkit.org) aus dem `marked`-Lexer (Überschriften, Absätze mit Fett/Kursiv, Listen, Trennlinien, Tabellen; A4, Kopfzeile mit Titel und Stand, Seitenzahlen) — ohne Headless-Browser, damit der Build auch im `node:22-alpine`-Image läuft. Schrift ist Geist als TTF aus dem npm-Paket `geist` (devDependency, SIL OFL 1.1, siehe NOTICE); sie enthält alle benötigten Zeichen („ “ – § € → …). Die Webseiten rendern dasselbe Markdown beim Bauen mit `marked` (`src/lib/legal/`). Zeilen, die mit `*Anmerkung:*` beginnen, und ein Abschnitt „Anhang – Prüfhinweise“ werden auf Seite und PDF ausgelassen.

---

## Deployment

### Voraussetzungen

- Docker & Docker Compose auf dem Server
- GitHub Repository unter `OpenEOS-Project/openeos-landing`
- DNS-Einträge für `openeos.de` und `www.openeos.de` (A-Record auf Server-IP)

### Docker Netzwerk erstellen

Das externe Netzwerk muss einmalig erstellt werden:

```bash
docker network create frontend
```

### Manuelles Deployment

```bash
# 1. Docker Image bauen
docker build -t ghcr.io/openeos-project/openeos-landing:latest .

# 2. Image pushen (GitHub Login erforderlich)
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
docker push ghcr.io/openeos-project/openeos-landing:latest

# 3. Auf Server deployen
docker compose up -d
```

### Automatisches Deployment (CI/CD)

Bei jedem Push auf `main` wird automatisch:

1. **Lint & Build** geprüft
2. **Docker Image** gebaut und zu `ghcr.io` gepusht

Das Image kann dann auf dem Server mit `docker compose pull && docker compose up -d` aktualisiert werden.

### Docker Compose Konfiguration

Die `docker-compose.yml` enthält:

- **openeos-landing**: Die Next.js Landing Page (Port 3000 intern)
- **traefik**: Reverse Proxy mit automatischem Let's Encrypt

#### Traefik Features

- Automatische HTTPS-Zertifikate via Let's Encrypt
- HTTP → HTTPS Redirect
- www.openeos.de → openeos.de Redirect
- Dashboard unter `traefik.openeos.de` (optional aktivierbar)

### Server Setup

```bash
# 1. Repository klonen oder docker-compose.yml kopieren
git clone https://github.com/OpenEOS-Project/openeos-landing.git
cd openeos-landing

# 2. Netzwerk erstellen (falls noch nicht vorhanden)
docker network create frontend

# 3. Bei GHCR anmelden
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 4. Services starten
docker compose up -d

# 5. Logs prüfen
docker compose logs -f
```

### Update auf neue Version

```bash
docker compose pull
docker compose up -d
```

### Troubleshooting

```bash
# Container-Status
docker compose ps

# Logs anzeigen
docker compose logs openeos-landing
docker compose logs traefik

# Zertifikat-Status prüfen
docker compose exec traefik cat /letsencrypt/acme.json | jq '.letsencrypt.Certificates'

# Container neu starten
docker compose restart openeos-landing
```

### Traefik Dashboard absichern

Um das Dashboard zu aktivieren, generiere einen Passwort-Hash und füge ihn in `docker-compose.yml` ein:

```bash
# Passwort-Hash generieren
htpasswd -nb admin dein-passwort

# Ausgabe in docker-compose.yml einfügen und Labels auskommentieren
```

---

## Automatisches Deployment

Nach jedem erfolgreichen Image-Build auf `main` (Workflow `.github/workflows/build-deploy.yaml`, Job `deploy`) kann automatisch auf den Produktionsserver deployed werden. Der Deploy-Job ist standardmäßig deaktiviert und muss explizit aktiviert werden.

**Aktivieren:** Repository-Variable `DEPLOY_ENABLED` auf `true` setzen (Settings → Secrets and variables → Actions → Variables).

**Benötigte Variables:**

| Variable | Beschreibung |
|----------|--------------|
| `DEPLOY_ENABLED` | `true` aktiviert den Deploy-Job, sonst wird er übersprungen |
| `DEPLOY_PATH` | Optional — Compose-Verzeichnis auf dem Server (Default: `/srv/docker/<repo-name>`) |
| `DEPLOY_SERVICE` | Name des zu aktualisierenden Compose-Service |

**Benötigte Secrets:**

| Secret | Beschreibung |
|--------|--------------|
| `DEPLOY_HOST` | Hostname/IP des Produktionsservers |
| `DEPLOY_USER` | SSH-Benutzer |
| `DEPLOY_SSH_KEY` | Privater SSH-Key für den Zugriff |
| `DEPLOY_PORT` | (optional) SSH-Port, Standard: `22` |

Der Deploy-Job verbindet sich per SSH auf den Server und führt dort `docker compose pull` + `docker compose up -d` für den konfigurierten Service aus, gefolgt von `docker image prune -f`.

## Links

- **Hauptprojekt:** [OpenEOS](https://github.com/OpenEOS-Project)
