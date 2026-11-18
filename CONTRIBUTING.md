# Contributing

This repository uses a lightweight feature-branch workflow suitable for a student team.

1. Pull the latest `main` branch.
2. Create a branch such as `feature/admissions-form` or `fix/mobile-navigation`.
3. Make a focused change and run `npm run ci`.
4. Push the branch and open a pull request.
5. Wait for CI and review before merging.

Use Conventional Commit-style messages where practical:

- `feat: add programme filtering`
- `fix: correct mobile menu focus`
- `docs: update deployment guide`
- `ci: add container security check`

Never commit passwords, API keys, personal data, `.env` files or generated `dist/` content.
