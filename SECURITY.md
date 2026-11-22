# Security

How this site meets Netflix's _Microsites Security Reference_. The site is
static: no server code, no database, no login, no cookies, no secrets.

## Architecture

```
Browser ──GET──▶ CloudFront ─▶ S3 (this repo's dist/: HTML, CSS, JS, images)
```

The site calls no API and loads nothing from third parties.

## Personal information collected

None.

## Netflix requirements

| Requirement                             | Status | How                                                                       |
| --------------------------------------- | ------ | ------------------------------------------------------------------------- |
| Source code available before production | ✅     | This repository                                                           |
| Route / API listing                     | ✅     | The site serves `/` (and `error.html` for missing paths); it calls no API |
| No secrets in code                      | ✅     | None exist; `.gitignore` blocks `.env*`, keys, `.DS_Store`, databases     |
| Login / session management              | ✅ N/A | No login, no sessions                                                     |
| TLS 1.3, HTTP → HTTPS                   | ✅     | Netflix CloudFront; the page also sends `upgrade-insecure-requests`       |
| Prepared statements / SQL               | ✅ N/A | No database                                                               |
| Admin panel                             | ✅ N/A | None                                                                      |
| Dependency security                     | ✅     | `vp pm audit` runs in CI; only maintained packages                        |
| Debug mode off in production            | ✅     | No source maps                                                            |
| Cookies                                 | ✅     | The site sets none (CloudFront drops them anyway)                         |

## Hardening in place

- **Content-Security-Policy** (as `<meta>`, S3 can't send headers): only
  `'self'`; no inline or eval'd scripts; `object-src 'none'`. Built in
  `src/site/head.ts`. Adding an origin means updating the CSP and this file.
- **Third parties**: none. Any library is bundled from npm into the site's own
  assets (no CDN).
- **No PI in URLs, storage or cookies.**
- **`noindex` + `Disallow: /`** on every test build.
- **Build pipeline**: Netflix's CodeBuild installs with
  `pnpm install --frozen-lockfile`, so it gets exactly the versions and
  integrity hashes in `pnpm-lock.yaml`. `vite` is aliased to
  `npm:@voidzero-dev/vite-plus-core` on purpose: it is the Vite+ toolchain
  (`vp`), by VoidZero, the Vite team; it is pinned in the lockfile like any
  other package.

## Pending

1. Netflix: CloudFront response headers on test and prod — HSTS,
   `frame-ancestors 'none'` / `X-Frame-Options: DENY`,
   `X-Content-Type-Options: nosniff`, `Referrer-Policy` — and HTTP → HTTPS
   redirect. A `<meta>` CSP can't set `frame-ancestors`.

## Reporting

Netflix AppSec scans the Netflix-provided repository every 24 h and opens
GitHub Issues (medium and above). Fix within: critical 3, high 5, medium 15
business days. False positives: explain in the issue and close it. Contact:
appsec@netflix.com.
