# Runtime and assets
- Runtime env schema lives in `src/env.ts` using `@t3-oss/env-nextjs`.
- Server env: `NODE_ENV` and `IS_MAINTENANCE`; setting `IS_MAINTENANCE=true` swaps the entire site shell for `src/app/maintenance.tsx`.
- Client env includes `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`, and optional public social/repo URLs, though `src/config/site.ts` currently hardcodes the social profile URLs and email.
- `src/app/layout.tsx` uses `siteConfig.url.base` to build `metadataBase`, so local/production URL env values matter for metadata correctness.
- `next.config.ts` enables the React Compiler and experimental view transitions.
- `BlurImage` intentionally uses a native `img` element instead of `next/image`, which avoids remote image config requirements for the current mix of local and remote images.
- Portfolio assets of note: resume PDF in `public/cv/`, hero profile illustration in `public/assets/`, and logo SVG in `public/brand/`.