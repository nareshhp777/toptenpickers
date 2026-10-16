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
      <!-- Shutter Button and Dial -->
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
  },
  {
    file: 'electric-sports-cars.svg',
    category: 'EV PERFORMANCE',
    title: 'Top 10 Electric Sports Cars',
    subtitle: 'Torque Vectoring, Solid-State and 0-60 in 1.8s',
    c1: '#06b6d4',
    c2: '#3b82f6',
    icon: `<g transform="translate(400, 205)">
      <!-- Aerodynamic Electric Hypercar Front Stance -->
      <path d="M-120 40 C-115 15, -95 -5, -60 -15 C-30 -22, 30 -22, 60 -15 C95 -5, 115 15, 120 40 L-120 40 Z" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <!-- Windshield and Cockpit Canopy -->
      <path d="M-55 -15 C-40 -50, 40 -50, 55 -15 Z" fill="url(#screenGrad)" opacity="0.9" stroke="#38bdf8" stroke-width="1.5"/>
      <!-- Aerodynamic Hood Channels -->
      <path d="M-30 -15 L-15 15 M30 -15 L15 15" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <!-- Laser Lightbar / LED Headlamps -->
      <path d="M-105 20 L-65 16 M65 16 L105 20" stroke="#22d3ee" stroke-width="4" stroke-linecap="round" filter="url(#glow)"/>
      <path d="M-100 20 L100 20" stroke="#06b6d4" stroke-width="2" opacity="0.8"/>
      <!-- Front Aero Diffuser / Splitter -->
      <polygon points="-130,42 130,42 110,54 -110,54" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
      <rect x="-25" y="44" width="50" height="7" rx="3" fill="#06b6d4" opacity="0.8"/>
      <!-- High-Voltage Energy Bolt Badge -->
      <polygon points="0,-8 5,3 -1,3 3,12 -5,5 0,5" fill="#38bdf8" filter="url(#glow)"/>
      <!-- Velocity / Electric Arcs around wheels -->
      <circle cx="-95" cy="40" r="14" fill="#090d16" stroke="#06b6d4" stroke-width="3"/>
      <circle cx="95" cy="40" r="14" fill="#090d16" stroke="#3b82f6" stroke-width="3"/>
      <path d="M-135 15 Q-110 5 -90 10" fill="none" stroke="#22d3ee" stroke-width="2" opacity="0.7"/>
      <path d="M135 15 Q110 5 90 10" fill="none" stroke="#60a5fa" stroke-width="2" opacity="0.7"/>
    </g>`
  },
  {
    file: 'powerboats.svg',
    category: 'SPEEDBOATS',
    title: 'Top 10 High-Speed Powerboats',
    subtitle: 'Offshore Racing, 150+ MPH and Twin-Turbo V8s',
    c1: '#0ea5e9',
    c2: '#14b8a6',
    icon: `<g transform="translate(400, 205)">
      <!-- Aerodynamic Deep-V Racing Hull Profile -->
      <path d="M-125 15 L20 15 C60 15, 105 5, 125 -10 C95 18, 40 32, -90 32 L-125 32 Z" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <!-- Aerodynamic Cockpit Canopy and Racing Windscreen -->
      <path d="M-30 0 C-10 -25, 40 -25, 65 -5 L20 15 Z" fill="url(#screenGrad)" opacity="0.9" stroke="#38bdf8" stroke-width="1.8"/>
      <!-- Twin Stern Engine Cowls -->
      <rect x="-95" y="2" width="28" height="13" rx="4" fill="#1e293b" stroke="#0ea5e9" stroke-width="1.5"/>
      <rect x="-60" y="2" width="28" height="13" rx="4" fill="#1e293b" stroke="#14b8a6" stroke-width="1.5"/>
      <!-- Hull Racing Decal Stripe -->
      <path d="M-115 22 L75 14" stroke="#2dd4bf" stroke-width="3" stroke-linecap="round"/>
      <!-- Dynamic Water Surface and Wake Spray Lines -->
      <path d="M-140 36 C-100 34, -40 38, 30 36 C80 34, 120 40, 145 38" fill="none" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M-120 44 C-70 42, 0 46, 80 44" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="10,6"/>
      <path d="M70 20 Q100 8 135 2" fill="none" stroke="#5eead4" stroke-width="2.5" opacity="0.8"/>
      <path d="M-130 18 Q-145 10 -150 -5" fill="none" stroke="#38bdf8" stroke-width="2.5" opacity="0.7"/>
    </g>`
  },
  {
    file: 'electric-sports-bikes.svg',
    category: 'ELECTRIC BIKES',
    title: 'Top 10 Electric Sports Bikes',
    subtitle: 'Instant Torque, 200 MPH and Cyber Trellis Frame',
    c1: '#10b981',
    c2: '#06b6d4',
    icon: `<g transform="translate(400, 205)">
      <!-- Rear Wheel -->
      <circle cx="-85" cy="25" r="38" fill="#090d16" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <circle cx="-85" cy="25" r="24" fill="none" stroke="#10b981" stroke-width="2"/>
      <circle cx="-85" cy="25" r="8" fill="#10b981"/>
      <!-- Front Wheel -->
      <circle cx="85" cy="25" r="38" fill="#090d16" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <circle cx="85" cy="25" r="24" fill="none" stroke="#06b6d4" stroke-width="2"/>
      <circle cx="85" cy="25" r="8" fill="#06b6d4"/>
      <!-- High-Voltage Battery Pack Core -->
      <rect x="-35" y="-5" width="60" height="42" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="2.5"/>
      <line x1="-20" y1="6" x2="10" y2="6" stroke="#34d399" stroke-width="3" stroke-dasharray="6,4"/>
      <line x1="-20" y1="18" x2="10" y2="18" stroke="#34d399" stroke-width="3" stroke-dasharray="6,4"/>
      <line x1="-20" y1="30" x2="10" y2="30" stroke="#34d399" stroke-width="3" stroke-dasharray="6,4"/>
      <!-- Aggressive Cyber Fairing and Tail -->
      <path d="M-85 25 L-55 -25 L-15 -25 L25 -40 L70 -30 L85 25" fill="none" stroke="url(#accentGrad)" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M-40 -20 L-10 -35 L45 -25 L25 15 Z" fill="#1e293b" opacity="0.85"/>
      <!-- Inverted Front Fork Suspension -->
      <line x1="45" y1="-30" x2="85" y2="25" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>
      <!-- LED Blade Projector Headlight -->
      <polygon points="65,-30 85,-22 70,-15" fill="#34d399" filter="url(#glow)"/>
      <!-- Energy Discharge Sparks -->
      <path d="M-10 -5 L-5 5 L-12 5 L-7 15" stroke="#2dd4bf" stroke-width="2" fill="none" filter="url(#glow)"/>
    </g>`
  },
  {
    file: 'f1-cars.svg',
    category: 'FORMULA 1',
    title: 'Top 10 F1 Cars of All Time',
    subtitle: 'Ground Effect, Turbo-Hybrids and Championship Legends',
    c1: '#ef4444',
    c2: '#f59e0b',
    icon: `<g transform="translate(400, 205)">
      <!-- Wide Rear Slick Tires -->
      <rect x="-135" y="-15" width="30" height="52" rx="8" fill="#18181b" stroke="#ef4444" stroke-width="2.5" filter="url(#glow)"/>
      <rect x="-130" y="-8" width="8" height="38" rx="2" fill="#ef4444" opacity="0.8"/>
      <!-- Front Steering Slick Tires -->
      <rect x="85" y="-5" width="24" height="42" rx="6" fill="#18181b" stroke="#f59e0b" stroke-width="2"/>
      <rect x="88" y="0" width="6" height="32" rx="2" fill="#f59e0b" opacity="0.8"/>
      <!-- Main Monocoque Chassis -->
      <path d="M-115 15 L-30 15 L20 10 L105 18 L125 22 L20 25 L-115 25 Z" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3"/>
      <!-- Sculpted Sidepod and Air Intake -->
      <path d="M-60 5 C-40 -12, 10 -12, 25 10 L-60 15 Z" fill="#1e1b4b" stroke="#ef4444" stroke-width="2"/>
      <!-- Cockpit Halo Safety Arc and Helmet -->
      <path d="M-15 -5 C-15 -25, 25 -25, 25 -5" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
      <circle cx="5" cy="-8" r="9" fill="#fbbf24" stroke="#ef4444" stroke-width="1.5"/>
      <!-- Engine Airbox Snorkel -->
      <polygon points="-25,0 -15,-28 5,-28 -5,0" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
      <!-- Multi-tier Front Wing and Endplate -->
      <line x1="85" y1="22" x2="135" y2="22" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
      <line x1="95" y1="16" x2="130" y2="16" stroke="#fbbf24" stroke-width="2.5"/>
      <rect x="132" y="10" width="4" height="18" rx="1" fill="#ef4444"/>
      <!-- High Downforce Rear Wing and Endplate -->
      <rect x="-140" y="-35" width="6" height="35" rx="2" fill="#ef4444"/>
      <line x1="-140" y1="-32" x2="-95" y2="-32" stroke="#f59e0b" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="-138" y1="-22" x2="-100" y2="-22" stroke="#ef4444" stroke-width="3"/>
    </g>`
  },
  {
    file: 'sports-bikes.svg',
    category: 'SPORTS BIKES',
    title: 'Top 10 Sports Bikes of 2026',
    subtitle: 'Aerodynamic Winglets, 220 HP and Track Records',
    c1: '#f97316',
    c2: '#ef4444',
    icon: `<g transform="translate(400, 205)">
      <!-- Rear Wheel -->
      <circle cx="-85" cy="25" r="38" fill="#090d16" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <circle cx="-85" cy="25" r="26" fill="none" stroke="#f97316" stroke-width="2"/>
      <circle cx="-85" cy="25" r="8" fill="#ef4444"/>
      <!-- Front Wheel -->
      <circle cx="85" cy="25" r="38" fill="#090d16" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <circle cx="85" cy="25" r="26" fill="none" stroke="#ef4444" stroke-width="2"/>
      <circle cx="85" cy="25" r="8" fill="#f97316"/>
      <!-- Engine Crankcase and Exhaust Pipes -->
      <circle cx="-15" cy="18" r="20" fill="#1e293b" stroke="#71717a" stroke-width="2"/>
      <path d="M-15 25 Q-45 35 -65 20" fill="none" stroke="#f97316" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Aerodynamic Track Fairing Body -->
      <path d="M-85 10 L-45 -22 L-10 -20 L35 -40 L75 -25 L85 25" fill="none" stroke="url(#accentGrad)" stroke-width="3.5" stroke-linecap="round"/>
      <polygon points="-40,-15 5,-15 35,-25 15,10 -25,12" fill="#0f172a" stroke="#f97316" stroke-width="2"/>
      <!-- Aerodynamic Carbon Biplane Winglets -->
      <polygon points="40,-18 70,-14 65,-8 35,-12" fill="#f43f5e" filter="url(#glow)"/>
      <!-- Clip-on Racing Handlebars -->
      <line x1="25" y1="-38" x2="45" y2="-45" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
      <!-- Sharp LED Projector Eyes -->
      <polygon points="65,-22 80,-18 68,-12" fill="#fef08a" filter="url(#glow)"/>
    </g>`
  },
  {
    file: 'luxury-yachts.svg',
    category: 'LUXURY YACHTS',
    title: 'Top 10 Luxury Yachts of 2026',
    subtitle: 'Gigayacht Architecture, Helipads and Beach Clubs',
    c1: '#0ea5e9',
    c2: '#6366f1',
    icon: `<g transform="translate(400, 205)">
      <!-- Sleek Multi-deck Gigayacht Hull -->
      <path d="M-130 18 L60 18 C95 18, 125 8, 140 -5 C115 15, 60 30, -95 30 L-130 30 Z" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <!-- Lower Tier Guest Suites Glass Line -->
      <rect x="-85" y="8" width="115" height="6" rx="2" fill="#38bdf8" opacity="0.8"/>
      <!-- Main Salon Superstructure Deck -->
      <path d="M-80 8 L-75 -8 L35 -8 L55 8 Z" fill="#1e293b" stroke="#0ea5e9" stroke-width="2"/>
      <rect x="-65" y="-5" width="85" height="5" rx="1.5" fill="#e0f2fe" opacity="0.9"/>
      <!-- Bridge Deck and Owner Penthouse -->
      <path d="M-50 -8 L-45 -22 L15 -22 L25 -8 Z" fill="#0f172a" stroke="#6366f1" stroke-width="2"/>
      <!-- Top Satellite Radome and Mast -->
      <line x1="-15" y1="-22" x2="-15" y2="-42" stroke="#94a3b8" stroke-width="2.5"/>
      <circle cx="-15" cy="-35" r="7" fill="#f8fafc" stroke="#0ea5e9" stroke-width="1.5"/>
      <!-- Stern Beach Club Infinity Pool -->
      <rect x="-125" y="20" width="22" height="7" rx="3" fill="#06b6d4" opacity="0.85" filter="url(#glow)"/>
      <!-- Calm Ocean Waves Below -->
      <path d="M-150 34 C-100 32, -40 36, 20 34 C80 32, 130 36, 160 34" fill="none" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
      <path d="M-130 42 C-70 40, 10 44, 90 42" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="12,8"/>
    </g>`
  },
  {
    file: 'airplanes.svg',
    category: 'AVIATION',
    title: 'Top 10 Airplanes and Private Jets',
    subtitle: 'Mach 0.94 Cruising, Ultra Long-Range and Aerodynamics',
    c1: '#6366f1',
    c2: '#a855f7',
    icon: `<g transform="translate(400, 205)">
      <!-- Supersonic Streamlined Fuselage -->
      <path d="M-120 0 C-60 -10, 60 -10, 135 0 C60 10, -60 10, -120 0 Z" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3" filter="url(#glow)"/>
      <!-- Cockpit Flight Deck Visor -->
      <path d="M95 -3 C105 -2, 115 0, 120 0 C115 0, 105 2, 95 3 Z" fill="#38bdf8" opacity="0.95"/>
      <!-- Swept Delta Wing Main Planform -->
      <polygon points="-25,0 -75,-65 -45,-65 35,0" fill="#1e1b4b" stroke="#818cf8" stroke-width="2.5"/>
      <polygon points="-25,0 -75,65 -45,65 35,0" fill="#1e1b4b" stroke="#818cf8" stroke-width="2.5"/>
      <!-- Aerodynamic Winglet Tips -->
      <line x1="-75" y1="-65" x2="-68" y2="-78" stroke="#c084fc" stroke-width="3" stroke-linecap="round"/>
      <line x1="-75" y1="65" x2="-68" y2="78" stroke="#c084fc" stroke-width="3" stroke-linecap="round"/>
      <!-- Twin Rear Turbofan Engine Nacelles -->
      <rect x="-85" y="-18" width="36" height="11" rx="4" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
      <rect x="-85" y="7" width="36" height="11" rx="4" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
      <!-- Supersonic Vapor Trails / Speed Vectors -->
      <line x1="-140" y1="-2" x2="-90" y2="-2" stroke="#6366f1" stroke-width="2.5" opacity="0.6"/>
      <line x1="-155" y1="2" x2="-100" y2="2" stroke="#c084fc" stroke-width="2.5" opacity="0.6"/>
    </g>`
  }
];

