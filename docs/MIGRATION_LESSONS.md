# Migration lessons for KHLIM Digital

This experiment is isolated and disposable. Nothing here is an instruction to integrate, deploy or migrate data into KHLIM Digital. The model suggests questions for a separate design review.

## Concepts worth evaluating

Athlete-linked observations with effective dates, separate performance measurements, observable goals, training context and attributable feedback could eventually belong in KHLIM Digital. The distinction between an observation, measurement and goal is useful: they answer different questions and should not overwrite each other. Keeping the assessment date separate from the recorded timestamp supports backdated entry without rewriting chronology.

Required protocol notes expose an important product need: two percentages or sprint times are not comparable merely because their units match. A personal development profile is a promising way to communicate effort without rankings. Coach and athlete views can share the same underlying record while differing in permitted actions.

## Concepts and data that should not migrate

Do not migrate synthetic people, fixture passwords, lab user IDs, sessions, throttle records, experimental coach access rules or this prototype as an alternative athlete registry. Do not carry over the personal average score as an official indicator. U9/U12/U15 labels, fixed positions and this seven-skill rubric need domain validation first. Demo access, public fixture credentials and the isolated auth implementation are disposable.

## Assumptions to challenge

The prototype assumes one academy-like working space, globally trusted coaches, one login per athlete, one current group, no guardians, no sensitive private coach notes and fully visible feedback. It assumes a coach can rate all seven skills in one sitting and that a 1–5 label means the same thing between observers. Four steadily improving synthetic check-ins exercise the interface but do not prove these assumptions or demonstrate real improvement.

The next study should test whether coaches agree on ratings, whether athletes understand the language, and whether entering a useful protocol is practical during training. Plateauing, missing, noisy and declining results should be studied without framing them as failure.

## Organization tenancy

KHLIM Digital would need its canonical organization and program relationships. Athlete membership is likely temporal and potentially many-to-many; putting a single `organizationId` on a person may not capture transfers or simultaneous programs. Records need explicit organization/program ownership, scoped foreign keys, tenancy-aware queries and policies, and a decision about cross-organization sharing. Every read, mutation, export and cache key needs tenant scope. Global coach visibility must be discarded.

## KHLIM Guardian/Athlete relationships

An athlete identity must not equal a login. Existing KHLIM person, athlete and guardian relationships should govern who can act for or view a child. Relationships may involve multiple guardians, more than one athlete, changing authority and age transitions. Shared or guardian-mediated access, consent scope, revoked relationships and conflicting permissions require explicit rules. This lab deliberately contains no parent account and cannot establish those rules.

## KHLIM authorization

Use KHLIM Digital's canonical identity and policy model. Do not migrate lab roles as a new production role hierarchy. Coach access may depend on assignment, program, organization, time and purpose. Guardian and athlete access may differ by record type, safeguarding policy and consent. Server checks remain necessary even if database RLS is added. Negative tests should cover tenant crossing, unassigned coaches, revoked assignments, guardian relationship changes and every transport, including exports and administrative tools.

## Audit trails and corrections

Append-only UI behavior is useful but insufficient for official records. An audit design should capture actor, acting authority, source, effective/recorded times, changes, reason and correlation IDs. Corrections should supersede observations with a traceable reason rather than silently editing or deleting. Goal status changes need event history. A retention/deletion policy must reconcile audit needs with privacy and access revocation; permanent retention cannot be assumed.

## Evidence and provenance

Before a measurement becomes official, decide who may record it, which protocol version applies, how attempts are counted, which units and devices are valid, and whether verification is required. Store raw attempts where justified, provenance and confidence, assessor qualifications, evidence references and validation state. Separate an athlete's self-report, a coach's observation and a verified measurement. This lab stores author and protocol text only; those fields are not proof, calibration or approval. Do not turn a generated trend into an official achievement automatically.

## Child privacy and consent

Any real-child pilot needs a separate privacy, safeguarding and consent review for its actual jurisdiction and operating model. Minimize collection, use age-appropriate language, define authorized audiences, provide correction/access/deletion routes, and account for guardian authority and the child's developing autonomy. Consider whether free-text coach notes can introduce unnecessary health, family or safeguarding details. Avoid public profiles and comparison-based pressure. Define retention, access logs and consent withdrawal behavior before collecting real data. These are design questions, not a claim of legal compliance. This build avoids them operationally by accepting synthetic data only.

## Implementation choices to discard

- Local password authentication, publicly documented fixture credentials and email-keyed throttling as the primary abuse control.
- Table-owner database access as the only infrastructure boundary; create least-privilege runtime roles and tested tenant policies.
- Mutable goal status without a transition log; lack of correction/supersession workflows.
- Loading every historical row into one profile read and an unpaginated roster.
- Free-text targets/protocols as the only measurement structure.
- A fixed skill rubric and personal mean without reliability studies, rubric versioning or explicit comparison context.
- Implicit UTC date boundaries where academy-local dates matter.
- The experimental visual brand and account provisioning process as assumed production requirements.

## What this prototype establishes—and does not

The engineering tests establish that the specified workflows can run end to end, longitudinal rows remain intact during profile edits, and server boundaries resist direct ID and mutation attempts in the tested local configuration. Browser work tests readability and interactions at three viewport sizes. Neither establishes coaching validity, child usability, privacy compliance, production scalability or suitability of the optional Supabase configuration.

## Recommended next experiment

Run a small facilitated review with coaches using only fictional player scenarios. Have each coach assess the same written drill evidence independently, set an observable two-week goal and explain the profile to an athlete persona. Measure disagreement in the ratings, time to record a check-in, protocol completeness and whether the reader can identify the next practice step. Include a plateau and a slower sprint under different test conditions. Validate vocabulary and comparability before adding features or considering a real-data pilot.
