# Restore Find-Relief Pages to Match Live (Revert Leftover Base64 Posters)

## Situation

The previous session ended mid-task: an API error interrupted a base64 image conversion. I inspected all three find-relief content files and the brand CSS. **Almost everything is already in the correct, converged state** — the only leftover defect is a small number of base64 video-poster images that break md2jcr publish (per the project memory: base64 in *content* is incompatible with the markup/xwalk publish path; md2jcr discards `data:` URIs).

### What's already correct (no action needed)
- **image-text blocks** (gut-check, savings-tout): correct **10-row** layout with URL image refs (publish-safe per [[image-text-fieldgroup-rowcount]]).
- **HTML entities**: all converted to literal UTF-8 (no `&#8209;`/`&dagger;`/`&ndash;`/etc.); no `<sup>` tags.
- **Safety-bar trailing rows**: `split` / `id:find-relief-safety` / `lang:none` (unique blockId).
- **Dosing-panel custom classes**: `find-relief-dosing-panel` present on both tab-panel sections + additive CSS selector in `styles/linzess/styles.css`.
- **Page-metadata** wrapped in its section `<div>`.
- **CSS background images**: divider.svg + checkmark already base64-inlined; **no** remaining local-path `url()` refs.
- Hero + tout rasters already use linzess.com DAM URL refs (publish-safe).

### The leftover defect to fix
**4 base64 video-poster images** (the publish-breaking leftover) across the three files:
- `index.plain.html` — line 109 (video `6391879132112`) + line 137 (video `6337642986112`)
- `talk-to-a-doctor.plain.html` — line ~109 (video `6391879132112`)
- `how-to-take-linzess.plain.html` — line ~61 (video `6337642986112`)

Each base64 poster sits in the video block's `placeholderImage` row. Left as base64, the deployed md2jcr discards the data URI and risks field-shift / empty publish.

## Fix (per your decisions: all three pages, revert posters to URL refs)

1. **Recover the real Brightcove poster URLs** for video IDs `6391879132112` and `6337642986112` (account `1029485116001`, player `Mcp9TXMkPT`) — fetch the player config to extract the policy key, then query the Brightcove Playback API for each video's `poster`/`thumbnail` URL. (This is the same method used earlier in the session.)
2. **Replace each base64 `<img src="data:image/...">`** poster with `<img src="<brightcove-poster-url>" alt="...">`, preserving the surrounding video block row structure (the `placeholderImage` cell) so the video block decorates identically.
3. **Validate md2jcr** for all three pages against the importer's md2jcr (the deployed-equivalent **10-group** behavior is the source of truth — do not trust local 1.4.1 alone; use the documented FieldGroup check / patched-filter method from [[image-text-fieldgroup-rowcount]]). Expect SUCCESS with no "content isn't mapping" errors and no `data:` URIs remaining.
4. **Verify render**: restart the local preview server, load each of the three pages, confirm the video blocks render with their posters + play overlay and the rest of each page is intact. (Note: the local `aem up --prefer-plain-html` server strips external linzess.com `<img>`; the Brightcove cf-images posters and the md2jcr publish path are authoritative for image display.)
5. **Lint** (`npm run lint`) — expect clean except the 3 pre-existing safety-bar errors.
6. **Hold for approval** before any commit/push (standing rule: never push without explicit confirmation).

## Risks / Notes
- If the Brightcove Playback API can't be reached for a poster URL, fall back per-video to **removing the poster row** (the video block loads its own Brightcove poster from the player link) — publish-safe, just no custom poster ref. I'll flag any such fallback.
- No CSS or block-code changes are needed — this is a content-only revert of the interrupted base64 conversion.
- Pushing/deploying to update the live `.aem.live` page and re-import into AEM Author remain separate follow-ups (and the environment historically lacks git credentials) — out of scope here unless you ask.

## Checklist

- [ ] Recover Brightcove poster URLs for `6391879132112` and `6337642986112` via player config policy key + Playback API
- [ ] `index.plain.html`: replace base64 posters at lines 109 & 137 with poster URL refs
- [ ] `talk-to-a-doctor.plain.html`: replace base64 poster (video `6391879132112`) with poster URL ref
- [ ] `how-to-take-linzess.plain.html`: replace base64 poster (video `6337642986112`) with poster URL ref
- [ ] Confirm zero `data:image` remain in all three content files
- [ ] Validate md2jcr (deployed-equivalent 10-group behavior) for all three pages → SUCCESS, no field-shift
- [ ] Restart preview server; verify each page renders (video posters + overlay, sections intact)
- [ ] `npm run lint` — clean except the 3 pre-existing safety-bar errors
- [ ] Report results; hold for approval before any commit/push

> Execution of the edits, poster fetch, md2jcr validation, preview restart, and lint require **Execute mode** — this artifact is the plan only.
