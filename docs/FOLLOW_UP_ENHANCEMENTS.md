# Follow-up UX and coach-assist experiment

This branch is intentionally built **after** the Astra experiment 001 baseline was merged. It does not redefine the production migration recommendation in `MIGRATION_LESSONS.md`.

## Included experiments

- Native select arrows are replaced with one consistent chevron positioned farther inside the field.
- Password fields have an accessible show/hide control.
- Local lab accounts have a short-lived password-reset flow. The lab displays its temporary reset link because this prototype has no email delivery. This is not the production KHLIM recovery design and the external Supabase path is not enabled for reset here.
- Interface language preference supports English, Bahasa Melayu, and Simplified Chinese. The preference is stored in a same-site cookie. Athlete names and coach-authored records are deliberately not machine-translated.
- Coaches can request an AI draft for Current Development Focus, Assessment Notes, and Practice Plan. The suggestion only populates the form field; a coach must review/edit it and explicitly save the form.

## AI configuration

AI drafting is optional and server-only. Add the following to the local `.env` to exercise it:

```env
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-5.6-luna
```

Never use a `NEXT_PUBLIC_` prefix for the API key. The request uses the OpenAI Responses API with `store: false`. Only a whitelist of fields relevant to the requested draft is sent. The prompt prohibits invented observations, medical information, rankings, scouting, recruitment, and talent predictions.

Without `OPENAI_API_KEY`, the rest of the lab continues to work and the drafting button returns a visible configuration message.

## Local password reset

`.env.example` now includes `LAB_RESET_SECRET`. Reset tokens expire after 15 minutes and are signed against the account's current password hash, so changing the password invalidates the token. A successful reset revokes the account's existing lab sessions.

The local flow deliberately does not pretend to send email. Production identity/recovery belongs in the canonical KHLIM authentication system rather than this disposable lab implementation.

## Localization boundary

Translations cover product navigation, forms, instructional copy, authentication, and core development terminology. User-authored development focus, assessment notes, practice plans, measurement protocols, training notes, feedback, names, and other records remain in the language they were originally entered.

AI drafting follows the selected interface language, but the coach remains responsible for the final saved wording.
