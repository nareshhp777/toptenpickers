const fs = require('fs');
const path = require('path');

const coversDir = path.join(__dirname, '..', 'covers');
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

const covers = [
  {
    file: 'smartphones.svg',
    category: 'MOBILE TECH',
    title: 'Top 10 Flagship Smartphones',
    subtitle: 'AI Processing, Titanium & 1" Sensors',
    c1: '#3b82f6',
    c2: '#8b5cf6',
    icon: `<g transform="translate(400, 205)">
      <!-- Phone Body -->
      <rect x="-65" y="-105" width="130" height="210" rx="24" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <!-- Screen Display -->
      <rect x="-56" y="-95" width="112" height="190" rx="16" fill="url(#screenGrad)" opacity="0.9"/>
      <!-- Dynamic Island / Camera Pill -->
      <rect x="-18" y="-85" width="36" height="10" rx="5" fill="#000"/>
      <!-- Triple Camera Ring on Back reflection -->
      <circle cx="-32" cy="-62" r="9" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <circle cx="-32" cy="-62" r="4" fill="#93c5fd"/>
      <circle cx="-32" cy="-38" r="9" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <circle cx="-32" cy="-38" r="4" fill="#93c5fd"/>
      <circle cx="-10" cy="-50" r="8" fill="none" stroke="#a78bfa" stroke-width="2"/>
      <circle cx="-10" cy="-50" r="3" fill="#c4b5fd"/>
      <!-- Wave lines on screen -->
      <path d="M-40 20 Q-20 -10 0 20 T40 20" fill="none" stroke="#60a5fa" stroke-width="2" opacity="0.6"/>
      <path d="M-40 40 Q-20 10 0 40 T40 40" fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.4"/>
    </g>`
  },
  {
    file: 'gaming-consoles.svg',
    category: 'GAMING HARDWARE',
    title: 'Top 10 Gaming Consoles & Handhelds',
    subtitle: 'Next-Gen Silicon, OLED & Ray Tracing',
    c1: '#a855f7',
    c2: '#ec4899',
    icon: `<g transform="translate(400, 205)">
      <!-- Controller Body -->
      <path d="M-100 -20 C-90 -60, -40 -70, 0 -60 C40 -70, 90 -60, 100 -20 C110 30, 85 90, 60 85 C45 82, 35 45, 0 45 C-35 45, -45 82, -60 85 C-85 90, -110 30, -100 -20 Z" 
            fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <!-- D-Pad -->
      <rect x="-65" y="-20" width="12" height="32" rx="3" fill="#38bdf8"/>
      <rect x="-75" y="-10" width="32" height="12" rx="3" fill="#38bdf8"/>
      <!-- Action Buttons -->
      <circle cx="55" cy="-20" r="6" fill="#f43f5e"/>
      <circle cx="70" cy="-5" r="6" fill="#10b981"/>
      <circle cx="40" cy="-5" r="6" fill="#3b82f6"/>
      <circle cx="55" cy="10" r="6" fill="#f59e0b"/>
      <!-- Thumbsticks -->
      <circle cx="-25" cy="5" r="16" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
      <circle cx="-25" cy="5" r="9" fill="#a855f7" opacity="0.8"/>
      <circle cx="25" cy="5" r="16" fill="#1e293b" stroke="#ec4899" stroke-width="2"/>
      <circle cx="25" cy="5" r="9" fill="#ec4899" opacity="0.8"/>
    </g>`
  },
  {
    file: 'gaming-laptops.svg',
    category: 'PC GAMING',
    title: 'Top 10 Gaming Laptops',
    subtitle: 'RTX 50-Series, Vapor Chambers & OLED',
    c1: '#06b6d4',
    c2: '#3b82f6',
    icon: `<g transform="translate(400, 205)">
      <!-- Laptop Screen Open -->
      <polygon points="-85,-80 85,-80 95,20 -95,20" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <polygon points="-75,-70 75,-70 82,10 -82,10" fill="url(#screenGrad)" opacity="0.85"/>
      <!-- Code/Game Graphic on Screen -->
      <path d="M-40 -40 L-10 -10 L-40 0" fill="none" stroke="#22d3ee" stroke-width="3" stroke-linecap="round"/>
      <rect x="0" y="-10" width="45" height="4" rx="2" fill="#38bdf8"/>
      <!-- Laptop Base -->
      <polygon points="-120,25 120,25 105,75 -105,75" fill="#1e293b" stroke="#3b82f6" stroke-width="2.5"/>
      <!-- Keyboard Glow -->
      <polygon points="-80,32 80,32 72,55 -72,55" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="6,4"/>
      <!-- Trackpad -->
      <polygon points="-25,58 25,58 20,70 -20,70" fill="#0f172a" stroke="#60a5fa" stroke-width="1.5"/>
    </g>`
  },
  {
    file: 'tech-gadgets.svg',
    category: 'TECH GADGETS',
    title: 'Top 10 Must-Have Tech Gadgets',
    subtitle: 'Spatial Vision, Neural Rings & Robotics',
    c1: '#10b981',
    c2: '#06b6d4',
    icon: `<g transform="translate(400, 205)">
      <!-- Spatial Computing Headset Visor -->
      <path d="M-85 -30 C-85 -65, 85 -65, 85 -30 C85 10, 50 35, 0 35 C-50 35, -85 10, -85 -30 Z" 
            fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <!-- Curved Glass Reflection -->
      <path d="M-70 -28 C-70 -52, 70 -52, 70 -28 C70 5, 40 22, 0 22 C-40 22, -70 5, -70 -28 Z" 
            fill="url(#screenGrad)" opacity="0.85"/>
      <path d="M-55 -40 Q0 -30 55 -40" stroke="#34d399" stroke-width="2" fill="none"/>
      <!-- Smart Ring Floating Below -->
      <ellipse cx="0" cy="62" rx="35" ry="14" fill="none" stroke="#2dd4bf" stroke-width="4" filter="url(#glow)"/>
      <ellipse cx="0" cy="62" rx="28" ry="10" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
      <circle cx="20" cy="58" r="4" fill="#34d399" filter="url(#glow)"/>
    </g>`
  },
  {
    file: 'high-speed-trains.svg',
    category: 'HIGH-SPEED RAIL',
    title: 'Top 10 Fastest Trains in the World',
    subtitle: 'Maglev Levitation & 600 km/h Aerodynamics',
    c1: '#f59e0b',
    c2: '#ef4444',
    icon: `<g transform="translate(400, 205)">
      <!-- Aerodynamic Bullet Train Profile -->
      <path d="M-130 35 L-40 35 C30 35, 100 25, 125 -5 C115 -25, 60 -40, -10 -40 L-130 -40 Z" 
            fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <!-- Cockpit Visor / Glass -->
      <path d="M30 -22 C60 -22, 90 -12, 105 -2 C80 5, 50 0, 25 -10 Z" fill="#38bdf8" opacity="0.9"/>
      <!-- Speed Decal Strip -->
      <path d="M-130 5 L70 5" stroke="#f59e0b" stroke-width="3.5"/>
      <path d="M-130 18 L50 18" stroke="#ef4444" stroke-width="2"/>
      <!-- Guideway / Track Rails -->
      <line x1="-150" y1="52" x2="150" y2="52" stroke="#64748b" stroke-width="3"/>
      <line x1="-140" y1="62" x2="140" y2="62" stroke="#475569" stroke-width="2" stroke-dasharray="12,8"/>
      <!-- Velocity Trail Lines -->
      <line x1="80" y1="-28" x2="140" y2="-28" stroke="#f59e0b" stroke-width="2" opacity="0.7"/>
      <line x1="100" y1="-18" x2="155" y2="-18" stroke="#fbbf24" stroke-width="2" opacity="0.8"/>
    </g>`
  },
  {
    file: 'professional-cameras.svg',
    category: 'PHOTOGRAPHY & CINEMA',
    title: 'Top 10 Professional Cameras',
    subtitle: 'Medium Format, Cinema Sensors & 8K RAW',
    c1: '#eab308',
    c2: '#f97316',
    icon: `<g transform="translate(400, 205)">
      <!-- Camera Body -->
      <rect x="-95" y="-55" width="190" height="120" rx="18" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <!-- Viewfinder Bump -->
      <polygon points="-35,-55 -25,-75 25,-75 35,-55" fill="#1e293b" stroke="#eab308" stroke-width="2"/>
      <!-- Shutter Button & Dial -->
      <rect x="55" y="-65" width="18" height="10" rx="3" fill="#f59e0b"/>
      <rect x="-75" y="-62" width="22" height="7" rx="2" fill="#71717a"/>
      <!-- Large Lens Barrel -->
      <circle cx="0" cy="5" r="48" fill="#18181b" stroke="#eab308" stroke-width="3"/>
      <circle cx="0" cy="5" r="38" fill="#09090b" stroke="#f97316" stroke-width="2"/>
      <!-- Aperture Blades and Glass Flare -->
      <circle cx="0" cy="5" r="24" fill="#0284c7" opacity="0.6"/>
      <circle cx="0" cy="5" r="14" fill="#38bdf8" opacity="0.8"/>
      <path d="M-15 -10 A24 24 0 0 1 10 -20" stroke="#fef08a" stroke-width="3" stroke-linecap="round" fill="none"/>
    </g>`
  },
  {
    file: 'pc-games.svg',
    category: 'PC GAMING',
    title: 'Top 10 Most Demanding PC Games',
    subtitle: 'Path Tracing, Unreal Engine 5 & 4K Ultra',
    c1: '#8b5cf6',
    c2: '#ec4899',
    icon: `<g transform="translate(400, 205)">
      <!-- Ultrawide Curved Monitor -->
      <path d="M-110 -60 Q0 -70 110 -60 L105 30 Q0 20 -105 30 Z" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <path d="M-98 -50 Q0 -60 98 -50 L94 20 Q0 12 -94 20 Z" fill="url(#screenGrad)" opacity="0.85"/>
      <!-- Monitor Stand -->
      <polygon points="-12,30 12,30 16,65 -16,65" fill="#334155"/>
      <polygon points="-45,65 45,65 55,75 -55,75" fill="#1e293b" stroke="#8b5cf6" stroke-width="2"/>
      <!-- Raytraced Crystal in Center -->
      <polygon points="0,-35 22,-5 0,15 -22,-5" fill="none" stroke="#f472b6" stroke-width="2.5"/>
      <polygon points="0,-35 22,-5 0,-15" fill="#a855f7" opacity="0.5"/>
      <polygon points="0,15 -22,-5 0,-15" fill="#ec4899" opacity="0.5"/>
    </g>`
  },
  {
    file: 'mobile-games.svg',
    category: 'MOBILE GAMING',
    title: 'Top 10 High-Fidelity Mobile Games',
    subtitle: '120 FPS, Cross-Platform Engines & Esports',
    c1: '#06b6d4',
    c2: '#10b981',
    icon: `<g transform="translate(400, 205)">
      <!-- Landscape Mobile Device -->
      <rect x="-115" y="-60" width="230" height="120" rx="18" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <rect x="-95" y="-50" width="190" height="100" rx="10" fill="url(#screenGrad)" opacity="0.85"/>
      <!-- On-Screen Virtual Controls -->
      <circle cx="-60" cy="0" r="22" fill="none" stroke="#22d3ee" stroke-width="2" stroke-dasharray="8,4"/>
      <circle cx="-60" cy="0" r="10" fill="#06b6d4" opacity="0.7"/>
      <!-- Virtual Action Buttons -->
      <circle cx="55" cy="-12" r="9" fill="#10b981" opacity="0.8"/>
      <circle cx="70" cy="8" r="9" fill="#f59e0b" opacity="0.8"/>
      <circle cx="45" cy="15" r="9" fill="#ef4444" opacity="0.8"/>
      <!-- Center Swords / Shield -->
      <polygon points="0,-25 15,10 -15,10" fill="none" stroke="#a7f3d0" stroke-width="2.5"/>
    </g>`
  },
  {
    file: 'interesting-websites.svg',
    category: 'INTERNET CULTURE',
    title: 'Top 10 Most Fascinating Websites',
    subtitle: 'Interactive Art, Digital Archives & Discovery',
    c1: '#3b82f6',
    c2: '#14b8a6',
    icon: `<g transform="translate(400, 205)">
      <!-- Globe Grid -->
      <circle cx="0" cy="0" r="65" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <ellipse cx="0" cy="0" rx="65" ry="24" fill="none" stroke="#38bdf8" stroke-width="1.8"/>
      <ellipse cx="0" cy="0" rx="28" ry="65" fill="none" stroke="#2dd4bf" stroke-width="1.8"/>
      <line x1="-65" y1="0" x2="65" y2="0" stroke="#38bdf8" stroke-width="1.8"/>
      <!-- Floating Web Browser Bar -->
      <rect x="-80" y="-75" width="160" height="24" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="-68" cy="-63" r="3" fill="#ef4444"/>
      <circle cx="-58" cy="-63" r="3" fill="#f59e0b"/>
      <circle cx="-48" cy="-63" r="3" fill="#10b981"/>
      <rect x="-35" y="-68" width="105" height="10" rx="4" fill="#0f172a"/>
      <!-- Sparkling Nodes -->
      <circle cx="-40" cy="30" r="5" fill="#38bdf8" filter="url(#glow)"/>
      <circle cx="45" cy="-20" r="6" fill="#2dd4bf" filter="url(#glow)"/>
      <circle cx="20" cy="45" r="4" fill="#60a5fa" filter="url(#glow)"/>
    </g>`
  },
  {
    file: 'gaming-companies.svg',
    category: 'GAMING INDUSTRY',
    title: 'Top 10 Video Game Companies',
    subtitle: 'Titans of Innovation, Studios & IP Empires',
    c1: '#f43f5e',
    c2: '#f59e0b',
    icon: `<g transform="translate(400, 205)">
      <!-- Isometric Studio Pillar / Pedestal -->
      <polygon points="0,-65 65,-25 0,15 -65,-25" fill="#1e293b" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <polygon points="-65,-25 0,15 0,85 -65,45" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
      <polygon points="65,-25 0,15 0,85 65,45" fill="#111827" stroke="#f59e0b" stroke-width="2"/>
      <!-- Golden Trophy Crown -->
      <polygon points="0,-50 25,-35 20,-10 -20,-10 -25,-35" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
      <circle cx="0" cy="-25" r="8" fill="#fbbf24" filter="url(#glow)"/>
      <!-- Star Constellation -->
      <polygon points="0,-85 5,-72 18,-72 8,-62 12,-50 0,-58 -12,-50 -8,-62 -18,-72 -5,-72" fill="#fbbf24"/>
    </g>`
  },
  {
    file: 'greatest-movies.svg',
    category: 'CINEMA',
    title: 'Top 10 Greatest Cinematic Masterpieces',
    subtitle: 'Directorial Genius, Storytelling & 35mm Vision',
    c1: '#f59e0b',
    c2: '#ef4444',
    icon: `<g transform="translate(400, 205)">
      <!-- Film Reel Wheel -->
      <circle cx="0" cy="0" r="65" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <circle cx="0" cy="0" r="52" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="14,10"/>
      <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#ef4444" stroke-width="3"/>
      <!-- Reel Spokes / Holes -->
      <circle cx="0" cy="-35" r="10" fill="#020617" stroke="#f59e0b" stroke-width="1.5"/>
      <circle cx="30" cy="-18" r="10" fill="#020617" stroke="#f59e0b" stroke-width="1.5"/>
      <circle cx="30" cy="18" r="10" fill="#020617" stroke="#f59e0b" stroke-width="1.5"/>
      <circle cx="0" cy="35" r="10" fill="#020617" stroke="#f59e0b" stroke-width="1.5"/>
      <circle cx="-30" cy="18" r="10" fill="#020617" stroke="#f59e0b" stroke-width="1.5"/>
      <circle cx="-30" cy="-18" r="10" fill="#020617" stroke="#f59e0b" stroke-width="1.5"/>
      <!-- Film Strip Rolling Off -->
      <path d="M-60 25 C-90 40, -110 80, -130 90" fill="none" stroke="#f59e0b" stroke-width="12" stroke-dasharray="2,6"/>
    </g>`
  },
  {
    file: 'bingeworthy-series.svg',
    category: 'TELEVISION',
    title: 'Top 10 Most Gripping TV Series',
    subtitle: 'Golden Age Drama, Prestige Scripts & Twists',
    c1: '#ec4899',
    c2: '#8b5cf6',
    icon: `<g transform="translate(400, 205)">
      <!-- Ultra-thin OLED TV Screen -->
      <rect x="-105" y="-65" width="210" height="125" rx="12" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <rect x="-95" y="-55" width="190" height="105" rx="6" fill="url(#screenGrad)" opacity="0.9"/>
      <!-- Glowing Play Triangle -->
      <circle cx="0" cy="-2" r="28" fill="#1e293b" stroke="#ec4899" stroke-width="2.5" filter="url(#glow)"/>
      <polygon points="-8,-16 14,-2 -8,12" fill="#f43f5e"/>
      <!-- TV Pedestal -->
      <polygon points="-30,60 30,60 20,72 -20,72" fill="#334155"/>
      <!-- Progress Bar at bottom of screen -->
      <rect x="-75" y="36" width="150" height="4" rx="2" fill="#374151"/>
      <rect x="-75" y="36" width="95" height="4" rx="2" fill="#ec4899"/>
    </g>`
  },
  {
    file: 'greatest-albums.svg',
    category: 'MUSIC HISTORY',
    title: 'Top 10 Groundbreaking Music Albums',
    subtitle: 'Vinyl Acoustics, Studio Production & Legacy',
    c1: '#6366f1',
    c2: '#a855f7',
    icon: `<g transform="translate(400, 205)">
      <!-- Vinyl LP Record -->
      <circle cx="-25" cy="0" r="70" fill="#09090b" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <!-- Vinyl Grooves -->
      <circle cx="-25" cy="0" r="58" fill="none" stroke="#27272a" stroke-width="1.5"/>
      <circle cx="-25" cy="0" r="48" fill="none" stroke="#27272a" stroke-width="1.5"/>
      <circle cx="-25" cy="0" r="38" fill="none" stroke="#27272a" stroke-width="1.5"/>
      <!-- Record Label -->
      <circle cx="-25" cy="0" r="24" fill="#a855f7"/>
      <circle cx="-25" cy="0" r="6" fill="#000"/>
      <!-- Turntable Tonearm -->
      <circle cx="70" cy="-55" r="10" fill="#334155" stroke="#6366f1" stroke-width="2"/>
      <path d="M70 -55 L35 0 L15 25" fill="none" stroke="#cbd5e1" stroke-width="3.5" stroke-linecap="round"/>
      <rect x="7" y="20" width="16" height="12" rx="3" fill="#a855f7" transform="rotate(30 15 25)"/>
      <!-- Sound Wave Pulses -->
      <path d="M60 20 Q80 30 60 40" fill="none" stroke="#c084fc" stroke-width="2" opacity="0.6"/>
      <path d="M75 12 Q100 28 75 48" fill="none" stroke="#818cf8" stroke-width="2" opacity="0.4"/>
    </g>`
  }
];

