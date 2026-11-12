# TAAMEER Agents Studio — Reel Reference Curation

The Reel Reference Library contains **Marketing-selected inspiration videos**, not videos waiting for a second approval inside the dashboard.

## Workflow when Marketing sends a link in chat

1. **Inspect first**: Follow the original post, examine available video footage and creator metadata. Do not invent visual details if the footage is inaccessible. Where possible use creator-provided captions or verified official embed metadata; distinguish metadata from visual inspection.
2. **Prepare a preview card here in chat**, before changing the deployed library. Include the original link, verified creator, suggested title, concise reason it is useful to sales agents, and an assessment of production difficulty.
3. **Classify using evidence**, not assumptions:
   - **Environment**: Indoor, Outdoor, Showroom, Construction Site, Site Visit, Office, Mixed.
   - **Camera setup**: Self-Filmed / Solo, Tripod, Cameraperson, POV, Screen Recording, Voiceover, Mixed.
   - **Content type**: Tips & Tricks, Buyer Advice, Sales Video, Educational, Property Tour, Location Tour, Project Update, Market Insight, Storytelling, Lifestyle, Q&A.
   - **Difficulty**: Easy (phone only), Moderate, Advanced; optionally note whether editing is required.
   - **Format and hook**: Talking to Camera, Walk-and-Talk, Green Screen, Montage, Before/After, Interview, Text Overlay, etc., only when observed.
   - Include a genuine thumbnail from an authorized/official media URL where available; otherwise explain the preview limitation, without inventing a still.
4. **Show the proposed entry to Marketing and wait for explicit confirmation** such as “add it,” “approved,” or “publish.” Do not commit new references to the repository before that approval in this chat.
5. **After confirmation, publish**: Add the verified record to `references/reels.json` using the GitHub connector; deduplicate by canonical video ID/URL and retain verified metadata.
6. The deployed website loads that JSON file. Existing references are already published; lack of an analyzed tag is not a publication problem.

## Metadata schema

```json
{
  "id": "stable-video-id",
  "url": "https://www.tiktok.com/@creator/video/1234567890",
  "platform": "TikTok",
  "creator": "@creator",
  "title": "Reviewed short title",
  "description": "Why an agent should study this reel",
  "thumbnail_url": null,
  "tiktok_video_id": "1234567890",
  "publication_status": "published",
  "analysis_status": "analyzed",
  "filming_environment": "Indoor",
  "camera_setup": "Self-Filmed / Solo",
  "content_type": "Buyer Advice",
  "difficulty": "Easy · smartphone only",
  "format": "Talking to Camera",
  "tags": ["Indoor", "Self-Filmed / Solo", "Buyer Advice", "Tips & Tricks", "Easy · smartphone only"],
  "creative_notes": "How to adapt the format with original wording and accurate TAAMEER information"
}
```

If footage cannot be inspected, leave `analysis_status="not_yet_analyzed"`, set unverified filming classification fields to null and keep `tags=[]`. This status is **internal analysis metadata**, not a user-facing approval requirement. The website should never show “Awaiting approval,” “Pending review,” or similar labels.

Do not copy another creator's footage or script. Link the original and encourage agents to adapt the concept and filming technique in their own words.
