# Application review — 2 October 2026

The Panda registration, KYC, public directory, Pooja booking and Panda dashboard now share a database-backed account/profile. The fixes are implemented locally and verified against an isolated Neon branch. The production database has **not** been migrated.

## Fixed behavior

- Homepage and Panda directory link to `/pandas/register`; the old vendor onboarding URL redirects there. Login preserves the destination, including the selected Panda profile.
- Registration requires a phone verified through login, personal details, profile photo and private KYC details. JPEG, PNG and WebP uploads are limited to 2 MB each; the API accepts the resulting base64 request size. User, Panda, vendor profile and bookable Pooja services are saved in one transaction. Updating KYC keeps the same Panda identity.
- New registrations appear immediately in the Panda directory with an honest pending KYC status. Administrators can review private documents. Rejected profiles are excluded from the directory. Public Panda, vendor and listing responses exclude identity documents, residential address, date of birth and banking details.
- Panda cards open complete public profiles with photos, introduction, experience, languages, specialities and a booking form. Broken legacy photos have a fallback.
- Booking requires Pooja, date, time, selected Panda, customer name/phone, location and group size. Optional notes and beneficiary details are retained. The server checks that the Pooja belongs to the selected Panda and takes the price from the database.
- All booking times use IST. `2026-10-10T05:30:00Z` displays as **10 October 2026 at 11:00 am IST**.
- The database enforces one non-cancelled booking per Panda and scheduled instant, including concurrent requests. Cancellation releases both the time and any availability slot in the same transaction.
- Panda dashboards show upcoming bookings and history, customer contact details, program, date/time, status, location, group size and notes. They refresh on focus, every 30 seconds, and through a Refresh button.
- Customer reservations and Panda work bookings use separate queries. A Panda who books another Panda still sees their own customer reservation under My Bookings. Booking reads and changes require ownership or administrator access.
- Sessions reload account/profile state from the backend. Existing tokens use the current database role after registration. Public login cannot create administrators, and administrator APIs enforce their role on the server.
- Listing input validation prevents forged ownership. Review input validates whole-number ratings and My Bookings includes saved reviews. Demo payments require booking confirmation and owner access and prevent duplicate payment records.
- Existing homepage navbar anchors and page routes were checked. Nonexistent terms/privacy links were replaced with the existing support contact rather than linking to missing pages.

## Database migrations

1. `backend/prisma/migrations/20261002000100_panda_booking_flow/migration.sql`: adds Panda-to-vendor ownership, private KYC fields, booking contact/location/notes fields, foreign key and scheduling indexes; links historical Panda registrations to accounts, profiles and services.
2. `backend/prisma/migrations/20261002000200_legacy_vendor_listing/migration.sql`: adds the older vendor-only registration to the same Panda directory while preserving its existing KYC status and bookings.

The tested branch contains 3 Panda profiles and 3 vendor profiles, with no unlinked Panda profiles. All temporary fixture accounts and bookings were removed after testing. Existing production records were not changed.

