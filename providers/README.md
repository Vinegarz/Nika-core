# Provider adapters

The backend has an adapter seam for approved caller-intelligence providers.

- Hiya — disabled until an approved API URL and key are supplied.
- CallerAPI — disabled until an approved API URL and key are supplied.

Set credentials only in a local environment or a secret manager:

```text
HIYA_API_URL=https://...
HIYA_API_KEY=...
CALLERAPI_API_URL=https://...
CALLERAPI_API_KEY=...
```

The generic adapter intentionally does not map unknown JSON into caller identity. Implement mapping only from the provider's current, authorized documentation and add contract tests before enabling it. CNAP is not a provider adapter here because the app cannot assume access to an operator subscriber database.
