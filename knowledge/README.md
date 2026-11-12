# TAAMEER Agents Studio — Creator Brain Knowledge & AI Architecture

Updated: 12 November 2026

## Verified Qatar real-estate reference library

- Source-controlled master file: `knowledge/qatar-real-estate-verified.json`
- Active restricted Supabase database table: `public.brain_reference_facts`
- Current records: 25, covering ownership/residency/regulation, market indicators, investment education, Lusail, The Pearl Island and Qetaifan Island North.
- Every record includes source title, source URL, source tier, review date, category, tags, and a Marketing-approval flag.
- Reference facts are **source-verified educational content**, not automatically approved TAAMEER project-advertising claims.
- Research sources include the Ministry of Justice, Aqarat, Invest Qatar, Lusail master developer, UDC and Qetaifan Projects. A 2026 ownership-zone report from The Peninsula is flagged as a secondary reference; cite Aqarat's 2026 amendment where possible.
- The record status `source_verified_not_taameer_marketing_approved` is deliberate; an approved project-advertising workflow must be implemented separately.

## Conversation API

Creator Brain now calls Supabase Edge Function `creator-studio` with the authenticated `chat` action. It submits a bounded conversation window, selects relevant official facts from the reference table, and returns the answer plus source URLs. Sources are rendered as links alongside the answer.

The fallback engine handles common scenarios, including “showroom” and “you suggest”, but is **not a general reasoning model**. A real language model is needed to understand arbitrary natural-language and bilingual exchanges consistently.

## Enable an actual conversational language model

1. Create a project-scoped OpenAI API key using the OpenAI Platform setup flow. Do not paste it into source code, GitHub, or a chat message.
2. Open the Supabase project `hylcxekemqttsyfnsiov` in the Supabase dashboard.
3. Navigate to **Edge Functions → Secrets**, and add `OPENAI_API_KEY` with the private key. Optionally set `OPENAI_MODEL` to `gpt-5-mini`.
4. The deployed Edge Function checks for `OPENAI_API_KEY` on each request. If configured, it uses the OpenAI Responses API via the Supabase server, with `store:false`, bounded history, a fixed TAAMEER behavior prompt and relevant retrieved references.
5. Keep billing limits and API usage monitoring enabled. Do not expose API keys in the browser or public repository.

The LLM needs testing with real bilingual conversations and hallucination/fact-citation evaluations before claiming full creative/linguistic quality.

## Guardrails

- Never guarantee a financial return or say property-linked residency is automatic.
- Do not use unverified agent claims as official TAAMEER project facts.
- Clearly distinguish verified external references from Marketing-approved project advertising details.
- Do not assume planned transportation and master-plan amenities are operational.
- Re-check laws and dated statistics before using them in official promotional content.
- Do not present answers as legal or financial advice.
- Historic chats are stored locally in the user's browser; do not claim per-agent cloud memory under a shared password.

## Test prompts

- `hey` → friendly greeting, not a generic sales pitch.
- `showroom` after a filming-location question → immediate shootable idea.
- `you suggest` → concrete recommendation, not the same question again.
- `Explain ownership rules for non-Qataris in 2026` → retrieved legal reference and source link.
- `Compare The Pearl with Lusail` → source-backed comparison and distinction between locations.
- `Does Qetaifan guarantee returns?` → no guarantee, discuss risk and unknowns.
- `اكتب لي ريل باللهجة القطرية عن لوسيل` → natural Qatari Arabic when LLM enabled.
- `What's the exact price for this unit?` → refer to Marketing/Sales unless an approved current project record exists.
