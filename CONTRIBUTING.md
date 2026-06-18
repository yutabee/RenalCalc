# Contributing to RenalCalc

Thanks for your interest in improving RenalCalc. This is a medical **reference**
tool, so accuracy and traceability matter more than speed. Please read this
guide before opening a pull request.

By participating you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Development setup

```sh
nvm use            # Node 20 (see .nvmrc)
npm install
npm run ci         # lint + typecheck + test — run this before pushing
```

See [README](README.md#getting-started) for platform (iOS/Android) prerequisites.

## Workflow

We use an **issue → branch → pull request** flow:

1. **Open an issue first** for anything non-trivial so the approach can be agreed
   before code is written. Use the issue templates.
2. **Branch** from `main` with a conventional prefix:
   `feat/...`, `fix/...`, `refactor/...`, `test/...`, `docs/...`, `chore/...`.
   One logical change = one branch = one PR.
3. **Commit** in small, self-contained units. Use [Conventional Commits](https://www.conventionalcommits.org/)
   style messages (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`) and
   reference the issue (`Refs #12` / `Closes #12`).
4. **Open a PR** against `main`. Fill in the PR template. A maintainer merges —
   please don't merge your own PR.

## Quality gates

Every PR must pass CI: **lint**, **typecheck**, **format check**, and **tests**
(Node 18 & 20). Run `npm run ci` and `npm run format` locally first.

## Changing clinical formulas (read this)

The renal formulas live in [`src/utils/calculations.ts`](src/utils/calculations.ts)
and are the heart of this project. If you touch eGFR, CCr, BSA, the CKD stage
boundaries, or the validation ranges:

- **Cite a source.** Link the guideline or peer-reviewed paper in the PR and in a
  JSDoc/code comment. Do not change a coefficient without a reference.
- **Add/Update acceptance tests** in
  [`src/utils/__tests__/calculations.test.ts`](src/utils/__tests__/calculations.test.ts)
  with reference values computed **independently** (e.g. by hand or from an
  authoritative calculator), not copied from the implementation.
- **Update the in-app text** (`FormulasScreen`, `DisclaimerScreen`) and the
  README formula table if the change is user-visible.
- **Note it in [CHANGELOG.md](CHANGELOG.md)** — a formula change is significant.

## Style

- TypeScript (strict) + functional React components.
- ESLint (`@react-native`) and Prettier are the source of truth — run
  `npm run lint` and `npm run format`. Don't hand-format against the tools.

## Reporting bugs & security/accuracy issues

- Functional bugs and feature ideas: open an issue.
- A formula that produces a wrong value, or a security concern: please follow
  [SECURITY.md](SECURITY.md) — these get priority handling.
