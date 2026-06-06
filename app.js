/* ============================================================================
 * app.js — Centralized engine for all 11 localized Top10 pages
 * Reads globals (carThemes, cursorBrands, cars, angleNames, angleLabels)
 * declared inline in each index.html file.
 * ============================================================================ */

    // Region detection & unit conversion â€” multi-signal approach
    const tzMap = {
      'Asia/Kolkata':'IN','Asia/Calcutta':'IN','Asia/Karachi':'PK','Asia/Dhaka':'BD','Asia/Kathmandu':'NP',
      'Asia/Colombo':'LK','Asia/Shanghai':'CN','Asia/Tokyo':'JP','Asia/Seoul':'KR',
      'Asia/Dubai':'AE','Asia/Singapore':'SG','Asia/Hong_Kong':'HK','Asia/Bangkok':'TH',
      'Asia/Kuala_Lumpur':'MY','Asia/Jakarta':'ID','Asia/Manila':'PH','Asia/Taipei':'TW',
      'Asia/Riyadh':'SA','Asia/Tehran':'IR','Asia/Ho_Chi_Minh':'VN',
      'America/New_York':'US','America/Chicago':'US','America/Denver':'US','America/Los_Angeles':'US',
      'America/Anchorage':'US','America/Phoenix':'US','America/Detroit':'US','America/Indianapolis':'US',
      'America/Toronto':'CA','America/Vancouver':'CA','America/Montreal':'CA','America/Mexico_City':'MX',
      'America/Sao_Paulo':'BR','America/Argentina/Buenos_Aires':'AR',
      'Europe/London':'GB','Europe/Paris':'FR','Europe/Berlin':'DE','Europe/Madrid':'ES',
      'Europe/Rome':'IT','Europe/Amsterdam':'NL','Europe/Brussels':'BE','Europe/Stockholm':'SE',
      'Europe/Oslo':'NO','Europe/Copenhagen':'DK','Europe/Helsinki':'FI','Europe/Dublin':'IE',
      'Europe/Zurich':'CH','Europe/Vienna':'AT','Europe/Moscow':'RU','Europe/Istanbul':'TR',
      'Europe/Athens':'GR','Europe/Lisbon':'PT','Europe/Warsaw':'PL','Europe/Prague':'CZ','Europe/Budapest':'HU',
      'Australia/Sydney':'AU','Australia/Melbourne':'AU','Australia/Perth':'AU',
      'Pacific/Auckland':'NZ','Africa/Cairo':'EG','Africa/Johannesburg':'ZA','Africa/Lagos':'NG','Africa/Nairobi':'KE'
    };
    const lang = (navigator.language || '').toLowerCase();
    const inLocales = ['en-in','hi-in','bn-in','ta-in','te-in','mr-in','gu-in','kn-in','ml-in','pa-in','or-in'];
    let detectedCode = null;
    // Signal 1: timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tzMap[tz]) detectedCode = tzMap[tz];
    } catch(e) { console.warn('TZ detection failed:', e); }
    // Signal 2: navigator.languages array
    if (!detectedCode) {
      try {
        const langs = navigator.languages || [navigator.language];
        for (const l of langs) {
          const lc = l.toLowerCase();
          if (inLocales.includes(lc)) { detectedCode = 'IN'; break; }
          if (lc.startsWith('en-gb')) { detectedCode = 'GB'; break; }
        }
      } catch(e) {}
    }
    // Signal 3: navigator.language
    if (!detectedCode && lang.includes('-')) {
      const parts = lang.split('-');
      if (parts.length > 1) detectedCode = parts[1].toUpperCase();
    }
    const region = detectedCode === 'US' ? 'US' : 'INTL';
    try {
      const countryName = detectedCode ? new Intl.DisplayNames(['en'], { type:'region' }).of(detectedCode) : null;
      document.getElementById('regionBadge').textContent = countryName || 'Ã°Å¸Å’Â';
    } catch(e) { document.getElementById('regionBadge').textContent = 'Ã°Å¸Å’Â'; }
    console.log('Detected region:', detectedCode, 'from tz/timezone/language');
    function convertUnit(str) {
      if (region === 'US' || !str) return str;
      const m = str.match(/^([\d,.+]+)\s*([\w/Ã‚Â°]+)$/);
      if (m) {
        const num = parseFloat(m[1].replace(/,/g,''));
        const unit = m[2];
        if (unit === 'mph') return Math.round(num * 1.609) + ' km/h';
        if (unit === 'hp') return Math.round(num * 1.014) + ' PS';
        if (unit === 'lb-ft') return Math.round(num * 1.356) + ' Nm';
        if (unit === 'lbs') return Math.round(num / 2.205) + ' kg';
        if (unit === 'miles') return Math.round(num * 1.609) + ' km';
        if (unit.endsWith('MPG')) return (235.21 / num).toFixed(1) + ' L/100km';
      }
      // Handle ranges like "9/14 MPG"
      const m2 = str.match(/^([\d,.+]+)\/([\d,.+]+)\s+(.+)$/);
      if (m2) {
        const unit = m2[3];
        if (unit === 'MPG') {
          return (235.21/parseFloat(m2[1])).toFixed(1) + '/' + (235.21/parseFloat(m2[2])).toFixed(1) + ' L/100km';
        }
      }
      // Handle "$3.9M" Ã¢â€ â€™ local currency based on detected country
      if (str.startsWith('$')) {
        const m3 = str.match(/^\$([\d.]+)([MK]?)$/);
        if (m3) {
          const val = parseFloat(m3[1]) * (m3[2] === 'M' ? 1e6 : m3[2] === 'K' ? 1e3 : 1);
          const currencyMap = {
            'IN': { code:'INR', rate:83 }, 'GB': { code:'GBP', rate:0.79 },
            'EU': { code:'EUR', rate:0.92 }, 'CA': { code:'CAD', rate:1.36 },
            'AU': { code:'AUD', rate:1.52 }, 'JP': { code:'JPY', rate:150 },
            'CH': { code:'CHF', rate:0.88 }, 'SE': { code:'SEK', rate:10.5 },
            'NO': { code:'NOK', rate:10.7 }, 'DK': { code:'DKK', rate:6.9 },
            'PL': { code:'PLN', rate:4.0 }, 'CZ': { code:'CZK', rate:23 },
            'BR': { code:'BRL', rate:4.95 }, 'ZA': { code:'ZAR', rate:18.5 },
            'RU': { code:'RUB', rate:91 }, 'TR': { code:'TRY', rate:30 },
            'MX': { code:'MXN', rate:17 }, 'SG': { code:'SGD', rate:1.34 },
            'HK': { code:'HKD', rate:7.82 }, 'AE': { code:'AED', rate:3.67 },
            'SA': { code:'SAR', rate:3.75 }, 'MY': { code:'MYR', rate:4.7 },
            'TH': { code:'THB', rate:35 }, 'ID': { code:'IDR', rate:15600 }
          };
          const cc = detectedCode && currencyMap[detectedCode] ? detectedCode : 'EU';
          const cur = currencyMap[cc];
          const converted = val * cur.rate;
          try {
            return new Intl.NumberFormat(navigator.language, {
              style:'currency', currency:cur.code,
              maximumFractionDigits:0, notation:'compact', compactDisplay:'short'
            }).format(converted);
          } catch(e) {
            // Fallback if locale doesn't support the currency
            if (converted >= 1e7) return 'Ã¢â€šÂ¹' + (converted/1e7).toFixed(1) + 'Cr';
            if (converted >= 1e5) return 'Ã¢â€šÂ¹' + Math.round(converted/1e5) + 'L';
            if (converted >= 1e3) return 'Ã¢â€šÂ¹' + Math.round(converted/1e3) + 'K';
            return 'Ã¢â€šÂ¹' + Math.round(converted);
          }
        }
      }
      return str;
    }
    function convertLabel(label) {
      if (region === 'US' || !label) return label;
      return label
        .replace('0-60 mph', '0-100 km/h')
        .replace('0-124 mph', '0-200 km/h')
        .replace('miles', 'km')
        .replace('MPG', 'L/100km');
    }

    const loadOrder = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const container = document.getElementById('container');
    const sideNav = document.getElementById('sideNav');
    const navCounter = document.getElementById('navCounter');
    const scrollHint = document.getElementById('scrollHint');
    const cursor = document.getElementById('cursor');
    const cursorLogo = document.getElementById('cursorLogo');
    const preloader = document.getElementById('preloader');
    const preloaderCounter = document.getElementById('preloaderCounter');
    const preloaderBar = document.getElementById('preloaderBar');

    let mx = 0, my = 0, cx = 0, cy = 0;
    // Center cursor on load (cache geometry to avoid layout thrash)
    const vw = window.innerWidth, vh = window.innerHeight;
    cx = vw / 2;
    cy = vh / 2;
    mx = cx; my = cy;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';

    // Light trail initialization
    const trailCount = 8;
    const trailDots = [];
    const trailCoords = [];
    for (let i = 0; i < trailCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      document.body.appendChild(dot);
      trailDots.push(dot);
      trailCoords.push({ x: cx, y: cy });
    }

    let mouseOnScreen = true;
    document.addEventListener('mouseleave', () => { mouseOnScreen = false; });
    document.addEventListener('mouseenter', () => { mouseOnScreen = true; });
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; mouseOnScreen = true; });
    (function loop() {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';

      let tx = cx, ty = cy;
      trailDots.forEach((dot, i) => {
        const coords = trailCoords[i];
        coords.x += (tx - coords.x) * 0.35;
        coords.y += (ty - coords.y) * 0.35;
        const ratio = 1 - (i / trailCount);
        dot.style.transform = `translate3d(${coords.x}px, ${coords.y}px, 0) translate(-50%, -50%) scale(${ratio})`;
        dot.style.opacity = mouseOnScreen ? ratio * 0.55 : 0;
        tx = coords.x;
        ty = coords.y;
      });

      requestAnimationFrame(loop);
    })();

    let loaded = 0;
    const allImages = [];
    cars.forEach(c => {
      angleNames.forEach(a => {
        allImages.push(`/cars/${c.folder}/${a}.webp`);
      });
    });
    const totalImgs = allImages.length;

    function onImgLoad() {
      loaded++;
      const pct = Math.round((loaded / totalImgs) * 100);
      preloaderBar.style.width = pct + '%';
      preloaderCounter.textContent = pct;
      if (loaded >= totalImgs) {
        preloader.classList.add('done');
      }
    }

    // Build page immediately so DOM is fully constructed before preloader fades
    buildPage();
    setTimeout(() => {
      preloader.classList.add('done');
    }, 800);

    allImages.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = onImgLoad;
      img.onerror = onImgLoad;
    });

    let currentCarRank = 1;

    function buildPage() {
      loadOrder.forEach((rank, i) => {
        const c = cars.find(x => x.rank === rank);
        const theme = carThemes[rank];

        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.dataset.index = i;
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-label', 'Go to ' + c.name);
        dot.innerHTML = '<div class="dot-left"><span class="dot-label">' + c.name + '</span><span class="dot-line"></span></div><span class="dot-num">' + c.rank + '</span>';
        dot.addEventListener('click', () => {
          const section = document.getElementById('car-' + c.rank);
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
        sideNav.appendChild(dot);

        const s = document.createElement('section');
        s.className = 'car-section' + (c.rank <= 3 ? ' top-rank' : '');
        s.id = 'car-' + c.rank;
        s.dataset.index = i;
        s.style.setProperty('--car-accent', theme.accent);
        s.style.setProperty('--car-accent2', theme.accent2);
        s.style.setProperty('--car-glow', theme.glow);
        s.style.setProperty('--car-glow-border', theme.glowBorder);

        let angleBtnsHtml = '';
        angleNames.forEach((an, ai) => {
          const activeClass = ai === 0 ? ' active' : '';
          angleBtnsHtml += `<button class="angle-btn${activeClass}" data-angle="${ai}">
            <img src="/cars/${c.folder}/${an}.webp" alt="${c.name} - ${angleLabels[ai]} view">
            <span class="angle-label">${angleLabels[ai]}</span>
          </button>`;
        });

        s.innerHTML = `
          <div class="bg" data-bg="/cars/${c.folder}/front.webp"></div>
          <div class="noise"></div>
          <div class="vignette"></div>
          <div class="grid-lines"></div>
          <div class="glow-ring"></div>
          <button class="car-arrow prev" data-dir="-1" aria-label="Previous angle"><i class="fas fa-chevron-left"></i></button>
          <button class="car-arrow next" data-dir="1" aria-label="Next angle"><i class="fas fa-chevron-right"></i></button>
          <div class="overlay">
            <div class="top-row">
              <span class="rank-badge">#${c.rank}</span>
              <span class="maker-tag">${c.maker}</span>
            </div>
            <div class="name-row">
              <h2>${c.name}</h2>
              <button class="inline-specs-btn" data-rank="${c.rank}">
                <i class="fas fa-list"></i> <span>Specs</span>
              </button>
            </div>
            <div class="maker">${c.engine}</div>
            <div class="specs">
              <span><i class="fas fa-engine"></i> ${c.engine}</span>
              <span><i class="fas fa-horse-head"></i> ${convertUnit(c.hp)}</span>
              <span><i class="fas fa-tachometer-alt"></i> ${convertUnit(c.speed)}</span>
            </div>
            <p class="desc">${c.desc}</p>
            <div class="price-row">
              <div class="price">${convertUnit(c.price)}</div>
              <div class="price-divider"></div>
              <div class="price-label">Est. Price</div>
            </div>
            <div class="angle-selector">${angleBtnsHtml}</div>
          </div>`;

        container.appendChild(s);

        s.querySelectorAll('.angle-btn').forEach(btn => {
          btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const section = this.closest('.car-section');
            const idx = parseInt(this.dataset.angle);
            setAngle(section, idx, true);
          });
        });

        s.querySelectorAll('.car-arrow').forEach(arrow => {
          arrow.addEventListener('click', function(e) {
            e.stopPropagation();
            const section = this.closest('.car-section');
            const dir = parseInt(this.dataset.dir);
            const cur = section._currentAngle;
            const next = (cur + dir + angleNames.length) % angleNames.length;
            setAngle(section, next, true);
          });
        });
      });

      const sections = document.querySelectorAll('.car-section');
      const dots = document.querySelectorAll('.side-nav .dot');

      let compactTimer;

      sideNav.addEventListener('mouseenter', () => {
        clearTimeout(compactTimer);
        document.querySelectorAll('.dot.active').forEach(d => d.classList.remove('compact'));
      });

      sideNav.addEventListener('mouseleave', () => {
        const ad = document.querySelector('.dot.active');
        if (ad) {
          clearTimeout(compactTimer);
          compactTimer = setTimeout(() => ad.classList.add('compact'), 3000);
        }
      });

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            // Lazy-load background image only when section becomes visible
            const bgEl = e.target.querySelector('.bg');
            if (bgEl && bgEl.dataset.bg) {
              bgEl.style.backgroundImage = `url('${bgEl.dataset.bg}')`;
              bgEl.removeAttribute('data-bg');
            }
            const idx = parseInt(e.target.dataset.index);
            const c = cars.find(x => x.rank === loadOrder[idx]);
            currentCarRank = c.rank;
            if (c && !e.target._viewTracked && typeof gtag === 'function') {
              e.target._viewTracked = true;
              setTimeout(() => {
                gtag('event', 'car_section_view', { 'car_name': c.name, 'rank_position': c.rank });
              }, 800);
            }
            const theme = carThemes[c.rank];
            const brand = cursorBrands[c.rank];
            navCounter.innerHTML = '<span>' + String(idx + 1).padStart(2, '0') + '</span> / 10';
            dots.forEach((d, di) => {
              d.classList.toggle('active', di === idx);
              if (di === idx) {
                d.classList.remove('compact');
                d.style.setProperty('--car-accent', theme.accent);
                d.style.setProperty('--car-accent2', theme.accent2);
                d.style.setProperty('--car-glow', theme.glow);
              }
            });
            if (idx > 0) scrollHint.classList.add('hidden');

            // Update cursor brand
            cursor.style.borderColor = brand.border || brand.color;
            document.documentElement.style.setProperty('--trail-color', brand.color);
            cursorLogo.innerHTML = '<img src="' + brand.img + '" alt="' + c.name + ' logo">';
            cursor.classList.add('has-brand');

            // Auto-hide side nav label after 3s
            clearTimeout(compactTimer);
            compactTimer = setTimeout(() => {
              const ad = document.querySelector('.dot.active');
              if (ad) ad.classList.add('compact');
            }, 3000);

            // Start auto-rotation for visible section
            startAutoRotate(e.target);
          } else {
            stopAutoRotate(e.target);
          }
        });
      }, { threshold: 0.45 });

      sections.forEach(s => {
        s._autoTimer = null;
        s._currentAngle = 0;
        obs.observe(s);
      });
      // Observe recent posts + footer to hide side-nav and cursor logo
      const recentPosts = document.getElementById('recentPosts');
      const siteFooter = document.querySelector('.site-footer');
      const recentObs = new IntersectionObserver(entries => {
        const anyVisible = entries.some(e => e.isIntersecting);
        document.body.classList.toggle('recent-visible', anyVisible);
      }, { threshold: 0.05 });
      if (recentPosts) recentObs.observe(recentPosts);
      if (siteFooter) recentObs.observe(siteFooter);
      // Reset scroll to first car after build
      const firstCar = document.getElementById('car-10');
      if (firstCar) firstCar.scrollIntoView(true);
      // Force-load first visible car (LCP) immediately without waiting for scroll event
      if (firstCar) {
        const initialBg = firstCar.querySelector('.bg');
        if (initialBg && initialBg.dataset.bg) {
          initialBg.style.backgroundImage = `url('${initialBg.dataset.bg}')`;
          initialBg.removeAttribute('data-bg');
        }
      }
    }

    // Site search â€” instant client-side filter
    const searchInput = document.getElementById('searchInput');
    let _searchTrackTimer = null;
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const q = searchInput.value.trim().toLowerCase();
        // Debounced search tracking (fires 800ms after user stops typing, only for 2+ char queries)
        clearTimeout(_searchTrackTimer);
        if (q.length >= 2 && typeof gtag === 'function') {
          const query = q;
          _searchTrackTimer = setTimeout(() => {
            gtag('event', 'instant_search_query', { 'search_term': query });
          }, 800);
        }
        // Query DOM fresh on each keystroke (sections/dots are built later by buildPage)
        const carSections = document.querySelectorAll('.car-section');
        const articleCards = document.querySelectorAll('.recent-posts .card');
        // Filter cars + dots
        carSections.forEach(section => {
          const idx = parseInt(section.dataset.index, 10);
          const rank = loadOrder[idx];
          const car = cars.find(x => x.rank === rank);
          const text = car ? (car.name + ' ' + car.maker).toLowerCase() : '';
          const match = !q || text.includes(q);
          section.style.display = match ? '' : 'none';
          const dot = document.querySelector('.side-nav .dot[data-index="' + idx + '"]');
          if (dot) dot.style.display = match ? '' : 'none';
        });
        // Filter article cards
        articleCards.forEach(card => {
          const text = card.textContent.toLowerCase();
          const match = !q || text.includes(q);
          card.style.display = match ? '' : 'none';
        });
      });
    }

    // Specs overlay
    const specOverlay = document.getElementById('specOverlay');
    const specPanel = document.getElementById('specPanel');

    function openSpecOverlay() {
      const rank = currentCarRank;
      const c = cars.find(x => x.rank === rank);
      if (!c) return;
      const theme = carThemes[rank];
      specPanel.innerHTML = `
        <div class="spec-header">
          <h3>${c.name} <span>Specifications</span></h3>
          <button class="spec-close" id="specClose" aria-label="Close specifications"><i class="fas fa-times"></i></button>
        </div>
        <div class="spec-grid">
          ${c.details.map(d => `<div class="spec-item"><div class="spec-label">${convertLabel(d.label)}</div><div class="spec-val">${convertUnit(d.val)}</div></div>`).join('')}
        </div>`;
      specPanel.style.setProperty('--car-accent', theme.accent);
      specOverlay.classList.add('open');
      document.body.classList.add('spec-open');
    }

    document.addEventListener('click', function(e) {
      if (e.target.closest('.inline-specs-btn') || e.target.closest('#specsFabBtn')) {
        const clickedBtn = e.target.closest('.inline-specs-btn');
        if (clickedBtn) {
          currentCarRank = parseInt(clickedBtn.dataset.rank);
        }
        const c = cars.find(x => x.rank === currentCarRank);
        if (c && typeof gtag === 'function') {
          gtag('event', 'specs_overlay_open', { 'car_name': c.name, 'car_rank': currentCarRank });
        }
        openSpecOverlay();
      }
    });

    specOverlay.addEventListener('click', function(e) {
      if (e.target === specOverlay || e.target.closest('#specClose')) {
        specOverlay.classList.remove('open');
        document.body.classList.remove('spec-open');
      }
    });

    function setAngle(section, idx, userInitiated) {
      const cRank = parseInt(section.id.replace('car-', ''));
      const c = cars.find(x => x.rank === cRank);
      const bg = section.querySelector('.bg');
      const btns = section.querySelectorAll('.angle-btn');

      if (userInitiated) {
        section._userInteracted = true;
        clearTimeout(section._autoTimer);
        setTimeout(() => { section._userInteracted = false; startAutoRotate(section); }, 6000);
        if (c && typeof gtag === 'function') {
          gtag('event', 'angle_tab_click', { 'car_name': c.name, 'angle_view': angleLabels[idx] });
        }
      }

      bg.classList.add('fading');
      setTimeout(() => {
        bg.style.backgroundImage = `url('/cars/${c.folder}/${angleNames[idx]}.webp')`;
        bg.classList.remove('fading');
      }, 200);

      btns.forEach(b => b.classList.remove('active'));
      btns[idx].classList.add('active');
      section._currentAngle = idx;
    }

    function startAutoRotate(section) {
      stopAutoRotate(section);
      if (section._userInteracted) return;
      section._autoTimer = setInterval(() => {
        if (section._userInteracted) return;
        const next = (section._currentAngle + 1) % angleNames.length;
        setAngle(section, next, false);
      }, 4000);
    }

    function stopAutoRotate(section) {
      if (section._autoTimer) {
        clearInterval(section._autoTimer);
        section._autoTimer = null;
      }
    }

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // Fix cursor for angle buttons
    document.addEventListener('mouseover', function(e) {
      if (e.target.closest('.angle-btn')) {
        cursor.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', function(e) {
      if (e.target.closest('.angle-btn')) {
        cursor.classList.remove('hovering');
      }
    });

    // Cursor breathing effect on repeated clicks at same spot
    let _lastClickX = 0, _lastClickY = 0, _lastClickTime = 0;
    document.addEventListener('click', function(e) {
      const now = Date.now();
      const dx = e.clientX - _lastClickX;
      const dy = e.clientY - _lastClickY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 25 && now - _lastClickTime < 600) {
        cursor.classList.remove('breathing');
        void cursor.offsetWidth;
        cursor.classList.add('breathing');
      }
      _lastClickX = e.clientX;
      _lastClickY = e.clientY;
      _lastClickTime = now;
    });
    cursor.addEventListener('animationend', () => cursor.classList.remove('breathing'));

    // Language selector dropdown toggle
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    if (langBtn && langDropdown) {
      langBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const willShow = !langDropdown.classList.contains('show');
        langDropdown.classList.toggle('show');
        langBtn.setAttribute('aria-expanded', willShow);
      });
      document.addEventListener('click', function(e) {
        if (!langDropdown.contains(e.target) && e.target !== langBtn && !langBtn.contains(e.target)) {
          langDropdown.classList.remove('show');
          langBtn.setAttribute('aria-expanded', 'false');
        }
      });
      // Close on Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && langDropdown.classList.contains('show')) {
          langDropdown.classList.remove('show');
          langBtn.setAttribute('aria-expanded', 'false');
          langBtn.focus();
        }
      });
    }

    // Disable cursor animation on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.querySelectorAll('a, button, .dot, .angle-btn, .car-arrow').forEach(el => {
        el.addEventListener('touchstart', function() {
          this.style.transform = 'scale(0.95)';
        }, { passive: true });
        el.addEventListener('touchend', function() {
          this.style.transform = '';
        }, { passive: true });
      });
    }

    // Hamburger menu toggle
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    function openMobileMenu() {
      document.body.classList.add('mobile-menu-open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }
    function closeMobileMenu() {
      document.body.classList.remove('mobile-menu-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', openMobileMenu);
    }
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    document.querySelectorAll('.mobile-menu-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Mobile search expand on tap
    const searchFormEl = document.getElementById('siteSearchForm');
    const searchInputEl = document.getElementById('searchInput');
    function openMobileSearch() {
      if (!searchFormEl) return;
      searchFormEl.classList.add('expanded');
      document.body.classList.add('search-expanded');
      setTimeout(function() { if (searchInputEl) searchInputEl.focus(); }, 150);
    }
    function closeMobileSearch() {
      if (!searchFormEl) return;
      searchFormEl.classList.remove('expanded');
      document.body.classList.remove('search-expanded');
    }
    if (searchFormEl && searchInputEl) {
      searchFormEl.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !searchFormEl.classList.contains('expanded')) {
          openMobileSearch();
        }
      });
      searchInputEl.addEventListener('blur', function() {
        if (window.innerWidth <= 768 && !searchInputEl.value.trim()) {
          closeMobileSearch();
        }
      });
    }