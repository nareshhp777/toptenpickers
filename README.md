# Top10 — World's Best Top 10 Rankings

A premium static landing page showcasing curated top 10 car rankings with interactive features, detailed specifications, and SEO-optimized content. Built for GitHub Pages at **toptenpicker.com**.

## Features

- **10 Ranked Cars** — Scroll-snap SPA with full-screen car sections
- **Interactive Gallery** — 5 angle views per car (front, side, rear, 3/4 front, 3/4 rear)
- **Auto-rotation** — Images cycle every 4 seconds; pauses 6s on manual interaction
- **Full Specs Overlay** — 12-field specification panel per car
- **Custom Cursor** — Brand logo cursor with badge-style design on car sections; blue dot on non-car sections
- **Side Navigation** — Ranked dot nav with expandable car name labels
- **Hamburger Menu** — Full-screen Glassmorphism mobile menu with navigation links
- **Site Search** — Instant client-side filter for cars and articles with collapse/expand on mobile
- **Mobile Responsive** — Adapted layout for phones (≤768px and ≤480px) with floating Specs FAB
- **Region-Aware Formatting** — Locale-based unit conversion (mph/km/h, hp/PS, lb-ft/Nm, $/₹/€) via timezone detection
- **Lightning Trail** — GPU-accelerated cursor trail with 8 dots and staggered damping
- **Performance Optimized** — `content-visibility: auto` on car sections, `aspect-ratio` on thumbnails, LCP image preload, non-blocking preloader
- **SEO Optimized** — JSON-LD structured data, sitemap.xml, robots.txt, meta tags, Open Graph
- **Google Analytics** — Tracked via G-HPLGYD20BG with custom GA4 event trackers (specs opens, angle clicks, section views, search queries)
- **Recent Posts** — 15 SEO articles across automotive, tech, gaming, and lifestyle categories
- **Core Pages** — About, Contact, Privacy Policy, Disclaimer
- **Footer** — Premium Glassmorphism footer with "Designed & Developed by Naresh Pawar" credit

## Tech Stack

- **Vanilla HTML/CSS/JS** — No frameworks or build tools
- **Google Fonts** — Inter (300–900), Space Grotesk (400, 700) with `font-display: optional`
- **Font Awesome 6** — Icons with deferred loading (`media="print"`)
- **GitHub Pages** — Hosting with custom domain (toptenpicker.com)

## Project Structure

```
top-cars/
├── index.html              # Main SPA landing page
├── style.css               # Shared CSS for core pages
├── about.html              # About page
├── contact.html            # Contact page
├── privacy-policy.html     # Privacy policy
├── disclaimer.html         # Disclaimer
├── sitemap.xml             # SEO sitemap (22 URLs)
├── robots.txt              # Robots exclusion rules
├── CNAME                   # Custom domain (toptenpicker.com)
├── .gitignore
├── README.md
├── articles/               # SEO articles (15 total)
│   ├── top-10-sports-bikes-2026.html
│   ├── top-10-luxury-yachts.html
│   ├── top-10-airplanes.html
│   ├── top-10-f1-cars-all-time.html
│   ├── top-10-must-have-tech-gadgets.html
│   ├── top-10-electric-sports-bikes.html
│   ├── top-10-high-speed-trains.html
│   ├── top-10-professional-cameras.html
│   ├── top-10-powerboats.html
│   ├── top-10-gaming-consoles.html
│   ├── top-10-electric-sports-cars.html
│   ├── top-10-smartphones.html
│   ├── top-10-gaming-laptops.html
│   ├── top-10-pc-games.html
│   └── top-10-mobile-games.html
└── cars/                   # Car assets (10 folders)
    ├── BugattiChironSuperSport/
    ├── KoenigseggJeskoAbsolut/
    ├── FerrariSF90Stradale/
    ├── LamborghiniRevuelto/
    ├── Porsche911TurboS/
    ├── McLarenArtura/
    ├── AstonMartinDBS770/
    ├── Mercedes-AMG-GT-BlackSeries/
    ├── Rolls-RoyceSpectre/
    └── Audi-R8-Performance/
        ├── front.webp
        ├── side.webp
        ├── rear.webp
        ├── front-three-quarter.webp
        ├── rear-three-quarter.webp
        └── logo.webp
```

