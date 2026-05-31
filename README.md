# Top10 — World's Best Top 10 Rankings

A premium static landing page showcasing curated top 10 car rankings with interactive features, detailed specifications, and SEO-optimized content. Built for GitHub Pages at **toptenpicker.com**.

## Features

- **10 Ranked Cars** — Scroll-snap SPA with full-screen car sections
- **Interactive Gallery** — 5 angle views per car (front, side, rear, 3/4 front, 3/4 rear)
- **Auto-rotation** — Images cycle every 4 seconds; pauses 6s on manual interaction
- **Full Specs Overlay** — 12-field specification panel per car
- **Custom Cursor** — Brand logo cursor with badge-style design
- **Side Navigation** — Ranked dot nav with expandable car name labels
- **Mobile Responsive** — Adapted layout for phones (≤640px and ≤480px)
- **SEO Optimized** — JSON-LD structured data, sitemap.xml, robots.txt, meta tags
- **Google Analytics** — Tracked via G-HPLGYD20BG
- **Recent Posts** — 5 SEO articles (Sports Bikes, Luxury Yachts, Airplanes, F1 Cars, Tech Gadgets)
- **Core Pages** — About, Contact, Privacy Policy, Disclaimer

## Tech Stack

- **Vanilla HTML/CSS/JS** — No frameworks or build tools
- **Google Fonts** — Inter (300–900), Space Grotesk (400, 700)
- **Font Awesome 6** — Icon set
- **GitHub Pages** — Hosting with custom domain (toptenpicker.com)

## Project Structure

```
top-cars/
├── index.html              # Main SPA landing page
├── style.css               # Shared CSS for all core pages
├── about.html              # About page
├── contact.html            # Contact page (mailto:nareshhp777@gmail.com)
├── privacy-policy.html     # Privacy policy
├── disclaimer.html         # Disclaimer
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Robots exclusion rules
├── CNAME                   # Custom domain (toptenpicker.com)
├── .gitignore
├── README.md
├── articles/               # SEO blog articles
│   ├── top-10-sports-bikes-2026.html
│   ├── top-10-luxury-yachts.html
│   ├── top-10-airplanes.html
│   ├── top-10-f1-cars-all-time.html
│   └── top-10-must-have-tech-gadgets.html
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

## Performance Notes

All car images are served as **WebP** (converted from PNG, ~98% size reduction). Total image payload: ~7 MB across 60 images.

## License

All rights reserved. Content and images are for demonstration purposes.