The scheduling constraint is represented in the Prisma schema as a partial unique index, excluding cancelled bookings, using the supported [`partialIndexes` feature](https://docs.prisma.io/docs/orm/v7/prisma-schema/data-model/indexes#configuring-partial-indexes-with-where). The migration fails instead of deleting data if historical double bookings need manual resolution. No such conflicts existed during this review.

Prepared migration context for continuation:

- Project: `tiny-salad-99778672`
- Database: `neondb`
- Parent/production branch: `br-shy-wind-b5tfbz5u`
- Isolated review branch: `br-royal-sea-b52nlia9`
- Prepared migration ID: `b38e0997-7030-4685-bc7d-ffa6e8a88990`
- The prepared migration contains the first SQL file. The second migration was additionally tested on that branch and must also be applied when production rollout is approved.

The Neon migration tool explicitly requires confirmation before completing a prepared migration. The review branch and ignored `backend/.env.review` are retained for local preview until the rollout decision. Finishing the prepared migration deletes that temporary branch; local preview must then be restarted with the intended database connection. If the Neon connector applies SQL directly, record the corresponding migration checksums in Prisma's migration history before later Prisma deployments; the production history currently contains only the initial migration.

## Validation results

| Check | Result |
|---|---|
| Backend TypeScript build | Passed |
| Existing backend unit suite | 1 passed |
| Existing backend HTTP integration suite | 1 passed |
| Database-backed Panda flow suite | 18 passed, 0 failed |
| Frontend production build | All application routes built successfully |
| Frontend TypeScript | Passed |
| Backend lint | Passed without warnings |
| Frontend lint | Passed; 7 non-blocking image/font warnings |
| Route and asset smoke checks | 12 routes returned 200; 9 JS/CSS assets passed |
| Onboarding redirect | Resolved to `/pandas/register` |
| Navbar anchors | All checked anchors exist |
| CORS preflight | 204, correct frontend origin and authorization/content-type headers |
| Booking time formatting | Example above passed |
| Database schema inspection | All 9 new columns and expected indexes/foreign key present; Neon parent/branch comparison showed only intended additive schema changes |

The database suite exercises registration/KYC persistence, invalid uploads, wrong-phone rejection, public data privacy, existing-token role updates, duplicate registration, selected-Panda ownership, missing/past booking time, invalid group size, self-booking rejection, simultaneous booking attempts, dashboard isolation, repeated reads and fresh login, status transitions, cancellation/rebooking, KYC updates, listing ownership and pausing, availability ownership/time matching/slot reuse, customer reviews, private administrator KYC review and directory visibility.

## Remaining limits

- **Production rollout is pending approval.** Both migration files must be applied before running this backend against the production database. Schema changes and legacy account associations have only been tested on the isolated branch.
- **Interactive browser testing is pending.** Browser discovery returned no available browsers. HTTP checks, builds, API requests and real database persistence were validated, but actual file-picker interaction, browser refresh/localStorage behavior, mobile layout and screenshots were not verified through a browser.
- **SMS authentication and payment processing are demo integrations.** Development login uses the existing `123456` OTP and in-memory OTP expiry; no SMS is sent. Development payments create demo records; no money is collected. Production mode now refuses these unconfigured integrations and requires a strong `JWT_SECRET`. A real SMS provider and payment gateway implementation, credentials and verified webhook handling are required before public launch. KYC approval is an administrator review, not an external government verification service.
- The native Prisma CLI schema-diff check returned `P1001` for both pooled and direct endpoints in this environment. Database-backed tests using Prisma's PostgreSQL adapter and Neon connector schema inspection succeeded. A native CLI deployment check remains to be run from an environment that can reach the database.
- Hotel, food, transport, Darshan and other homepage sections are existing contact/enquiry links. They do not currently implement database booking flows. No messages, enquiries, SMS or payments were sent to third parties during testing.

## Reproducing the checks

Use Node 22.14 or newer (`.node-version` records the tested version). The default system Node 20.9 cannot run this installed Prisma CLI.

From `backend`, with an **isolated migrated test database**:

```powershell
node --env-file=.env.review --test test/panda-flows.e2e.mjs
npm test
node --env-file=.env.review node_modules/vitest/vitest.mjs run --config vitest.config.e2e.ts
```

`test/panda-flows.e2e.mjs` requires `TEST_DATABASE_URL` and `TEST_BRANCH_ID`, creates its own backend on port 3013, and cleans up its own fixtures. Build the backend first after code changes (`npm run build`). Never point these fixture tests at production.

From `frontend`, with frontend/backend servers running:

```powershell
npm run build
npm run lint
npm run test:smoke
```

Production migration command, after approval and with the production **direct** database connection configured:

```powershell
npm run db:deploy
```

Restart/redeploy the backend after migration and repeat the smoke checks. The current local preview is `http://localhost:3000` and uses the isolated review database through `http://localhost:3001/api`.
