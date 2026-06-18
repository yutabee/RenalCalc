# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For a medical reference tool, **any change to a clinical formula or CKD stage
boundary is treated as significant** and is called out explicitly below.

## [Unreleased]

### Added

- Pure, unit-tested calculation module (`src/utils/calculations.ts`) extracted
  from the home screen, with acceptance tests locking the eGFR, CCr, BSA and
  CKD-stage reference values.
- HomeScreen component tests via `@testing-library/react-native`.
- Continuous integration (GitHub Actions): lint, typecheck, format check and
  tests on Node 18 & 20; Dependabot for npm and GitHub Actions.
- Open-source project files: `LICENSE` (MIT), `CONTRIBUTING`, `CODE_OF_CONDUCT`,
  `SECURITY`, issue/PR templates, `CODEOWNERS`, and a rewritten `README`.

### Changed

- Hardened input validation to reject non-numeric input (e.g. `"12abc"`).
- Stricter formatting/lint tooling (`typecheck`, `format`, `format:check`, `ci`
  scripts; `.nvmrc`, `.prettierignore`).

[Unreleased]: https://github.com/yutabee/RenalCalc/commits/main
