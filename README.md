# RenalCalc

> Open-source renal function calculator for clinical **reference** — eGFR, CCr, BSA and CKD staging — built with React Native (iOS / Android).
>
> 腎機能評価（eGFR・CCr・BSA・CKD 病期）をオフラインで算出する React Native 製アプリ。

> **⚠️ Medical disclaimer / 免責**
>
> RenalCalc is an educational reference tool. It is **not a medical device** and does **not** provide medical advice, diagnosis, or treatment. Calculated values are reference estimates only — always rely on a licensed clinician's judgement together with other findings. See [Disclaimer](#disclaimer--免責事項).
>
> 本アプリは参考目的の教育ツールであり、医療機器ではありません。診断・治療には必ず医師の判断を仰いでください。

---

## Features

- **eGFR** — estimated glomerular filtration rate using the Japanese Society of Nephrology (JSN) equation, with the sex coefficient.
- **CCr** — creatinine clearance via the Cockcroft–Gault formula (commonly used for drug-dose adjustment).
- **BSA** — body surface area via the Fujimoto equation (derived for Japanese body types).
- **CKD staging** — automatic G1–G5 classification from the computed eGFR.
- **Input validation** — clinically plausible ranges are enforced to catch entry errors.
- **On-device & private** — all calculations run locally; no input is sent to any server.

## Formulas & clinical references

All formulas are reference equations; the implementation lives in [`src/utils/calculations.ts`](src/utils/calculations.ts) and is guarded by acceptance tests in [`src/utils/__tests__/calculations.test.ts`](src/utils/__tests__/calculations.test.ts).

| Metric               | Formula                                                    | Source                                                                                          |
| -------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| eGFR (mL/min/1.73m²) | `194 × SCr^-1.094 × age^-0.287` (× `0.739` if female)      | JSN CKD Guideline 2018 — <https://cdn.jsn.or.jp/data/CKD2018.pdf>                               |
| CCr (mL/min)         | `((140 − age) × weight) / (72 × SCr)` (× `0.85` if female) | Cockcroft DW, Gault MH. _Nephron_ 1976;16(1):31-41 — <https://pubmed.ncbi.nlm.nih.gov/1244564/> |
| BSA (m²)             | `0.008883 × weight^0.444 × height^0.663`                   | 藤本ら. 日本衛生学雑誌 1968;23(5):443-450 — <https://cir.nii.ac.jp/crid/1390001206358904064>    |

CKD stages (from eGFR): **G1** ≥ 90 · **G2** 60–89 · **G3a** 45–59 · **G3b** 30–44 · **G4** 15–29 · **G5** < 15.

## Screenshots

> _TODO: add screenshots of the input form, results (eGFR + CKD stage), and the formulas screen._

## Getting started

### Prerequisites

- **Node.js** ≥ 18 (a `.nvmrc` pins Node 20 — run `nvm use`)
- **npm** (examples below use npm)
- **iOS**: Xcode + CocoaPods (`bundle install`, then `bundle exec pod install` in `ios/`)
- **Android**: Android Studio / SDK and a configured emulator or device
- See the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) for platform details.

### Install & run

```sh
npm install

# iOS (first time / after native dependency changes)
bundle install
bundle exec pod install --project-directory=ios

# Start Metro
npm start

# In another terminal:
npm run ios       # or: npm run android
```

## Development

| Command                 | What it does                           |
| ----------------------- | -------------------------------------- |
| `npm test`              | Run the Jest test suite                |
| `npm run test:coverage` | Tests with a coverage report           |
| `npm run lint`          | ESLint                                 |
| `npm run typecheck`     | TypeScript (`tsc --noEmit`)            |
| `npm run format`        | Format with Prettier                   |
| `npm run ci`            | lint + typecheck + test (what CI runs) |

The medical formulas are pure functions and **must** stay covered by the acceptance tests. When changing a formula, update the test with an independently computed reference value and cite the source — see [CONTRIBUTING](CONTRIBUTING.md).

## Project structure

```
src/
  components/   Reusable UI (InputField, ResultCard, ActionButton, …)
  screens/      Home, Formulas, Disclaimer, PrivacyPolicy
  navigation/   React Navigation stack
  utils/        calculations.ts — the single source of truth for the clinical math
  types/        Shared TypeScript interfaces
```

## Contributing

Contributions are welcome — please read [CONTRIBUTING.md](CONTRIBUTING.md) first. Because this is a medical reference tool, changes to clinical logic require a cited source and test coverage. For security or clinical-accuracy concerns, see [SECURITY.md](SECURITY.md).

## Disclaimer / 免責事項

RenalCalc provides reference calculations for educational use. It is not a medical device and is not a substitute for professional medical judgement. The authors and contributors accept no liability for any use of the results. The in-app [Disclaimer](src/screens/DisclaimerScreen.tsx) and [Privacy Policy](src/screens/PrivacyPolicyScreen.tsx) screens contain the full text (Japanese).

本アプリの算出結果は参考値です。医療上の判断・診断・治療の前に必ず医師に相談してください。本アプリの利用により生じたいかなる損害についても、作者および貢献者は責任を負いません。

## License

[MIT](LICENSE) © 2024 Yuta Tamaru
