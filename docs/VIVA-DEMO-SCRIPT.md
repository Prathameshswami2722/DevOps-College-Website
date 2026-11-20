# DevOps viva demonstration script

## Opening statement

> My project is not only a website uploaded to GitHub. The college website is the workload, GitHub is the shared source-control and collaboration platform, GitHub Actions is the automation engine, Docker is the reproducible runtime, GitHub Pages is the production environment, and the DevOps dashboard exposes live delivery and operational state.

## Explain the problem statement

The student team originally needed a common place to maintain and access website files. A shared GitHub repository solves the source-sharing problem, but a DevOps approach also defines how every change is reviewed, validated, secured, packaged, released and observed.

```text
Feature branch
    -> Pull request
    -> Automated quality gate
    -> Container build
    -> Security analysis
    -> Main-branch merge
    -> Production deployment
    -> Health and release observation
```

## Live demonstration sequence

### 1. Show the repository

Open the repository and identify the source code, workflows, Dockerfile, monitoring configuration, tests and documentation. Explain that Git stores the history locally and GitHub provides the shared remote, reviews, access and automation.

### 2. Show the feature-branch workflow

Explain that this dashboard upgrade was developed on `feature/devops-operations-dashboard`, pushed to GitHub and validated through a pull request before it reached `main`.

### 3. Open the DevOps dashboard

The dashboard provides current evidence rather than hardcoded success claims:

- Production health comes from `health.json`.
- The release number comes from build-generated `build-info.json`.
- Pipeline state and individual jobs come from the GitHub Actions API.
- Recent changes come from the GitHub commits API.
- The pull-request count comes from the GitHub pull-requests API.

Press **Refresh** to request the data again.

### 4. Explain CI

The quality job runs `npm ci`, repository validation, five automated tests, a production build and `npm audit`. A failure stops dependent jobs.

### 5. Explain the container

The Dockerfile uses a build stage to generate `dist/` and an unprivileged Nginx stage to serve it. The image includes a health check, so the runtime can distinguish a running process from a healthy service.

### 6. Explain CD

Only a successful push to `main` deploys. The tested `dist/` artifact is passed to GitHub Pages, and the build embeds its commit SHA. This makes the deployed version traceable to source.

### 7. Explain security and dependencies

CodeQL scans JavaScript, `npm audit` checks dependencies, Dependabot proposes upgrades, workflow permissions follow least privilege, and Nginx adds HTTP security headers.

### 8. Explain monitoring and recovery

The Docker monitoring profile starts Prometheus and Blackbox Exporter. Blackbox probes the health endpoint every 15 seconds. `CollegeWebsiteDown` fires after one minute of failure. The runbook gives the commands for validation, container startup, monitoring and commit reversion.

## Strong closing statement

> GitHub sharing is the starting requirement. The DevOps value is that a teammate cannot simply upload an unverified file to production: the repository records the change, the pull request enables review, CI validates it, security checks it, Docker proves it can be packaged, CD releases it, and health monitoring verifies the result.
