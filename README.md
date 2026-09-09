# KHLIM Player Development Lab

An isolated, working basketball-development prototype: coach observations, measurable progress, goals, training and feedback in one athlete journey. Built as KHLIM Labs experiment 001. **Synthetic data only. This is not KHLIM Digital and must never connect to its production systems.**

## Run locally

Prerequisites: Node.js **24**, pnpm **10.15.0**, and Docker with Compose. `.nvmrc`, `.node-version` and the package engine enforce Node 24.

```bash
nvm use
corepack enable
corepack prepare pnpm@10.15.0 --activate
cp .env.example .env
pnpm install --frozen-lockfile
pnpm db:up
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open **http://127.0.0.1:3000**. Use this exact origin: cookie and CSRF settings intentionally match `APP_URL`. PostgreSQL is bound only to `127.0.0.1:54329`, with a dedicated `khlim_player_lab` database and Docker volume.

| Role                     | Email                                                                        | Password           |
| ------------------------ | ---------------------------------------------------------------------------- | ------------------ |
| Coach Maya Brooks        | `coach1@playerlab.example.test`                                              | `LabPractice!2026` |
| Coach Eli Rivers         | `coach2@playerlab.example.test`                                              | `LabPractice!2026` |
| Athlete Avery Tan        | `athlete1@playerlab.example.test`                                            | `LabPractice!2026` |
| Other synthetic athletes | `athlete2@playerlab.example.test` through `athlete12@playerlab.example.test` | `LabPractice!2026` |

These credentials are intentionally public **lab fixtures**, not production secrets. No real names, dates of birth, contact records, portraits or KHLIM credentials are used. New profiles are coach-managed; account provisioning is outside the review UI. The 12 seeded athletes all have individual accounts.

## Review the product

1. Sign in as a coach. Explore the overview and filter the roster by U9, U12 or U15.
2. Open Avery Tan to see four historical assessments, four measurement series, goals, training and feedback.
3. Add a fictional athlete; record two assessments, a measurement with its protocol, a goal, a training session and feedback. Update a goal to completed. Edit the profile and confirm history remains.
4. Sign out and sign in as `athlete1`. Browse all six development sections. Changing the athlete ID cannot reveal another athlete; coach routes and mutations are rejected server-side.
5. Repeat on a phone and tablet. Charts have descriptive accessible names and equivalent historical records. No cross-athlete rankings are shown.

The seed adds **2 coaches, 12 athletes (4 per group), 48 assessments, 192 measurements, 36 goals, 48 training sessions and 24 feedback entries**. It is additive and idempotent: re-running preserves existing review records. Observation dates are relative to seed day. The seeder refuses remote databases or database names outside `khlim_player_lab*`.

## Canonical commands

| Command                             | Purpose                                                         |
| ----------------------------------- | --------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`    | Reproduce locked dependencies                                   |
| `pnpm db:up`                        | Start only this project's PostgreSQL container                  |
| `pnpm db:generate`                  | Generate Prisma 7 client                                        |
| `pnpm db:validate`                  | Validate Prisma schema                                          |
| `pnpm db:migrate`                   | Apply committed SQL migrations                                  |
| `pnpm db:seed`                      | Add synthetic fixtures without overwriting history              |
| `pnpm db:status`                    | Verify applied migration status                                 |
| `pnpm dev`                          | Run local development server                                    |
| `pnpm lint`                         | ESLint, with no warnings allowed                                |
| `pnpm format:check` / `pnpm format` | Check / apply Prettier                                          |
| `pnpm typecheck`                    | Generate Next route types and run strict TypeScript             |
| `pnpm test`                         | Unit tests for validation, policy and authentication primitives |
| `pnpm build`                        | Generate Prisma client and create production build              |
| `pnpm start`                        | Serve the production build locally                              |
| `pnpm test:e2e`                     | Playwright HTTP contracts and UI acceptance tests               |
| `pnpm verify`                       | Lint, format, types, unit tests, schema, build, browser tests   |

Before browser tests, run `pnpm exec playwright install chromium` (`--with-deps chromium` on Linux). Start from a migrated, seeded database. Playwright starts `pnpm start` if port 3000 is free; it reuses a local server outside CI. **Stop `pnpm dev` before final validation to test the production build.** Tests create uniquely named synthetic records and clean up their machine-named, unlinked profiles at teardown; seeded athletes and manual review records are preserved. Use a disposable test database for a clean run. CI provisions its own database.

To stop PostgreSQL without losing records: `docker compose stop`. For a deliberately clean lab, `docker compose down -v` deletes **this Compose project's synthetic database volume**; then repeat database setup. Never run reset commands against another project.

## Architecture and authentication

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 plus a small semantic CSS design system, PostgreSQL 17, Prisma 7 with the `pg` adapter. Reads use Server Components; same-origin JSON route handlers support validated form mutations. The shared service layer enforces access rules.

The default `AUTH_PROVIDER=lab` uses salted scrypt password hashes and revocable opaque database sessions (HttpOnly, SameSite=Lax, eight-hour expiry). Secure cookies are enabled with an HTTPS `APP_URL`. All mutations check Origin; roles and athlete ownership are resolved from the database, never request payloads.

An optional `AUTH_PROVIDER=supabase` path uses verified Supabase Auth identities and SSR cookie refresh. It needs a **separate experimental Supabase project**, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and an explicitly provisioned `User.externalAuthId` mapping. It has no sign-up or role-claim trust. The local lab path is fully exercised; the external Supabase path is an integration direction, **not live-tested**. RLS is enabled with no browser policies on all lab tables; Prisma is server-only. See [architecture](docs/ARCHITECTURE.md) before configuring it.

## Scope and lessons

No production deployment or integration is included. No payments, memberships, registration, tenancy, guardians, chat, AI, rankings, scouting, recruitment, notifications or video features exist. The model, interaction design and lessons are the outputs; implementation choices remain disposable.

- [Architecture and security boundaries](docs/ARCHITECTURE.md)
- [Domain model and invariants](docs/DOMAIN_MODEL.md)
- [Acceptance tests and browser QA evidence](docs/ACCEPTANCE_TESTS.md)
- [Migration lessons for KHLIM Digital](docs/MIGRATION_LESSONS.md)
- [Autonomy experiment log](ASTRA_EXPERIMENT.md)
