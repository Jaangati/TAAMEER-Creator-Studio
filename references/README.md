# TAAMEER Reel Reference Library

This is a **Marketing-curated inspiration bank**, not a separate content-creation tool.

## How it works

1. Marketing sends a TikTok / Instagram / YouTube / other public reel URL in a ChatGPT conversation and asks for it to be added to the Reference Library.
2. Inspect the original reel where tool access permits. Extract verified title/creator, format, hook approach, practical shooting difficulty, educational angle, approximate duration and a publicly accessible thumbnail URL where available. **Never invent footage, thumbnails, titles, creators or filming characteristics.**
3. Normalize the entry and add/update it in `references/reels.json` through the GitHub connector, using a stable URL-derived ID. Avoid duplicates.
4. Tag by *verified content*, selecting from e.g. `Direct to Camera`, `POV`, `Voiceover`, `Showroom`, `Location Walkthrough`, `Buyer Education`, `Personal Branding`, `Hook Inspiration`, `Storytelling`, `Simple Smartphone Shoot`. Do not add these tags without viewing content.
5. Set `review_status` to `reviewed` only when the reel was actually inspected; otherwise keep `pending_review`, leave any unconfirmed metadata blank and explain the limitation.
6. Commit the JSON change. GitHub Pages automatically publishes the revised reference cards, without agent edits or dashboard data entry.

## Entry schema

```json
{
  "id": "unique-public-id",
  "platform": "TikTok",
  "url": "https://vt.tiktok.com/example/",
  "title": "Verified descriptive title",
  "description": "Why this is a useful filming reference",
  "thumbnail_url": null,
  "creator": null,
  "duration_seconds": null,
  "tags": ["Direct to Camera", "Buyer Education"],
  "review_status": "reviewed",
  "difficulty": "Easy · smartphone only",
  "format": "Direct-to-camera",
  "creative_notes": "How a TAAMEER agent can adapt the technique using original wording and approved facts",
  "added_on": "2026-11-12",
  "source": "Marketing submission"
}
```

Only use `reviewed` and concrete tags if the original has been inspected. When a TikTok short link cannot be resolved, keep the source URL as-is and use a branded preview placeholder. Never download or redistribute another creator's footage without permission. Reference cards link to the creator's original post.

## Publishing

The GitHub Pages workflow copies `references/` into the deployed static site. Frontend loads `references/reels.json` with `cache: no-store` and supports searching and filtering by tags. To add references, only update the repository JSON; no frontend code change is required.
