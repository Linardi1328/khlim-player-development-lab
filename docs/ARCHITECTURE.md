# Architecture

## Shape

One Next.js 16 application, one dedicated PostgreSQL 17 database, no queues or external services in the default path. Node 24 and pnpm are pinned by project configuration. Prisma 7's generated TypeScript client uses `@prisma/adapter-pg`; migrations are explicit SQL and the seed is an explicit command, following the [Prisma 7 configuration model](https://www.prisma.io/docs/orm/v7).

```text
Browser
  ├─ Next.js Server Components → pageViewer → service access checks → Prisma → PostgreSQL
  └─ Validated forms → same-origin JSON route handlers
                       → Origin check → authenticated viewer → coach guard
                       → Zod validation → Prisma → PostgreSQL
```

`src/lib/domain.ts` owns metric definitions and validation. `service.ts` owns authorized reads/writes. `access.ts` contains the two-role policy. `auth.ts` handles identity/session lookup. `http.ts` translates errors into safe JSON. Route handlers are thin; Server Components call the same service layer for reads. Using explicit mutation endpoints makes negative authorization tests exercise the actual HTTP boundary. Forms preserve entries after failure and refresh server-rendered data after success.

`src/components` contains the shell, reusable form renderer, accessible SVG charts and profile sections. The design uses a charcoal court, restrained lime accents, warm neutral panels and individual progress narratives. Tailwind 4 provides the utility layer and reset; semantic CSS keeps this small application's design consistent. Charts are server-rendered, avoiding a large client chart dependency; labels and history provide nonvisual access. The only client components manage navigation state, forms and error recovery.

## Authentication

The lab provider intentionally has no registration, invitations, email delivery, recovery, MFA or production account lifecycle. Synthetic fixture passwords use random salts and scrypt; raw passwords never enter the database. A 256-bit random session token is placed in an HttpOnly cookie and only its SHA-256 digest is stored. Sign-in rotates the current cookie's session, sign-out revokes it, and every request checks expiry and the current DB role. Successful login cleans expired sessions. Email-keyed sign-in throttles apply after ten attempts in fifteen minutes and use generic credential errors. This is basic lab abuse resistance, not an internet-facing identity system.

The optional Supabase provider uses `getUser()` to verify identity and maps its immutable subject to `User.externalAuthId`. Roles remain in this app's database, never editable user metadata. `src/proxy.ts` refreshes SSR cookies; `auth.ts` re-verifies identity before returning a viewer. An unmapped account is denied and signed out. No credentials or real accounts from production KHLIM may be reused. This path has been type-checked and built but has **not** been exercised against a live Supabase project.

For a later isolated Supabase experiment, provision fictional identities out of band, set the subject mapping, use a dedicated lab database, and verify refresh/revocation and ownership again. The default local seeder intentionally refuses remote URLs. Apply migrations only to that dedicated experiment; do not expose Prisma or database credentials to the client.

## Authorization

| Resource / operation                                      | Coach            | Athlete                 |
| --------------------------------------------------------- | ---------------- | ----------------------- |
| Roster and coach overview                                 | All lab athletes | Denied                  |
| Athlete profile and all history                           | All lab athletes | Own linked athlete only |
| Profile creation/editing                                  | Allowed          | Denied                  |
| Assessment, measurement, goal, session, feedback creation | Allowed          | Denied                  |
| Goal status changes                                       | Allowed          | Denied                  |
| Delete history / edit prior observation                   | No endpoint      | No endpoint             |

Page guards are a usability boundary; service guards and HTTP tests are the security boundary. Access to another athlete returns the same 404 as an unknown record. Unauthenticated API reads return 401; athlete calls to coach mutations return 403 before payload validation. Changing `userId`, `role`, assessor IDs or units in JSON cannot change authority; Zod strips unknown fields and the server derives provenance and units. UUID validation avoids leaking database errors for malformed paths. No shared cache holds private athlete data.

Mutations require JSON and an exact matching Origin. Cookie SameSite settings provide an additional boundary. Security headers deny framing and object embedding, limit referrers and disable unnecessary device permissions. The CSP is deliberately narrow and is not a complete script-nonce deployment policy. HTTPS and internet deployment are outside this prototype.

All tables enable PostgreSQL RLS with no Data API policies; if Supabase `anon`/`authenticated` roles exist, table privileges are revoked. The server-owned Prisma connection bypasses RLS as table owner, so **server guards remain essential**. This does not claim tenant-aware or direct-browser database authorization.

## History and data

Assessments and measurements are append-only in the application. Effective dates and recorded timestamps are separate. Ordering uses effective date, then creation time and UUID as a stable tie-breaker. Profile editing touches only profile fields. Goal completion timestamps are retained on repeated completion and cleared when reopened. Status history and immutable correction chains are future work.

SQL check constraints enforce rating bounds, metric/unit/value compatibility, jersey bounds, training duration and goal completion consistency. Foreign keys restrict deletion of domain/provenance parents. Indexes start with athlete ID for history queries. See [domain model](DOMAIN_MODEL.md).

## Delivery and operations

GitHub Actions uses an ephemeral PostgreSQL service, immutable official Action commit pins, `contents: read`, no production secrets and no deployment. It installs from the lockfile, migrates/seeds, validates schema/status, lints, checks formatting/types, runs unit tests, builds and runs Chromium acceptance tests at three viewports. Failure traces/screenshots are retained for seven days.

Local Playwright can reuse a dev server for iteration. Final evidence must also come from a fresh production build. Unit tests are independent of a database; HTTP and browser tests need the seeded PostgreSQL instance. No production KHLIM repository, API or infrastructure is involved.

## Deliberate limits

The small seed permits loading complete history and filtering roster names in PostgreSQL without pagination. At larger scale, add pagination and select only the active section's data. Free-text protocols, a single group per athlete, global coach access, approximate dates and a simple 1–5 rubric are hypotheses. There is no durable audit log, record correction workflow, full CSP, operational monitoring, test of a live Supabase account lifecycle, or production deployment. These must not be mistaken for validated production decisions.
