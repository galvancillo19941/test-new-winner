# Static site skeleton

Blank static site for Netflix's **static** microsite infrastructure
(GitHub → AWS CodePipeline/CodeBuild → S3 → CloudFront), built by Probability.

It is a fully static site (HTML, CSS, JS — no server code). The page is
prerendered at build time (Vue 3 SSR → plain HTML) and hydrated in the browser.

## Stack

- Vue 3 + TailwindCSS v4, built with [Vite+](https://viteplus.dev) (`vp`)
- Zod for the content schema (`content/config.json` is validated at build time)

Node ≥ 24 and Vite+ are required.

## Commands

```bash
vp install            # install dependencies
vp dev                # local dev server (client-side render, test environment)
vp test               # unit tests
vp check              # format + lint + type check
vp run build:test     # static build for the test environment → dist/
vp run build:prod     # static build for production → dist/
vp preview            # serve dist/ locally
```

## Layout

```
content/              — the site's CONTENT (edit these to change copy/looks)
  config.json         — name, language, per-environment settings, SEO, error page
  theme.css           — the site's styles
  img/                — images (favicon, share image…), referenced as `img/…`
src/
  pages/              — LandingPage (/) and ErrorPage (error.html)
  components/         — one component per file (pages only compose components)
  site/               — schema.ts (config schema), site.ts (resolved config,
                        asset URLs), head.ts (<head> + CSP built at build time)
  main.ts             — client entry (hydrates the prerendered page)
  entry-server.ts     — build-time renderer (never shipped)
scripts/
  build.ts            — type-check → client build → SSR build → prerender
  prerender.ts        — writes index.html, error.html, robots.txt, sitemap.xml
SECURITY.md           — Netflix security requirements and how this site meets them
```

## Environments

`content/config.json` → `environments.test` / `environments.prod`:

| Key       | Meaning                                                                 |
| --------- | ----------------------------------------------------------------------- |
| `siteUrl` | Public origin (`https://www.…`, no path). **Required for `build:prod`** |

What changes per build:

| Build        | robots.txt               | `<meta name="robots">` | sitemap.xml           |
| ------------ | ------------------------ | ---------------------- | --------------------- |
| `build:test` | `Disallow: /`            | `noindex, nofollow`    | only if `siteUrl` set |
| `build:prod` | `Allow: /` + sitemap URL | —                      | yes                   |

## Build output (`dist/`)

```
index.html    — prerendered landing page (real markup, title, description,
                Open Graph / Twitter tags, CSP) + the client bundle
error.html    — custom error page, no JavaScript (S3 serves it for missing paths)
robots.txt
sitemap.xml   — prod (or whenever siteUrl is set)
assets/       — hashed JS, CSS, images
```

No source maps are emitted. Every page is a real file, so S3 needs no rewrites.

## Deploying to Netflix

Netflix provides a GitHub repository with two branches; any push deploys:

- `deploy-test` → staging S3 bucket
- `deploy-prod` → production S3 bucket

The build for each branch is `vp run build:test` / `vp run build:prod`, and the
content of `dist/` is what goes to the bucket root.

## Preview on Probability's Coolify

`nixpacks.toml` builds the **test** environment for the Coolify preview
(static site, publish directory `dist`), behind HTTP Basic Auth.
