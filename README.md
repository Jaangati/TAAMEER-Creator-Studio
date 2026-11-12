# TAAMEER Creator Studio

Mobile-first internal content production dashboard for TAAMEER Sales, including Creator Brain, hook and script generation, teleprompter, project knowledge, saved content and content planning.

## Deployment

- Hosted application: https://hylcxekemqttsyfnsiov.supabase.co/functions/v1/creator-studio
- Supabase project: hylcxekemqttsyfnsiov
- Frontend source: index.html
- Production hosting: Supabase Edge Function named creator-studio
- GitHub Pages: not configured

## Access model

Sales team uses one **shared password** entered on the dashboard login screen. The password is validated by the Supabase Edge Function against a salted SHA-256 hash in `sales_access_settings`. The actual password is not stored in this repository.

Sales content is shared, not individually attributed. Content is saved to `sales_content` through the server-side endpoint only. Both tables have RLS enabled and no anonymous Data API access. Service-role credentials belong exclusively to the Supabase Edge Function runtime.

Marketing admin sign-in uses Supabase Authentication with a separately provisioned user and `profiles.role = 'admin'`. No Marketing admin account has been created yet.

## Known limitations

- The content engine is deterministic and template-driven; this is not a live LLM.
- Initial TAAMEER facts require Marketing approval before public use.
- Arabic-native script production, visual video editing, advanced admin editing and automatic GitHub-to-Supabase deployment are not implemented.
- Publishing this repository publicly exposes its *source code*, not the protected password or database records.
- Updating index.html on GitHub does not automatically redeploy the hosted Supabase Edge Function.
- Shared passwords cannot provide per-agent attribution or revocation. Rotate the password if a team member should lose access.

## Administration

Create the Marketing admin user in Supabase Authentication, then give that user's UUID a row in `profiles` with role `admin`. Do not grant admin privileges in client-editable user metadata. Set Auth signups to invite-only.

The web app is hosted publicly at its URL, but dashboard content actions require password verification.
