# OpenEOS Landing Page

> Marketing-Website für OpenEOS - Das moderne Kassensystem für Vereine & Events.

## Entwicklung & Lizenz

**Entwickelt von:** LUXCODE by Lukas Lukic-Spitznagel

**Lizenz:** [AGPLv3](./LICENSE) (GNU Affero General Public License v3.0)

## Beschreibung

Die OpenEOS Landing Page ist die offizielle Marketing- und Informationswebsite für das OpenEOS Kassensystem. Sie bietet:

- Produktübersicht und Feature-Beschreibungen
- Preismodelle (Self-Hosted & SaaS)
- Open Source Informationen
- Zugang zu Login und Registrierung
- Rechtliche Seiten (Impressum, Datenschutz, AGB)

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

---

## Deployment

### Voraussetzungen

- K3s Cluster mit Traefik und cert-manager (siehe [openeos-infrastructure](../openeos-infrastructure/))
- GitHub Repository unter `OpenEOS-Project/openeos-landing`
- DNS-Einträge für `openeos.de` und `www.openeos.de`

### Manuelles Deployment

```bash
# 1. Docker Image bauen
docker build -t ghcr.io/openeos-project/openeos-landing:latest .

# 2. Image pushen (GitHub Login erforderlich)
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
docker push ghcr.io/openeos-project/openeos-landing:latest

# 3. Auf K3s deployen
kubectl apply -k k8s/

# 4. Status prüfen
kubectl get pods -n openeos -l app=openeos-landing
kubectl get ingress -n openeos
```

### Automatisches Deployment (CI/CD)

Bei jedem Push auf `main` wird automatisch:

1. **Lint & Build** geprüft
2. **Docker Image** gebaut und zu `ghcr.io` gepusht
3. **Deployment** auf K3s aktualisiert

#### GitHub Secrets einrichten

Im Repository unter **Settings → Secrets and variables → Actions**:

| Secret | Beschreibung |
|--------|--------------|
| `KUBECONFIG` | Kubeconfig-Datei für K3s Cluster |

Die kubeconfig vom K3s Server holen:
```bash
# Auf dem K3s Master
sudo cat /etc/rancher/k3s/k3s.yaml

# WICHTIG: "127.0.0.1" durch die externe Node-IP ersetzen!
```

### Kubernetes Ressourcen

```
k8s/
├── deployment.yaml    # 2 Replicas, Port 3000
├── service.yaml       # ClusterIP Service
├── ingress.yaml       # TLS für openeos.de + www.openeos.de
└── kustomization.yaml
```

### Domain anpassen

Falls du eine andere Domain verwendest, ändere in `k8s/ingress.yaml`:

```yaml
spec:
  tls:
    - hosts:
        - deine-domain.de
      secretName: openeos-landing-tls
  rules:
    - host: deine-domain.de
```

### Troubleshooting

```bash
# Pod-Status
kubectl get pods -n openeos -l app=openeos-landing

# Pod-Logs
kubectl logs -n openeos -l app=openeos-landing

# Ingress prüfen
kubectl get ingress -n openeos
kubectl describe ingress openeos-landing -n openeos

# Zertifikat-Status
kubectl get certificate -n openeos
kubectl describe certificate openeos-landing-tls -n openeos
```

---

## Links

- **Hauptprojekt:** [OpenEOS](https://github.com/OpenEOS-Project)
- **Infrastructure:** [openeos-infrastructure](../openeos-infrastructure/)
- **Dokumentation:** [PLAN/](../PLAN/)
