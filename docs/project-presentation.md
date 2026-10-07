# Project presentation

Each repository owns its project identity in `project.json` and its artwork in
`metadata/picture/`. The portfolio and profile reuse those records. Do not keep
different project names or descriptions in separate presentation files.

## Asset contract

| File | Size / shape | Use |
| --- | --- | --- |
| `cover-thumbnail.jpeg` | 1600 × 900, 16:9 | Portfolio index and case-study cover |
| `cover-spotlight.jpeg` | 2400 × 1350, 16:9 | Portfolio spotlight |
| `profile-cover-v2.jpeg` | Subject-specific crop | GitHub profile bento |
| `preview-*.jpeg` | Actual screen size | Product gallery |

Set `thumbnail`, `spotlightImage`, and `profileImage` to these relative paths.
Use `profileSummary` for a short profile caption (40 characters maximum).
The full `summary` describes the product in one sentence. `title` is the same
on every surface. Old manifests remain valid; spotlight falls back to thumbnail.

## Visual rules

- Use clean image-only artwork. Titles, descriptions, arrows, and counters belong
  to the rendering layer, never the cover image.
- Keep one visual identity per project: warm neutral for Portfolio, violet for
  QR Pixel, slate blue for Meteo, and green for Xiaomi Pad 8 Pro.
- Keep subjects inside the central 80% of the image. Preserve faces and devices;
  letterbox a device rather than crop away important hardware.
- Use one focal crop for both 16:9 assets. Export JPEG at quality 85.
- In the profile bento use 20 px gutters, 24 px corner radii, 26 px text insets,
  consistent caption and title baselines, and the same top-right arrow offset.
- Place a subtle dark fade behind profile text. Keep thumbnail and spotlight
  artwork free of text so they can adapt to either theme.
- Generated covers are presentation artwork, not screenshots or evidence of
  implemented features. Label them in the asset README. Gallery captures must
  represent the actual product; label any concepts explicitly.

## Update and verify

1. Update assets and `project.json` in the owning repository.
2. Verify paths, dimensions, and captions before publishing.
3. Revalidate the portfolio's `github-sync` cache after publishing.
4. In the profile repository run `python3 scripts/build-project-bento.py` to
   fetch the manifests and regenerate the composite. Commit the generated SVG.
   This is an explicit rebuild, not an automatic background sync.
5. Preview the portfolio spotlight, index, case study, and profile on desktop
   and mobile. Check crops, legibility, image loading, and destination links.
