# Setup and permissions

## Android call screening role

Android binds a single user-selected app that implements `CallScreeningService`. Install the debug APK, open Nika Core, tap **Enable call screening**, and approve the system role prompt.

The app only requests the call-screening role. It does not request contacts, microphone, SMS, or location permissions in this prototype.

## Backend

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run build
npm start
```

The default backend uses an in-memory demo directory. This is intentional until a Supabase URL/key and a reviewed data access layer are configured.

## Test the API

```powershell
curl http://localhost:8787/health
curl "http://localhost:8787/v1/lookup?phone=%2B919876512345"
curl -X POST http://localhost:8787/v1/reports -H "content-type: application/json" -d '{"phone":"+919123456789","kind":"spam","comment":"TEST_DATA"}'
```

## Production checklist

- Replace demo persistence with Supabase using least-privilege server credentials.
- Add authentication, rate limits, audit logs, correction and deletion workflows.
- Add provider contract tests and source/expiry timestamps.
- Obtain legal review for the countries and telecom rules where the app will operate.
- Never present seed records as live caller intelligence.