## Car Data

Each car includes: name, maker, rank, folder reference, engine, horsepower, top speed, price, description, and 12 detailed specs (0-60, top speed, engine, hp, torque, transmission, drivetrain, weight, production years, etc.).

| Rank | Car | Price |
|------|-----|-------|
| 1 | Bugatti Chiron Super Sport | $3.9M |
| 2 | Koenigsegg Jesko Absolut | $2.8M |
| 3 | Ferrari SF90 Stradale | $524K |
| 4 | Lamborghini Revuelto | $608K |
| 5 | Porsche 911 Turbo S | $230K |
| 6 | McLaren Artura | $237K |
| 7 | Aston Martin DBS 770 | $388K |
| 8 | Mercedes-AMG GT Black Series | $325K |
| 9 | Rolls-Royce Spectre | $420K |
| 10 | Audi R8 Performance | $210K |

## Articles

All articles follow a consistent template: hero section with category label, `<ol class="rank-list">` countdown with `.spec-row` data points, and 800-word authoritative content.

| Category | Article | Topics |
|----------|---------|--------|
| Sports Bikes | Top 10 Sports Bikes of 2026 | Speed, aerodynamics, track performance |
| Luxury Yachts | Top 10 Luxury Yachts of 2026 | Design, amenities, global cruising |
| Aviation | Top 10 Airplanes & Private Jets | Range, speed, luxury, engineering |
| Formula 1 | Top 10 F1 Cars of All Time | Championship-winning machines, legendary engines |
| Tech Gadgets | Top 10 Must-Have Tech Gadgets of 2026 | Innovation, daily utility |
| Electric Motorcycles | Top 10 Electric Sports Bikes of 2026 | 0-60, battery range, EV engineering |
| High-Speed Rail | Top 10 Fastest Trains in the World | Maglev technology, aerodynamic rail |
| Photography | Top 10 Professional Cameras of 2026 | Sensor size, frame rates, creator gear |
| Powerboats | Top 10 High-Speed Powerboats | Offshore racing, hull design |
| Gaming Hardware | Top 10 Gaming Consoles & Handhelds | Teraflops, ray-tracing, next-gen hardware |
| EV Performance | Top 10 Electric Sports Cars of 2026 | 0-60, 800V/900V architecture, torque |
| Mobile Tech | Top 10 Flagship Smartphones of 2026 | AI, 1-inch sensors, titanium builds |
| PC Gaming | Top 10 Gaming Laptops of 2026 | RTX 50-series, OLED refresh rates |
| PC Gaming | Top 10 Most Graphically Demanding PC Games | Path-tracing, UE5, open-world fidelity |
| Mobile Gaming | Top 10 High-Fidelity Mobile Games | Cross-platform engines, esports |

## Local Development

No build step required. Serve with any static file server:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .

# VS Code
# Install "Live Server" extension and right-click index.html
```

Open `http://localhost:8000` in a browser.

## Performance

- All car images served as **WebP** (converted from PNG, ~98% size reduction). Total image payload: ~7 MB across 60 images.
- **LCP image preload** for the first visible car (Audi R8 front.webp)
- **`content-visibility: auto`** on car sections to skip rendering off-screen content
- **`aspect-ratio: 1/1`** on thumbnail buttons to prevent CLS
- **`font-display: optional`** to prevent layout shift from font loading
- **Non-blocking preloader** — DOM builds immediately, preloader fades after 800ms
- **Deferred Font Awesome** — loaded via `media="print"` for non-blocking render
- **Deferred Google Analytics** — loaded via `requestIdleCallback`

## Google Analytics Events

Custom GA4 event tracking is implemented for:

| Event | Trigger | Parameters |
|-------|---------|------------|
| `specs_overlay_open` | Click on Specs button | `car_name`, `car_rank` |
| `angle_tab_click` | Click on angle thumbnail | `car_name`, `angle_view` |
| `car_section_view` | Scroll to car section (debounced) | `car_name`, `rank_position` |
| `instant_search_query` | Search input (debounced 800ms) | `search_term` |

## License

All rights reserved. Content and images are for demonstration purposes.
