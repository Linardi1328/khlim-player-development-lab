# Acceptance tests and review evidence

## Reproducible validation

Use Node 24, the committed pnpm lockfile, the example environment and the isolated PostgreSQL service. Follow README setup before tests. `pnpm test` has no database dependency. `pnpm test:e2e` needs a migrated/seeded lab database and Chromium. CI runs the production server; local iterations may reuse `pnpm dev`. Stop the dev server before a final production run.

| Requirement                        | Evidence                                                                                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Coach and athlete authentication   | HTTP login tests, invalid credentials, logout/revocation, cookie flags, and UI login for both roles                                            |
| Roster access and filtering        | HTTP roster response; group/name filtering, clear and empty results on all viewports                                                           |
| Create/edit synthetic athlete      | Coach HTTP and UI workflows; unknown authority fields stripped                                                                                 |
| Record seven skill ratings         | Two assessments through UI; invalid range rejected; notes and history visible                                                                  |
| Record measurements                | UI sprint entry with changing unit; HTTP free-throw entry, canonical server unit and invalid percentage rejection                              |
| Goal creation/update               | UI create and complete; HTTP completion timestamp verified                                                                                     |
| Training and feedback              | Created through UI and HTTP; immediately visible in history                                                                                    |
| Preserve history                   | Profile edit leaves two prior assessment values intact; overview shows two dated check-ins                                                     |
| Athlete self-access                | Own assessments, measurements, goals, sessions and feedback visible                                                                            |
| Cross-athlete denial               | Another existing athlete's API ID returns 404 without its name; all athlete mutations rejected for own and other IDs                           |
| Coach-only route denial            | Athlete cannot open profile creation; no coach controls; roster API denied                                                                     |
| Request forgery / session security | Foreign Origin rejected; revoked cookie rejected; repeated invalid logins throttled                                                            |
| Form validation / recovery         | Field error focus, invalid credentials, disabled pending submit, interrupted connection retains input                                          |
| Responsive layouts                 | Complete coach and athlete flows at desktop 1440×1000, phone 390×664 CSS pixels (iPhone 13 descriptor), tablet 768×1024 (iPad Mini descriptor) |
| Accessibility                      | Keyboard skip link and invalid-field focus; axe WCAG 2 A/AA and 2.1 AA checks on login, overview and profile at each viewport                  |
| Console/runtime                    | Full coach journey asserts no console errors or page errors; athlete journey checks page errors                                                |

The suite contains **23 unit tests** and **19 Playwright tests**: four viewport-independent HTTP scenarios and five UI scenarios repeated at three viewports. These are scenario counts, not numbers of assertions. The browser projects all use Chromium; device descriptors do not establish real iOS Safari coverage.

## Browser inspection beyond the suite

On 9 September 2026 the application was started and inspected with agent-browser. The independent walkthrough included coach sign-in, overview/roster inspection, creation of fictional **Devon Vale**, the new profile's empty states, an assessment, a free-throw measurement and its chart/history, a training entry and coach feedback. Seeded and newly created profile layouts were visually inspected. The submitted form's disabled “Saving…” state was observed. Screenshots from phone/tablet workflows were also inspected visually rather than treating their test exit code as sufficient evidence.

A controlled outage stopped only this project's Docker PostgreSQL service. The application displayed “The lab needs a moment” with a retry control. The database was restored, and authenticated pages loaded again. Expected errors during that injected outage are distinct from a remaining runtime defect.

The initial inspection found and fixed:

1. An SVG tooltip with multiple text nodes caused a React hydration mismatch on a freshly loaded populated profile. Rendering one string fixes it, with a full-load regression assertion.
2. Several muted labels failed contrast checks. The revised colors pass automated contrast checks on the three key screens at all viewports.
3. Validation tried to focus a disabled field before React committed the enabled state. Focus now follows the error-state commit and is covered by a browser assertion.
4. Mobile SVG chart labels scaled too small. Labels now use a larger viewBox font size on phone layouts. Final tablet inspection also found narrow two-column measurement charts; tablets now use one column with larger labels.

Final independent production inspection included athlete sign-in and profile/measurement charts at 390×844, 768×1024 and 1440×1000, with no browser errors.

The browser tool's generic date-fill operation did not populate Chromium's native date control reliably; Playwright's date input interaction succeeded through the complete workflows. This was treated as a browser-tool interaction limitation, not a successful manual submission.

## Result record

- Dependency installation and a frozen-lockfile reinstall: passed on Node 24.20.0 / pnpm 10.15.0.
- Schema generation, validation, migration apply and migration status: passed on local PostgreSQL 17.
- Seed initial counts: 14 users, 12 athletes, 48 assessments, 192 measurements, 36 goals, 48 sessions, 24 feedback entries.
- Repeated seed runs preserved existing records and counts; review-created data remains separate from fixture creation.
- ESLint, strict TypeScript, Prettier and 23 unit tests: passed.
- Full 19-scenario Playwright run against the development server: passed after fixes.
- Final production build: passed. All 19 production-mode Playwright tests passed with no skipped tests. Final static/unit/schema/status checks also passed after the build.

Artifacts are local and ignored: `artifacts/`, `test-results/`, `playwright-report/`. CI uploads failure evidence only, retained for seven days. Browser tests clean up only their machine-named unlinked athlete records, preserving seed athletes and manual review records.

## Practical limits

Automated accessibility scans are useful regression checks, not a full accessibility certification. No real devices, assistive-technology user study, Safari/Firefox matrix, live Supabase project, external penetration test, real athlete cohort, production deployment or KHLIM integration was tested. Migration recommendations are design hypotheses, not production approval.