function escapeXml(unsafe) {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

covers.forEach(c => {
  // Strip the wrapper <g transform="translate(400, 205)"> to re-center at (400, 225) with hero scale
  const innerIcon = c.icon
    .replace(/<g transform="translate\(400,\s*205\)">/gi, '')
    .replace(/<\/g>\s*$/gi, '')
    .trim();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050811"/>
      <stop offset="50%" stop-color="#0c1326"/>
      <stop offset="100%" stop-color="#04060c"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c.c1}"/>
      <stop offset="100%" stop-color="${c.c2}"/>
    </linearGradient>
    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <radialGradient id="meshGlow" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="${c.c1}" stop-opacity="0.36"/>
      <stop offset="45%" stop-color="${c.c2}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="centerBurst" cx="50%" cy="50%" r="35%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
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

  <!-- Ambient Glowing Auras -->
  <circle cx="400" cy="225" r="230" fill="url(#meshGlow)"/>
  <circle cx="400" cy="225" r="140" fill="url(#centerBurst)"/>

  <!-- Geometric Orbital Rings -->
  <circle cx="400" cy="225" r="195" fill="none" stroke="${c.c1}" stroke-opacity="0.22" stroke-width="1.5" stroke-dasharray="12,8"/>
  <circle cx="400" cy="225" r="150" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <circle cx="400" cy="225" r="240" fill="none" stroke="${c.c2}" stroke-opacity="0.12" stroke-width="1" stroke-dasharray="4,6"/>

  <!-- Corner Tech Accent Brackets -->
  <path d="M 28 50 L 28 28 L 50 28" fill="none" stroke="${c.c1}" stroke-opacity="0.3" stroke-width="2"/>
  <path d="M 772 50 L 772 28 L 750 28" fill="none" stroke="${c.c2}" stroke-opacity="0.3" stroke-width="2"/>
  <path d="M 28 400 L 28 422 L 50 422" fill="none" stroke="${c.c1}" stroke-opacity="0.3" stroke-width="2"/>
  <path d="M 772 400 L 772 422 L 750 422" fill="none" stroke="${c.c2}" stroke-opacity="0.3" stroke-width="2"/>

  <!-- Hero Centered & Scaled Artwork -->
  <g transform="translate(400, 225) scale(1.35)">
    ${innerIcon}
  </g>
</svg>`;

  fs.writeFileSync(path.join(coversDir, c.file), svg.trim());
  console.log('Created cover:', c.file);
});

// Generate default branded website logo thumbnail for missing or fallback article covers
const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="defBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050811"/>
      <stop offset="50%" stop-color="#0d1428"/>
      <stop offset="100%" stop-color="#04060c"/>
    </linearGradient>
    <linearGradient id="defBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9100"/>
      <stop offset="100%" stop-color="#FF3D00"/>
    </linearGradient>
    <linearGradient id="defBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9100" stop-opacity="0.85"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#FF3D00" stop-opacity="0.85"/>
    </linearGradient>
    <radialGradient id="defMeshGlow" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#FF6F00" stop-opacity="0.36"/>
      <stop offset="45%" stop-color="#FF3D00" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <filter id="defGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <pattern id="defGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
    </pattern>
    <style>
      @keyframes neonPulse {
        0%, 100% { transform: scale(1); opacity: 0.85; }
        50% { transform: scale(1.02); opacity: 1; }
      }
      .pulse-ring {
        transform-origin: 400px 225px;
        animation: neonPulse 4s ease-in-out infinite;
      }
    </style>
  </defs>

  <!-- Background Base -->
  <rect width="800" height="450" fill="url(#defBgGrad)"/>
  <rect width="800" height="450" fill="url(#defGrid)"/>

  <!-- Ambient Glowing Aura -->
  <circle cx="400" cy="225" r="235" fill="url(#defMeshGlow)"/>

  <!-- Futuristic Radar and Orbit Rings -->
  <circle class="pulse-ring" cx="400" cy="225" r="195" fill="none" stroke="rgba(255,145,0,0.22)" stroke-width="1.5" stroke-dasharray="10,8"/>
  <circle cx="400" cy="225" r="150" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <circle cx="400" cy="225" r="240" fill="none" stroke="rgba(255,145,0,0.1)" stroke-width="1"/>

  <!-- Corner Tech Accent Brackets -->
  <path d="M 28 50 L 28 28 L 50 28" fill="none" stroke="#FF9100" stroke-opacity="0.35" stroke-width="2"/>
  <path d="M 772 50 L 772 28 L 750 28" fill="none" stroke="#FF3D00" stroke-opacity="0.35" stroke-width="2"/>
  <path d="M 28 400 L 28 422 L 50 422" fill="none" stroke="#FF9100" stroke-opacity="0.35" stroke-width="2"/>
  <path d="M 772 400 L 772 422 L 750 422" fill="none" stroke="#FF3D00" stroke-opacity="0.35" stroke-width="2"/>

  <!-- Central Glassmorphic Logo Shield (Hero Scaled) -->
  <g transform="translate(400, 225) scale(1.35)">
    <!-- Backdrop Card -->
    <rect x="-105" y="-72" width="210" height="144" rx="28" fill="#0d1424" fill-opacity="0.9" stroke="url(#defBorderGrad)" stroke-width="2.5" filter="url(#defGlow)"/>
    <!-- Inner Accent Rim -->
    <rect x="-97" y="-64" width="194" height="128" rx="22" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

    <!-- Website Brand Mark: TOP 10 PICKERS -->
    <text x="0" y="-10" font-family="'Space Grotesk', -apple-system, sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="3" text-anchor="middle">TOP</text>
    <text x="0" y="36" font-family="'Space Grotesk', -apple-system, sans-serif" font-weight="900" font-size="48" fill="url(#defBrandGrad)" letter-spacing="2" text-anchor="middle" filter="url(#defGlow)">10</text>
    <text x="0" y="58" font-family="'Space Grotesk', -apple-system, sans-serif" font-weight="800" font-size="11" fill="#cbd5e1" letter-spacing="4" text-anchor="middle">PICKERS</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(coversDir, 'default-thumb.svg'), defaultSvg.trim());
console.log('Created default cover: default-thumb.svg');

