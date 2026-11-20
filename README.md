# DevOps College Website

[![CI/CD Pipeline](https://github.com/Prathameshswami2722/DevOps-College-Website/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Prathameshswami2722/DevOps-College-Website/actions/workflows/ci-cd.yml)
[![CodeQL](https://github.com/Prathameshswami2722/DevOps-College-Website/actions/workflows/codeql.yml/badge.svg)](https://github.com/Prathameshswami2722/DevOps-College-Website/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An examination-ready implementation of **Case Study 4: Project Sharing Using GitHub**. It uses a real, data-driven college website to demonstrate source control, team collaboration, automated quality gates, containerisation, continuous deployment, security scanning and monitoring.

## Live project

- College application: [Asteria College](https://prathameshswami2722.github.io/DevOps-College-Website/)
- Operations dashboard: [DevOps Delivery Control Plane](https://prathameshswami2722.github.io/DevOps-College-Website/devops.html)
- Source and collaboration: [GitHub repository](https://github.com/Prathameshswami2722/DevOps-College-Website)

> Asteria College is fictional. The repository is an academic DevOps demonstration, not a production college service.

## What makes this a DevOps project?

The website is the product being delivered; the assessed work is the repeatable delivery system around it.

```text
Developer -> Git branch -> Pull request -> CI tests -> Docker build -> GitHub Pages
                                          \-> CodeQL and dependency checks
Container -> /health -> Blackbox Exporter -> Prometheus -> availability alert
```

| Capability | Implementation |
| --- | --- |
| Version control | Git repository, meaningful commits and GitHub remote |
| Collaboration | Feature branches, issues, PR template, CODEOWNERS and contribution rules |
| Continuous integration | GitHub Actions validation, tests, build and dependency audit |
| Continuous delivery | Automatic GitHub Pages deployment from a successful `main` pipeline |
| Containerisation | Multi-stage Dockerfile with an unprivileged Nginx runtime |
| Security | CodeQL, Dependabot, least-privilege workflow permissions and HTTP headers |
| Reliability | Health endpoint, Docker health check and immutable release metadata |
| Monitoring | Prometheus and Blackbox Exporter with an availability alert |

## Application features

- Responsive and accessible college website
- Programmes loaded from version-controlled JSON instead of duplicated HTML
- Release identifier generated from the Git commit during each build
- `/health` endpoint for container and monitoring probes
- Graceful error state when programme data cannot be loaded
- Live DevOps dashboard backed by the public GitHub API
- Current workflow jobs, release, health, pull-request count and commit history
- Delivery architecture, security controls, observability and copyable runbook commands
- No framework or runtime dependency required in the browser

## CI/CD pipeline

Every push to `main` or `develop` and every pull request to `main` triggers:

1. Checkout and deterministic `npm ci` installation.
2. Repository, HTML-anchor and JSON validation.
3. Automated tests with Node's built-in test runner.
4. A production build into `dist/` with commit-based release metadata.
5. Production dependency audit.
6. Multi-stage Docker image build.
7. GitHub Pages deployment only from `main`, only after all preceding jobs pass.

CodeQL runs separately on pushes, pull requests and a weekly schedule. Dependabot checks npm, Docker and GitHub Actions dependencies weekly.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/Prathameshswami2722/DevOps-College-Website.git
cd DevOps-College-Website
npm ci
npm run ci
npm run serve
```

Open `http://127.0.0.1:8080`.

Useful commands:

```bash
make check       # Validate repository and application structure
make test        # Run automated tests
make build       # Generate production dist/
make run         # Start the source-mode development server
make docker      # Build and run the production container
make monitoring  # Run website + Blackbox Exporter + Prometheus
```

## Run with Docker

```bash
docker compose up --build website
```

- Website: `http://localhost:8080`
- Health check: `http://localhost:8080/health`

To start observability as well:

```bash
docker compose --profile monitoring up --build
```

- Prometheus: `http://localhost:9090`
- Blackbox Exporter: `http://localhost:9115`

## GitHub workflow for the student team

```bash
git switch -c feature/my-change
# edit files
npm run ci
git add .
git commit -m "feat: describe the change"
git push -u origin feature/my-change
```

Open a pull request, wait for required checks, request review and merge only when the pipeline is green. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Repository structure

```text
.
├── .github/                 # CI/CD, CodeQL, Dependabot, issue and PR templates
├── data/                    # Version-controlled application data
├── docs/                    # Architecture and examination evidence guide
├── monitoring/              # Prometheus, Blackbox and alert configuration
├── scripts/                 # Build, validation and local-server automation
├── tests/                   # Automated application/repository tests
├── Dockerfile               # Reproducible production image
├── compose.yaml             # App and optional monitoring stack
├── nginx.conf               # Hardened container web server
├── package.json             # Standard automation entry points
├── index.html               # Application document
├── devops.html              # Live delivery and operations dashboard
├── devops.css               # Dashboard visual system
├── devops.js                # GitHub API and health telemetry client
├── style.css                # Responsive visual system
└── script.js                # Data loading and interaction logic
```

## Case-study evidence

The required repository name is `DevOps-College-Website`. The local repository is connected with:

```bash
git remote add origin https://github.com/Prathameshswami2722/DevOps-College-Website.git
git push -u origin main
```

Use [docs/EXAMINATION-GUIDE.md](docs/EXAMINATION-GUIDE.md) for the exact demonstration sequence, screenshot checklist, requirement mapping and viva answers. The architecture is explained in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## License

This academic project is available under the [MIT License](LICENSE).
