# iOS automated deploy

The [`iOS deploy`](../.github/workflows/ios-deploy.yml) workflow builds, signs and
uploads the iOS app to **App Store Connect** whenever a `v*` tag is pushed (or on
manual dispatch).

It deliberately **stops at upload**. Submitting the build for App Review remains
a manual step you perform in App Store Connect — a human gate that suits a
medical reference app.

```
git tag v1.0.2 && git push origin v1.0.2
        │
        ▼   (GitHub Actions, macOS runner)
  build → sign (API key) → export → upload to App Store Connect
        │
        ▼   (you, in App Store Connect)
  attach build → Submit for Review → auto-release on approval
```

## One-time setup

### 1. Create an App Store Connect API key

1. App Store Connect → **Users and Access** → **Integrations** → **App Store Connect API**.
2. Generate a key with the **App Manager** role (needed so the workflow can create
   the signing certificate/profile; use **Admin** if certificate creation fails).
3. Note the **Key ID** and the **Issuer ID** (shown above the key list).
4. **Download the `AuthKey_XXXXXXXXXX.p8` file** — it can only be downloaded once.

### 2. Add three repository secrets

Repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret          | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| `ASC_KEY_ID`    | the Key ID (e.g. `ABC123XYZ`)                               |
| `ASC_ISSUER_ID` | the Issuer ID (a UUID)                                      |
| `ASC_KEY_P8`    | the **entire contents** of the `AuthKey_XXXXXXXXXX.p8` file |

The team ID (`WW832FWMK6`) is not secret and is set directly in the workflow.

## Releasing

- **Tag-triggered:** `git tag v1.0.2 && git push origin v1.0.2`.
  The version string comes from the tag (`v1.0.2` → `1.0.2`); the build number is
  a UTC timestamp, so it is always unique and increasing without editing the
  Xcode project.
- **Manual test run:** Actions → _iOS deploy_ → **Run workflow** (`workflow_dispatch`).
  Uses the project's current `MARKETING_VERSION` for the version string.

After the workflow succeeds, finish in App Store Connect:

1. Open the new version (create it if needed) and attach the uploaded build once
   it finishes processing (5–30 min).
2. **Submit for Review.** Release is set to automatic, so it goes live after approval.

## Notes and caveats

- **Cloud signing creates a fresh distribution certificate** in the account on first
  run (the local certificate's private key cannot leave your Mac). An account allows
  at most **two** distribution certificates — fine for solo use, but revoke stale ones
  if you hit the limit.
- **Export compliance** is pre-declared via `ITSAppUsesNonExemptEncryption = false`
  in `ios/RenalCalc/Info.plist` (the app is fully offline), so no per-build prompt.
- **Secrets are safe in a public repo:** GitHub does not expose Actions secrets to
  workflows triggered by pull requests from forks. Do not introduce
  `pull_request_target` triggers, which would weaken that guarantee.
- macOS runner minutes are **free for public repositories**.
- The first real run usually needs babysitting (role/permission or secret issues);
  use a `workflow_dispatch` run to validate before relying on tag pushes.
