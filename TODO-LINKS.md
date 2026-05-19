# TODO: Anzupassende Links

Diese Datei enthält alle Links, die auf zukünftige Systeme verweisen und angepasst werden müssen, sobald diese verfügbar sind.

## Konfiguration via Environment

Alle dynamischen Links und das Impressum werden über Umgebungsvariablen
konfiguriert — siehe [`.env.example`](./.env.example). Reale Werte gehören
**nicht** ins Repo, sondern in `.env.local` (lokal) bzw. GitHub Actions
Secrets / Docker-Compose `environment` (Produktion).

| Variable | Verwendung |
|----------|------------|
| `NEXT_PUBLIC_APP_URL` | Basis für `/login` und `/register` Buttons |
| `NEXT_PUBLIC_DOCS_URL` | Dokumentations-Links (Self-Hosted CTA, OpenSource, Footer) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Hardware/Gateway "Anfragen" mailto |
| `NEXT_PUBLIC_DEMO_EMAIL` | "Demo anfragen" mailto |
| `IMPRINT_*` | Impressum + Datenschutz (server-side, kein Browser-Leak) |

## Status der Links

### Auth-System (Login/Register)
- [x] `Header.tsx` Login + Register → `${NEXT_PUBLIC_APP_URL}/login|register`
- [x] `Hero.tsx` "Kostenlos starten" → `${NEXT_PUBLIC_APP_URL}/register`
- [x] `Pricing.tsx` SaaS "Jetzt starten" → `${NEXT_PUBLIC_APP_URL}/register`
- [x] `CTA.tsx` "Organisation registrieren" → `${NEXT_PUBLIC_APP_URL}/register`

### Demo / Kontakt
- [x] `Hero.tsx` "Demo anfragen" → `mailto:${NEXT_PUBLIC_DEMO_EMAIL}`
- [x] `CTA.tsx` "Demo anfragen" → `mailto:${NEXT_PUBLIC_DEMO_EMAIL}`
- [x] `Footer.tsx` Demo → `mailto:${NEXT_PUBLIC_DEMO_EMAIL}`
- [x] `Pricing.tsx` Hardware/Gateway "Anfragen" → `mailto:${NEXT_PUBLIC_CONTACT_EMAIL}`

### Dokumentation
- [x] `Pricing.tsx` Self-Hosted CTA → `${NEXT_PUBLIC_DOCS_URL}`
- [x] `OpenSource.tsx` Docs-Karte → `${NEXT_PUBLIC_DOCS_URL}`
- [x] `Footer.tsx` Docs-Link → `${NEXT_PUBLIC_DOCS_URL}`
- [ ] `/docs/api` API-Docs (separater Aufbau später)

### Blog & Changelog
- [ ] `/blog` Blog einrichten
- [ ] `/changelog` Changelog-Seite

### Rechtliches
- [x] `/imprint` — Daten aus `IMPRINT_*` Env-Vars
- [x] `/privacy` — Verantwortliche Stelle aus `IMPRINT_*` Env-Vars
- [x] `/terms` AGB-Seite erstellt

### Social
- [x] GitHub → `https://github.com/OpenEOS-Project`
- [x] Discord entfernt (existiert nicht)
- [ ] Twitter/X (optional)
