# Top10 — World's Best Top 10 Rankings

A premium multi-language ranking site with interactive car showcase, detailed specifications, 200+ SEO articles, and full localization. Built with **Eleventy** and deployed to **GitHub Pages** at **[toptenpicker.com](https://toptenpicker.com)**.

## Features

- **10 Ranked Cars** — Scroll-snap SPA with full-screen car sections
- **Interactive Gallery** — 5 angle views per car (front, side, rear, 3/4 front, 3/4 rear)
- **Auto-rotation** — Images cycle every 4 seconds; pauses 6s on manual interaction
- **Full Specs Overlay** — 12-field specification panel per car
- **Custom Cursor** — Brand logo cursor with badge-style design on car sections; blue dot on non-car sections
- **10 Localized Versions** — ES, DE, FR, JA, PT, HI, AR, KO, IT with translated UI, hreflang tags, and region-aware formatting
- **Side Navigation** — Ranked dot nav with expandable car name labels
- **Hamburger Menu** — Full-screen Glassmorphism mobile menu with navigation links
- **Language Selector** — 10-language dropdown with click-outside-close and Escape key support
- **Site Search** — Instant client-side filter for cars and articles with collapse/expand on mobile
- **Mobile Responsive** — Adapted layout for phones (≤768px and ≤480px) with floating Specs FAB
- **Region-Aware Formatting** — Locale-based unit conversion (mph/km/h, hp/PS, lb-ft/Nm, $/₹/€) via timezone detection
- **Centralized Engine** — All logic in `/app.js` (28KB minified), shared across all pages
- **200+ SEO Articles** — Across 10 locales, with canonical URLs and hreflang tags
- **SEO Optimized** — JSON-LD structured data, auto-generated sitemap.xml, robots.txt, Open Graph tags
- **Google Analytics** — Tracked via G-HPLGYD20BG with custom GA4 events
- **Google AdSense** — Auto-ads with local environment guard

## Tech Stack

- **[Eleventy (11ty)](https://www.11ty.dev/)** — Static site generator (Nunjucks templates)
- **Vanilla JS** — All interactivity in `/app.js` (minified via esbuild)
- **Vanilla CSS** — `/style.css` (minified via lightningcss)
- **Cheerio** — Used in migration scripts for DOM parsing
- **GitHub Pages** — Deployed via GitHub Actions workflow
- **Image Format** — All images served as **WebP**

## Project Structure

```
top-cars/
├── src/                        # Eleventy source directory
│   ├── _includes/layouts/      # Nunjucks layouts
│   │   ├── base.njk            # Document shell + SEO tags
│   │   ├── article.njk         # Article & static page layout
│   │   ├── homepage.njk        # Homepage SPA layout
│   │   └── showcase.njk        # Sports-bike gallery layout
│   ├── index.html              # Main SPA landing page (generated)
│   ├── about.html              # About page (generated)
│   ├── contact.html            # Contact page (generated)
│   ├── privacy-policy.html     # Privacy policy (generated)
│   ├── disclaimer.html         # Disclaimer (generated)
│   ├── articles/               # 20 SEO articles (generated)
│   ├── sitemap.xml.njk         # Auto-generated sitemap template
│   ├── .nojekyll               # Prevents Jekyll processing on GitHub Pages
│   ├── ar/...                  # Arabic localized pages
│   ├── de/...                  # German localized pages
│   ├── es/...                  # Spanish localized pages
│   ├── fr/...                  # French localized pages
│   ├── hi/...                  # Hindi localized pages
│   ├── it/...                  # Italian localized pages
│   ├── ja/...                  # Japanese localized pages
│   ├── ko/...                  # Korean localized pages
│   └── pt/...                  # Portuguese localized pages
├── app.js                      # Centralized JS engine
├── style.css                   # Shared stylesheet
├── favicon.svg                 # Favicon
├── og-image.png                # Open Graph image (1200x630)
├── CNAME                       # Custom domain (toptenpicker.com)
├── robots.txt                  # Crawler instructions
├── ads.txt                     # Google AdSense verification
├── cars/                       # Car images (60 WebP files, 10 models × 6 angles)
├── bikes/                      # Bike images (30 WebP files, 10 models × 3 angles)
├── .eleventy.js                # Eleventy configuration
├── scripts/
│   ├── migrate-to-eleventy.js  # Legacy-to-Eleventy migration parser
│   ├── verify-parity.js        # Legacy vs built output verifier
│   ├── minify-build.js         # Post-build JS/CSS minification
│   └── lib/site-paths.js       # Shared locale/path/URL helpers
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions Pages deployment
└── package.json
```

## Local Development

```bash
# Install dependencies
npm install

# Start Eleventy dev server with live reload
npm run serve
# → http://localhost:8080

# Full production build (Eleventy + minification)
npm run build
# → outputs to _site/

# Serve the build output locally
npx serve _site
```

### Maintenance Scripts

```bash
# Re-generate src/ from legacy HTML (if needed)
npm run migrate:write

# Verify built output matches legacy pages
npm run verify:parity

# Check migration without writing
npm run migrate:check
```

## Performance

- All images served as **WebP** (converted from PNG, ~98% size reduction)
- **Smart image preloading** — only first car section loaded eagerly; rest lazy-loaded via IntersectionObserver
- **Cursor trail pauses** when tab hidden or mouse idle to save CPU/battery
- **Explicit width/height** on all images to eliminate CLS
- **`loading="lazy"` + `decoding="async"`** on below-fold images
- **JS minified** via esbuild (39.8→28.7 KB)
- **CSS minified** via lightningcss (10.2→7.6 KB)
- **`font-display: swap`** for instant text rendering
- **Deferred Font Awesome** — non-blocking load via `media="print"`
- **Deferred Google Analytics** — loaded via `requestIdleCallback`

## Google Analytics Events

| Event | Trigger | Parameters |
|-------|---------|------------|
| `specs_overlay_open` | Click on Specs button | `car_name`, `car_rank` |
| `angle_tab_click` | Click on angle thumbnail | `car_name`, `angle_view` |
| `car_section_view` | Scroll to car section | `car_name`, `rank_position` |
| `instant_search_query` | Search input (debounced) | `search_term` |

## License

All rights reserved. Content and images are for demonstration purposes.
