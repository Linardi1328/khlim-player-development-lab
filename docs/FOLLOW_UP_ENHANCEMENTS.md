# Follow-up UX experiment

This branch is intentionally built **after** the Astra experiment 001 baseline was merged. It does not redefine the production migration recommendation in `MIGRATION_LESSONS.md`.

## Included experiments

- Native select arrows are replaced with one consistent chevron positioned farther inside the field.
- Password fields have an accessible show/hide control.
- Local lab accounts have a short-lived password-reset flow. The lab displays its temporary reset link because this prototype has no email delivery. This is not the production KHLIM recovery design and the external Supabase path is not enabled for reset here.
- Interface language preference supports English, Bahasa Melayu, and Simplified Chinese. The preference is stored in a same-site cookie. Athlete names and coach-authored records are deliberately not machine-translated.
- Login typography is locale-aware so translated copy remains controlled and the login page stays within the viewport at supported browser sizes.

AI-assisted drafting was explored and then deliberately removed from this lab because this subproject is intended to operate without external API spend. No OpenAI key or model configuration is required.

## Local password reset

`.env.example` includes `LAB_RESET_SECRET`. Reset tokens expire after 15 minutes and are signed against the account's current password hash, so changing the password invalidates the token. A successful reset revokes the account's existing lab sessions.

The local flow deliberately does not pretend to send email. Production identity/recovery belongs in the canonical KHLIM authentication system rather than this disposable lab implementation.

## Localization boundary

Translations cover product navigation, forms, instructional copy, authentication, and core development terminology. User-authored development focus, assessment notes, practice plans, measurement protocols, training notes, feedback, names, and other records remain in the language they were originally entered.
