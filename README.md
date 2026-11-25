# MediFlow — Smart Clinic Operations Platform

A MERN portfolio demonstration for clinic operations using synthetic data only. Not intended for clinical use.

## Features
- Role-based admin, doctor and receptionist access; JWT and bcrypt authentication.
- Patient and doctor records, appointment scheduling and status transitions.
- Dashboard analytics, calendar, search, filters and pagination.
- Patient queue with five-second polling and appointment-based tokens.
- Downloadable demonstration prescription PDFs.
- Login rate limiting, console audit events and automated API permission tests.

## Architecture
React + Vite → Express REST API → MongoDB via Mongoose. Express serves the built frontend in production.

## Local setup
Install Node.js and MongoDB. Copy `server/.env.example` to `server/.env`, set a unique random JWT secret (at least 32 characters), and configure the MongoDB URI. For synthetic demo accounts only, set DEMO_SEED=true and a private DEMO_PASSWORD of at least 12 characters. Existing accounts are not reset by seeding.

```sh
npm --prefix server ci
npm --prefix client ci
npm run dev
```

Open http://localhost:5173. Demo account emails are admin@demo.test, doctor@demo.test and receptionist@demo.test; obtain the password from the administrator. Optionally run `node server/seed-demo.mjs` against a dedicated synthetic database.

## Tests
With the API running, set TEST_DEMO_PASSWORD privately in your shell and run `node server/security-test.mjs`. The script checks health, invalid authentication and role permissions. Do not commit secrets.

## Production build
```sh
npm --prefix client run build
node server/index.js
```
Set environment variables in the hosting service. Use a dedicated synthetic database and restrict access. TRUST_PROXY=1 is only appropriate behind a verified single trusted proxy.

## Limitations
Clinic-wide doctor access is not patient-level authorization. Queue and PDF browser workflows require verification. Console audit events are not durable. This project is not a production healthcare system or a compliance-certified product. Do not store real patient data or expose shared writable demo accounts publicly.
