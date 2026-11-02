# Nika Core

A privacy-conscious caller-ID and spam-screening prototype for Android.

This repository is deliberately honest about data provenance:

- The Android app uses the platform `CallScreeningService`.
- The backend exposes lookup and report endpoints.
- Seed records are explicitly marked as `TEST_DATA`; they are not live Truecaller/CNAP data.
- Commercial provider adapters are opt-in and remain disabled until you provide an approved endpoint and credential.
- CNAP is not treated as a downloadable subscriber database.

## Repository layout

- `android/` — Kotlin + Jetpack Compose app, including the Android call-screening service.
- `backend/` — Node/TypeScript API with lookup, reporting, and provider adapter interfaces.
- `database/` — PostgreSQL/Supabase schema and clearly labelled test seed data.
- `.github/workflows/android-apk.yml` — debug APK build and artifact upload.
- `docs/` — setup and integration notes.

## Quick start

### Backend

```powershell
cd backend
npm install
npm run dev
```

The API listens on `http://localhost:8787`.

- `GET /health`
- `GET /v1/lookup?phone=+919876512345`
- `POST /v1/reports` with `{"phone":"+919876512345","kind":"spam","comment":"TEST_DATA report"}`

### Android

Open `android/` in Android Studio and run the `app` configuration on an Android 10+ device or emulator. After installation, tap **Enable call screening** and grant the system role.

The app currently uses a local directory for deterministic development. No network endpoint is silently invented.

### Supabase

Apply `database/schema.sql` to a Supabase project, then load `database/seed/test-data.sql` only in development. Every seed row carries `source_kind = 'TEST_DATA'`.

## Build the APK locally

From the repository root:

```powershell
cd android
gradle assembleDebug
```

The GitHub Actions workflow performs the same build and uploads `app-debug.apk` as an artifact. It is a debug APK for testing, not a Play Store release.

## Data and legal boundaries

This project does not scrape or copy Truecaller's private systems and does not claim access to telecom operator CNAP databases. Use only APIs, directories, feeds, and user submissions that you are authorized to use. Review provider terms, privacy requirements, telecom rules, and correction/deletion obligations before production use.
