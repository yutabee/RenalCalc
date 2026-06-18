# Security & Clinical-Accuracy Policy

RenalCalc handles health-related inputs and produces clinical reference values,
so we treat **security vulnerabilities** and **clinical-accuracy defects** with
the same seriousness.

## Reporting

Please report privately rather than opening a public issue:

- **Preferred:** open a [GitHub Security Advisory](https://github.com/yutabee/RenalCalc/security/advisories/new)
  (Security → Report a vulnerability).
- **Alternatively:** email **yutabeee@gmail.com** with details.

Include, where relevant:

- A description of the issue and its impact.
- For a calculation defect: the exact inputs (age, sex, height, weight, S-Cr),
  the value RenalCalc produced, the expected value, and the **reference source**
  (guideline or paper) you are comparing against.
- Steps to reproduce, and the platform/OS/app version.

## What counts as a clinical-accuracy issue

A computed value (eGFR, CCr, BSA) or a CKD stage boundary that does not match the
cited reference formula. These are prioritised because incorrect reference values
in a medical tool can mislead users. The formulas and their tests live in
[`src/utils/calculations.ts`](src/utils/calculations.ts) and
[`src/utils/__tests__/calculations.test.ts`](src/utils/__tests__/calculations.test.ts).

## Our commitment

- **Acknowledgement** within ~72 hours.
- An initial assessment and, for confirmed clinical-accuracy defects, a fix or
  mitigation plan as a priority.
- Coordinated disclosure: we will agree on timing before any public detail.

## Scope & data handling

RenalCalc performs all calculations **on-device** and does not transmit user
inputs to any server (no analytics, no backend). There is therefore no server
infrastructure in scope — reports should focus on the app, its dependencies, and
the correctness of the clinical logic.

> RenalCalc is an educational reference tool, not a medical device, and is not
> FDA/CE/PMDA cleared. See the [Disclaimer](README.md#disclaimer--免責事項).
