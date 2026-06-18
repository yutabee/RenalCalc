# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For a medical reference tool, **any change to a clinical formula or CKD stage
boundary is treated as significant** and is called out explicitly below.

## [Unreleased]

## [1.0.1] - 2026-06-19

### Changed

- Restored the iOS bundle identifier to `org.reactjs.native.example.RenalCalc`
  so updates continue to ship to the existing App Store listing (an App Store
  app's bundle identifier is immutable once published).
- Bumped the iOS marketing version to 1.0.1 (build 5) and the Android version to
  1.0.1 (versionCode 2) to resubmit the React Native 0.86 codebase to the App
  Store as a new version.

## [1.0.0] - 2026-06-19

First public release.

### Added

- **Renal function calculators**: eGFR (Japanese Society of Nephrology
  equation), creatinine clearance (Cockcroft–Gault), body surface area
  (Fujimoto), and automatic CKD staging (G1–G5) — with the formulas and clinical
  references shown in-app.
- Input validation enforcing clinically plausible ranges with clear messages.
- Pure, unit-tested calculation module (`src/utils/calculations.ts`) whose
  reference values are locked by acceptance tests, plus component tests
  (React Native Testing Library) and an enforced coverage threshold.
- Continuous integration & delivery (GitHub Actions): lint, typecheck, format
  and tests on Node 18 & 20; native Android and iOS build verification; gitleaks
  secret scanning and a dependency audit; commitlint; Dependabot; and a
  tag-driven release pipeline that publishes a GitHub Release with the Android
  APK.
- Open-source project files: MIT `LICENSE`, `CONTRIBUTING`, `CODE_OF_CONDUCT`,
  `SECURITY`, issue/PR templates, `CODEOWNERS`, and a documented `README` with
  screenshots.

### Changed

- Built on React Native 0.86 / React 19.
- Unified the application identifier to `io.github.yutabee.renalcalc` across
  iOS and Android.
- Hardened input validation to reject non-numeric input (e.g. `"12abc"`).
- Scaffolded environment-based Android release signing (no keystore committed).

### Fixed

- Completed the in-app Privacy Policy, which previously shipped with a
  placeholder section.

### Security

- All calculations run on-device; no user input is transmitted to any server.

[Unreleased]: https://github.com/yutabee/RenalCalc/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/yutabee/RenalCalc/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/yutabee/RenalCalc/releases/tag/v1.0.0
