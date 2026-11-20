# Examination demonstration guide

## Case study mapping

| Required task | Evidence in this project |
| --- | --- |
| Create `DevOps-College-Website` with a README | Repository root and `README.md` |
| Connect local Git to GitHub | `origin` remote and commands in the README |
| Upload with `git push` | GitHub commit history and terminal screenshot |
| Share source with team | Feature branches, pull requests, CODEOWNERS and contribution guide |
| Manage the project online | Issues, PR template, Actions and Dependabot |

## Five-minute live demonstration

1. Show the repository file list and README on GitHub.
2. Show `git log --oneline --graph --all` and explain the local/remote relationship.
3. Open the Actions tab and show the quality, container and deployment jobs.
4. Open `/devops.html` and show that the dashboard reads the real pipeline, release, commit and PR data.
5. Open the college application and explain that it is the workload delivered by the pipeline.
6. Run `docker compose up --build website`, then open `http://localhost:8080/health`.
7. Explain that a failed test blocks both the container and deployment stages.
8. Show the dashboard architecture, security, monitoring and runbook sections.
9. Show the Issues/PR templates and explain team collaboration.

## Screenshots to capture

Store evidence in `screenshots/github/`:

1. `01-repository-home.png` — files and rendered README.
2. `02-commit-history.png` — multiple meaningful commits.
3. `03-actions-success.png` — all CI/CD jobs green.
4. `04-pages-deployment.png` — live website and URL.
5. `05-pull-request.png` — checks and review on a PR.
6. `06-terminal-push.png` — successful `git push` output.

## Viva questions

**Why GitHub rather than sending a ZIP?** GitHub provides version history, concurrent branches, code review, access control and automation.

**What is CI?** Every pushed change is automatically validated, tested and packaged so defects are found before merging.

**What is CD?** A successful `main` build is automatically deployed to GitHub Pages.

**Why Docker?** It packages the same Nginx runtime and files for every machine, reducing environment differences.

**What happens when a test fails?** The quality job fails; dependent container and deployment jobs do not run.

**How is the site monitored?** Blackbox Exporter probes the health endpoint and Prometheus records availability and evaluates an alert rule.

**Why is there an operations dashboard?** It converts repository and runtime evidence into a live operational view. It reads GitHub Actions, commits and pull requests through the public GitHub API and checks the deployed health and build metadata endpoints.

**Is the dashboard itself the monitoring system?** No. It is the demonstration and control surface. Prometheus and Blackbox Exporter are the container monitoring system; GitHub Actions is the delivery automation system.
