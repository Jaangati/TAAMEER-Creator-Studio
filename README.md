# TAAMEER Agent Studio

An internal, browser-based sales content workspace designed by TAAMEER Marketing.

## Open the application

https://jaangati.github.io/TAAMEER-Creator-Studio/

## Product experience

The application is intentionally centered on one **Creator Brain** conversation. Idea generation, hooks, scripts, captions, phone filming tips, rule-based script reviews and approved TAAMEER project details are available through chat prompts, shortcut suggestions and optional quick-context chips.

Sales can use the shared team password instead of individual user accounts. Marketing administrator sign-in remains separate. Saved drafts are shared within the Sales team; chat history is local to each browser and can be accessed via Recent Conversations.

The project uses a bright black, white and grey TAAMEER design system. The logo is in `assets/taameer-logo.svg`.

## Architecture

- Frontend: `index.html`, `app.js`, `style.css` and `assets/taameer-logo.svg`
- Hosting: GitHub Pages via `.github/workflows/pages.yml`, which packages all required assets
- Backend: Supabase project `hylcxekemqttsyfnsiov`, Edge Function `creator-studio`
- Password verification: salted digest stored in restricted Supabase table; password itself is not committed
- Sessions: server-signed tokens stored client-side with an 8-hour browser inactivity timeout; server-side maximum token lifetime 7 days. Password rotation invalidates prior tokens.
- Shared drafts: restricted `sales_content` table accessed through server-side endpoints, not public Supabase Data API access
- Project facts: read from approved Supabase project records after Sales session verification

## Notes for Marketing

This is a **rules-based content engine, not a full generative AI chatbot**. Responses are constructed using templates, project records and matching rules. Agents must verify all project claims with Marketing.

Individual agent accounts are not required, but a shared password cannot distinguish individual salespeople or selectively revoke one agent. Rotate the password if access changes. Marketing admin authentication needs a separately provisioned administrator.

Source changes to `main` automatically deploy GitHub Pages. The Supabase backend is independently deployed and should not be assumed to redeploy on GitHub updates.