covers.forEach(c => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060913"/>
      <stop offset="50%" stop-color="#0b1124"/>
      <stop offset="100%" stop-color="#05070f"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c.c1}"/>
      <stop offset="100%" stop-color="${c.c2}"/>
    </linearGradient>
    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <radialGradient id="meshGlow" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="${c.c1}" stop-opacity="0.28"/>
      <stop offset="50%" stop-color="${c.c2}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="800" height="450" fill="url(#bgGrad)"/>
  <rect width="800" height="450" fill="url(#grid)"/>

  <!-- Ambient Ambient Glow -->
  <circle cx="400" cy="205" r="220" fill="url(#meshGlow)"/>

  <!-- Geometric Rings -->
  <circle cx="400" cy="205" r="180" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="8,8"/>
  <circle cx="400" cy="205" r="230" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>

  <!-- Central Illustrated Icon -->
  ${c.icon}

  <!-- Gradient Overlay Scrim for Text Readability -->
  <rect y="290" width="800" height="160" fill="linear-gradient(to bottom, transparent 0%, rgba(5,7,15,0.85) 40%, rgba(5,7,15,0.98) 100%)"/>

  <!-- Top-Right Brand Watermark -->
  <g transform="translate(690, 40)">
    <rect x="-10" y="-14" width="85" height="26" rx="13" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="32" y="4" font-family="'Space Grotesk', -apple-system, sans-serif" font-weight="900" font-size="11" fill="#ffffff" letter-spacing="1.5" text-anchor="middle">TOP10</text>
  </g>

  <!-- Top-Left Category Badge -->
  <g transform="translate(45, 42)">
    <rect x="0" y="-15" width="${c.category.length * 9 + 28}" height="28" rx="14" fill="${c.c1}" fill-opacity="0.18" stroke="${c.c1}" stroke-width="1.2"/>
    <circle cx="14" cy="-1" r="4" fill="${c.c1}"/>
    <text x="26" y="3" font-family="'Space Grotesk', -apple-system, sans-serif" font-weight="800" font-size="11" fill="#ffffff" letter-spacing="1.5">${c.category}</text>
  </g>

  <!-- Bottom Title & Subtitle -->
  <text x="45" y="380" font-family="'Space Grotesk', -apple-system, sans-serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="-0.5">${c.title}</text>
  <text x="45" y="412" font-family="'Inter', -apple-system, sans-serif" font-weight="500" font-size="14" fill="#94a3b8" letter-spacing="0.2">${c.subtitle}</text>

  <!-- Bottom Right "10 Ranked" Badge -->
  <g transform="translate(755, 395)">
    <text x="0" y="0" font-family="'Space Grotesk', -apple-system, sans-serif" font-weight="800" font-size="13" fill="${c.c1}" text-anchor="end" letter-spacing="1">10 RANKED ITEMS →</text>
  </g>
</svg>`;

  fs.writeFileSync(path.join(coversDir, c.file), svg.trim());
  console.log('Created cover:', c.file);
});
