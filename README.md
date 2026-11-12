# TAAMEER Creator Studio

Internal sales content dashboard with authenticated Supabase-backed agent accounts, rule-based Creator Brain, script writing, reel ideas, knowledge base, planner, saved content, teleprompter, and Marketing overview.

## Live hosting

The production entry point is deployed as a Supabase Edge Function: https://hylcxekemqttsyfnsiov.supabase.co/functions/v1/creator-studio

The GitHub repository contains the application HTML. GitHub Pages is not configured and must not be assumed private merely because this repository is private.

## Access

Provision users in Supabase Authentication. Restrict open registration. Create a profile for each user in the SQL editor (using real UUID from auth.users):

\`\`\`sql
insert into public.profiles(id,display_name,role) values ('REPLACE_UUID','Approved User','agent');
\`\`\`

For Marketing administrators use role \`admin\`. Agent-created content belongs to that account through Postgres RLS. Do not put a service-role key in the browser.

## Production caveats

Rule-based, not generative AI. Sample projects are minimal and need Marketing approval. Arabic translation and video editing are not implemented. Admin editing currently uses the protected Supabase dashboard. If the front-end code changes in GitHub it must be redeployed to the Supabase Edge Function. A CI deployment pipeline is a subsequent enhancement.
