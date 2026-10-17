/* ============================================================================
 * app.js — Centralized engine for all 11 localized Top10 pages
 * Reads globals (carThemes, cursorBrands, cars, angleNames, angleLabels)
 * declared inline in each index.html file.
 * ============================================================================ */

    const IMAGEKIT_CDN = 'https://ik.imagekit.io/toptenpicker';

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
      const badge = document.getElementById('regionBadge');
      if (badge) badge.textContent = countryName || 'Ã°Å¸Å’Â';
    } catch(e) { const badge = document.getElementById('regionBadge'); if (badge) badge.textContent = 'Ã°Å¸Å’Â'; }
    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
      });
    }

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

    if (typeof cars !== 'undefined') {
    // Disable automatic browser scroll restoration so refresh always starts at top (Car #10)
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    const scrollContainer = document.getElementById('scrollContainer');
    if (scrollContainer && !window.location.hash) {
      scrollContainer.scrollTop = 0;
    }
    window.scrollTo(0, 0);

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
    const isPointerFine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

    if (isPointerFine && cursor) {
      const vw = window.innerWidth, vh = window.innerHeight;
      cx = vw / 2;
      cy = vh / 2;
      mx = cx; my = cy;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';

      // Light trail initialization with Canvas (Performance Optimization)
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '9998'; 
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      
      function resizeCanvas() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      const trailCount = 8;
      const trailCoords = Array(trailCount).fill().map(() => ({ x: cx, y: cy }));

      let mouseOnScreen = true;
      document.addEventListener('mouseleave', () => { mouseOnScreen = false; });
      document.addEventListener('mouseenter', () => { mouseOnScreen = true; });
      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; mouseOnScreen = true; });

      // Cursor trail loop with idle/visibility pause to reduce CPU + battery
      let cursorLoopId = null;
      let lastMoveTime = Date.now();
      let cursorPaused = false;
      document.addEventListener('mousemove', () => { lastMoveTime = Date.now(); });

      function cursorLoop() {
        cx += (mx - cx) * 0.35;
        cy += (my - cy) * 0.35;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (mouseOnScreen) {
          let tx = cx, ty = cy;
          const trailColor = getComputedStyle(document.documentElement).getPropertyValue('--trail-color').trim() || '#fff';
          
          trailCoords.forEach((coords, i) => {
            coords.x += (tx - coords.x) * 0.45;
            coords.y += (ty - coords.y) * 0.45;
            const ratio = 1 - (i / trailCount);
            
            ctx.beginPath();
            ctx.arc(coords.x, coords.y, 4 * ratio, 0, Math.PI * 2);
            ctx.fillStyle = trailColor;
            ctx.globalAlpha = ratio * 0.55;
            ctx.fill();
            
            tx = coords.x;
            ty = coords.y;
          });
          ctx.globalAlpha = 1.0;
        }

        cursorLoopId = requestAnimationFrame(cursorLoop);
      }

      function pauseCursorLoop() {
        if (cursorPaused) return;
        cursorPaused = true;
        if (cursorLoopId !== null) {
          cancelAnimationFrame(cursorLoopId);
          cursorLoopId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      function resumeCursorLoop() {
        if (!cursorPaused) return;
        cursorPaused = false;
        cursorLoopId = requestAnimationFrame(cursorLoop);
      }

      setInterval(() => {
        if (!mouseOnScreen || document.hidden || (Date.now() - lastMoveTime > 2000)) {
          pauseCursorLoop();
        } else {
          resumeCursorLoop();
        }
      }, 500);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) pauseCursorLoop();
        else if (Date.now() - lastMoveTime <= 2000) resumeCursorLoop();
      });

      cursorLoop();
    } else if (cursor) {
      cursor.style.display = 'none';
    }

    // Global Event Delegation (DOM Performance Optimization)
    container.addEventListener('click', function(e) {
      const angleBtn = e.target.closest('.angle-btn');
      if (angleBtn) {
        e.stopPropagation();
        const section = angleBtn.closest('.car-section');
        const idx = parseInt(angleBtn.dataset.angle);
        setAngle(section, idx, true);
        return;
      }

      const arrow = e.target.closest('.car-arrow');
      if (arrow) {
        e.stopPropagation();
        const section = arrow.closest('.car-section');
        const dir = parseInt(arrow.dataset.dir);
        const cur = section._currentAngle;
        const next = (cur + dir + angleNames.length) % angleNames.length;
        setAngle(section, next, true);
        return;
      }

      const expandBtn = e.target.closest('.expand-btn');
      if (expandBtn) {
        e.stopPropagation();
        const overlay = expandBtn.closest('.overlay');
        overlay.classList.toggle('expanded');
        const textSpan = expandBtn.querySelector('.expand-text');
        if (overlay.classList.contains('expanded')) {
          textSpan.textContent = 'Show Less';
        } else {
          textSpan.textContent = 'Read More';
        }
        return;
      }
    });

    // Build page immediately so DOM is fully constructed
    buildPage();

    // Dismiss preloader promptly without blocking rendering
    if (preloaderBar) preloaderBar.style.width = '100%';
    if (preloaderCounter) preloaderCounter.textContent = '100';
    if (preloader) {
      preloader.classList.add('done');
    }

    let currentCarRank = 10;

    function buildPage() {
      loadOrder.forEach((rank, i) => {
        const c = cars.find(x => x.rank === rank);
        const theme = carThemes[rank];
        const brand = (typeof cursorBrands !== 'undefined' && cursorBrands[rank]) ? cursorBrands[rank] : null;

        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.dataset.index = i;
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-label', 'Go to ' + c.name);
        dot.innerHTML = '<div class="dot-left"><span class="dot-label">' + escapeHtml(c.name) + '</span><span class="dot-line"></span></div><span class="dot-num">' + c.rank + '</span>';
        dot.addEventListener('click', () => {
          const section = document.getElementById('car-' + c.rank);
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
        sideNav.appendChild(dot);

        const s = document.createElement('section');
        s.className = 'car-section' + (i === 0 ? ' revealed' : '') + (c.rank <= 3 ? ' top-rank' : '');
        s.id = 'car-' + c.rank;
        s.dataset.index = i;
        s.style.setProperty('--car-accent', theme.accent);
        s.style.setProperty('--car-accent2', theme.accent2);
        s.style.setProperty('--car-glow', theme.glow);
        s.style.setProperty('--car-glow-border', theme.glowBorder);
        if (brand && brand.color) {
          s.style.setProperty('--brand-color', brand.color);
        }

        let angleBtnsHtml = '';
        angleNames.forEach((an, ai) => {
          const activeClass = ai === 0 ? ' active' : '';
          angleBtnsHtml += `<button class="angle-btn${activeClass}" data-angle="${ai}">
            <img src="${IMAGEKIT_CDN}/cars/${c.folder}/${an}.webp" alt="${escapeHtml(c.name)} - ${angleLabels[ai]} view" width="120" height="80" loading="lazy" decoding="async">
            <span class="angle-label">${angleLabels[ai]}</span>
          </button>`;
        });

        s.innerHTML = `
          <div class="bg" ${i === 0 ? `style="background-image: url('${IMAGEKIT_CDN}/cars/${c.folder}/front.webp');"` : `data-bg="${IMAGEKIT_CDN}/cars/${c.folder}/front.webp"`}></div>
          <!-- SEO Image Tag: Hidden from UI, visible to Google Images -->
          <img src="${IMAGEKIT_CDN}/cars/${c.folder}/front.webp" alt="Top 10 ${escapeHtml(c.name)} - ${escapeHtml(c.maker)} Supercar, ${escapeHtml(c.engine)}, ${escapeHtml(c.hp)}" width="2816" height="1536" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} style="display: none;">
          <div class="noise"></div>
          <div class="vignette"></div>
          <div class="grid-lines"></div>
          <div class="glow-ring"></div>
          <div class="mobile-nav-row">
            <button class="car-arrow prev" data-dir="-1" aria-label="Previous angle"><i class="fas fa-chevron-left"></i></button>
            <button class="car-arrow next" data-dir="1" aria-label="Next angle"><i class="fas fa-chevron-right"></i></button>
          </div>
          ${brand ? `
          <div class="brand-watermark" aria-label="${escapeHtml(c.maker)} official crest">
            <div class="brand-watermark-glow"></div>
            <div class="brand-watermark-inner">
              <div class="brand-logo-wrap">
                <img src="${brand.img}" alt="${escapeHtml(c.maker)} logo" class="brand-logo-img" width="60" height="34" loading="lazy" decoding="async">
              </div>
              <div class="brand-text-wrap">
                <span class="brand-watermark-maker">${escapeHtml(c.maker)}</span>
                <span class="brand-watermark-sub">Official Crest</span>
              </div>
              <span class="brand-watermark-dot"></span>
            </div>
          </div>` : ''}
          <div class="overlay">
            <div class="top-row">
              <div class="top-row-left">
                <span class="rank-badge">#${c.rank}</span>
                <span class="maker-tag">${escapeHtml(c.maker)}</span>
              </div>
              <button class="inline-specs-btn" data-rank="${c.rank}" aria-label="View Full Specs">
                <i class="fas fa-list"></i> <span>Specs</span>
              </button>
            </div>
            <div class="name-row">
              <h2>${escapeHtml(c.name)}</h2>
            </div>
            <div class="specs">
              <span><i class="fas fa-engine"></i> ${escapeHtml(c.engine)}</span>
              <span><i class="fas fa-horse-head"></i> ${convertUnit(c.hp)}</span>
              <span><i class="fas fa-tachometer-alt"></i> ${convertUnit(c.speed)}</span>
            </div>
            <div class="expandable-content">
              <p class="desc">${escapeHtml(c.desc)}</p>
              <div class="price-row">
                <div class="price">${convertUnit(c.price)}</div>
                <div class="price-divider"></div>
                <div class="price-label">Est. Price</div>
              </div>
            </div>
            <div class="card-action-row">
              <button class="expand-btn" aria-label="Toggle details">
                <span class="expand-text">Read More</span>
                <i class="fas fa-chevron-down"></i>
              </button>
              <button class="vote-btn" data-category="cars" data-item="${c.folder}" aria-label="Vote for ${escapeHtml(c.name)}">
                <i class="fa-solid fa-heart vote-heart"></i>
                <span class="vote-text">Like</span>
                <span class="vote-count">0</span>
              </button>
            </div>
            <div class="angle-selector">${angleBtnsHtml}</div>
          </div>`;

        container.appendChild(s);


      });

      const sections = document.querySelectorAll('.car-section');
      const dots = document.querySelectorAll('.side-nav .dot');

      let compactTimer;

      function updateTrayReduction() {
        const tray = document.getElementById('trendingPreviewTray');
        if (!tray) return;
        const isNavHovered = sideNav && (sideNav.matches(':hover') || sideNav.matches(':active'));
        const activeExpandedDot = document.querySelector('.side-nav .dot.active:not(.compact)');
        const hoveredDot = document.querySelector('.side-nav .dot:hover');
        const shouldReduce = Boolean(isNavHovered || activeExpandedDot || hoveredDot);
        tray.classList.toggle('reduced', shouldReduce);
      }

      sideNav.addEventListener('mouseenter', () => {
        clearTimeout(compactTimer);
        document.querySelectorAll('.dot.active').forEach(d => d.classList.remove('compact'));
        updateTrayReduction();
      });

      sideNav.addEventListener('mouseleave', () => {
        const ad = document.querySelector('.dot.active');
        if (ad) {
          clearTimeout(compactTimer);
          compactTimer = setTimeout(() => {
            ad.classList.add('compact');
            updateTrayReduction();
          }, 3000);
        }
        setTimeout(updateTrayReduction, 80);
      });

      // Mobile touch interactions on rank menu
      sideNav.addEventListener('touchstart', () => {
        clearTimeout(compactTimer);
        document.querySelectorAll('.dot.active').forEach(d => d.classList.remove('compact'));
        updateTrayReduction();
      }, { passive: true });

      sideNav.addEventListener('touchend', () => {
        const ad = document.querySelector('.dot.active');
        if (ad) {
          clearTimeout(compactTimer);
          compactTimer = setTimeout(() => {
            ad.classList.add('compact');
            updateTrayReduction();
          }, 3000);
        }
        setTimeout(updateTrayReduction, 80);
      }, { passive: true });

      // Hook hover listeners on all dots
      dots.forEach((d) => {
        d.addEventListener('mouseenter', updateTrayReduction);
        d.addEventListener('mouseleave', () => setTimeout(updateTrayReduction, 80));
      });

      // Allow tapping the reduced pill on mobile/desktop to expand it
      const trayContainer = document.getElementById('trendingPreviewTray');
      if (trayContainer) {
        trayContainer.addEventListener('click', (e) => {
          if (e.target.closest('#trayCloseBtn') || e.target.closest('.tray-view-all') || e.target.closest('.tray-card')) {
            return;
          }
          if (trayContainer.classList.contains('reduced')) {
            trayContainer.classList.remove('reduced');
          }
        });
      }

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            // Lazy-load background image only when section becomes visible
            if (!e.target.dataset.bgLoaded) {
              const bgEl = e.target.querySelector('.bg');
              if (bgEl && bgEl.dataset.bg) {
                bgEl.style.backgroundImage = `url('${bgEl.dataset.bg}')`;
                bgEl.removeAttribute('data-bg');
              }
              e.target.dataset.bgLoaded = "true";
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
            updateTrayReduction();
            compactTimer = setTimeout(() => {
              const ad = document.querySelector('.dot.active');
              if (ad) ad.classList.add('compact');
              updateTrayReduction();
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
      // Initialize first car as loaded
      const firstCarEl = document.getElementById('car-10');
      if (firstCarEl) {
        firstCarEl.dataset.bgLoaded = "true";
      }

      // Ensure scroll container is strictly at top (Car #10) on load & refresh
      function ensureTopCar() {
        if (!window.location.hash) {
          if (scrollContainer) scrollContainer.scrollTop = 0;
          window.scrollTo(0, 0);
        }
      }
      ensureTopCar();
      updateTrayReduction();
      window.addEventListener('pageshow', () => { ensureTopCar(); updateTrayReduction(); });
      window.addEventListener('load', () => { ensureTopCar(); updateTrayReduction(); });
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

    function getSpecIcon(label) {
      const l = (label || '').toLowerCase();
      if (l.includes('0-60') || l.includes('0-100') || l.includes('0-124') || l.includes('0-200')) return 'fa-stopwatch';
      if (l.includes('speed')) return 'fa-gauge-high';
      if (l.includes('horse') || l.includes('hp') || l.includes('power')) return 'fa-bolt';
      if (l.includes('engine') || l.includes('motor')) return 'fa-microchip';
      if (l.includes('torque')) return 'fa-rotate';
      if (l.includes('transmission') || l.includes('gear')) return 'fa-sliders';
      if (l.includes('drivetrain') || l.includes('drive')) return 'fa-arrows-up-down-left-right';
      if (l.includes('weight')) return 'fa-weight-hanging';
      if (l.includes('production')) return 'fa-calendar-check';
      if (l.includes('quarter') || l.includes('nurburgring')) return 'fa-flag-checkered';
      if (l.includes('battery')) return 'fa-battery-full';
      if (l.includes('charg')) return 'fa-charging-station';
      if (l.includes('range')) return 'fa-road';
      if (l.includes('fuel') || l.includes('mpg')) return 'fa-gas-pump';
      return 'fa-circle-info';
    }

    function openSpecOverlay() {
      const rank = currentCarRank;
      const c = cars.find(x => x.rank === rank);
      if (!c) return;
      const theme = carThemes[rank] || {};
      const brand = (typeof cursorBrands !== 'undefined' && cursorBrands[rank]) ? cursorBrands[rank] : null;

      const spotlightLabels = ['0-60 mph', '0-100 km/h', 'Top Speed', 'Horsepower', 'Engine', 'Combined Power'];
      const heroSpecs = c.details.filter(d => spotlightLabels.includes(d.label)).slice(0, 4);
      const remainingSpecs = c.details.filter(d => !heroSpecs.includes(d));

      specPanel.innerHTML = `
        <div class="spec-header">
          <div class="spec-header-left">
            <div class="spec-tags-row">
              <span class="spec-rank-badge">#${c.rank}</span>
              ${brand ? `
              <div class="spec-brand-pill">
                <img src="${brand.img}" alt="${c.maker} logo" class="spec-brand-logo">
                <span>${escapeHtml(c.maker)}</span>
              </div>` : ''}
              <span class="spec-live-tag"><span class="spec-live-dot"></span> Official Dossier</span>
            </div>
            <h3 class="spec-car-title">${escapeHtml(c.name)} <span class="spec-title-accent">Telemetry</span></h3>
          </div>
          <button class="spec-close" id="specClose" aria-label="Close specifications">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="spec-spotlight-bar">
          ${heroSpecs.map(d => `
            <div class="spec-spotlight-card">
              <div class="spec-spotlight-head">
                <i class="fa-solid ${getSpecIcon(d.label)}"></i>
                <span class="spec-spotlight-label">${convertLabel(d.label)}</span>
              </div>
              <div class="spec-spotlight-val">${convertUnit(d.val)}</div>
            </div>
          `).join('')}
        </div>

        <div class="spec-section-divider">
          <span><i class="fa-solid fa-sliders"></i> Complete Engineering Telemetry</span>
        </div>

        <div class="spec-grid">
          ${remainingSpecs.map(d => `
            <div class="spec-item">
              <div class="spec-icon-box">
                <i class="fa-solid ${getSpecIcon(d.label)}"></i>
              </div>
              <div class="spec-meta">
                <span class="spec-label">${convertLabel(d.label)}</span>
                <span class="spec-val">${convertUnit(d.val)}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="spec-panel-footer">
          <div class="spec-footer-badge">
            <i class="fa-solid fa-shield-halved"></i>
            <span>Manufacturer Benchmarked Data</span>
          </div>
          <div class="spec-footer-price">
            <span class="spec-footer-price-label">EST. PRICE</span>
            <span class="spec-footer-price-val">${convertUnit(c.price)}</span>
          </div>
        </div>`;

      specPanel.style.setProperty('--car-accent', theme.accent || 'var(--accent)');
      specPanel.style.setProperty('--car-accent2', theme.accent2 || 'var(--accent2)');
      specPanel.style.setProperty('--car-glow', theme.glow || 'rgba(255,77,77,0.15)');
      if (brand && brand.color) {
        specPanel.style.setProperty('--brand-color', brand.color);
      }
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
        bg.style.backgroundImage = `url('${IMAGEKIT_CDN}/cars/${c.folder}/${angleNames[idx]}.webp')`;
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
    }

    // Language selector dropdown toggle (runs on all pages, incl. articles)
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    if (langBtn && langDropdown) {
      // On article pages, point each language link at the same article
      // (instead of that language's homepage) so switching language
      // keeps the reader on the current article.
      const articleMatch = window.location.pathname.match(/^(?:\/(ar|de|es|fr|hi|it|ja|ko|pt))?\/articles\/([^\/]+\.html)$/);
      if (articleMatch) {
        const articleFile = articleMatch[2];
        langDropdown.querySelectorAll('a').forEach(function(link) {
          const href = link.getAttribute('href');
          const langMatch = href && href.match(/^\/(ar|de|es|fr|hi|it|ja|ko|pt)?\/?$/);
          if (langMatch) {
            const prefix = langMatch[1] ? '/' + langMatch[1] : '';
            link.setAttribute('href', prefix + '/articles/' + articleFile);
          }
        });
      }
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

    // Auto-Categorization & Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const articleCards = document.querySelectorAll('.recent-posts .card');

    const filterLabels = {
      en: ['All','Vehicles & Transport','Tech & Gaming','Entertainment'],
      es: ['Todos','Vehículos y Transporte','Tecnología y Juegos','Entretenimiento'],
      de: ['Alle','Fahrzeuge & Transport','Tech & Gaming','Unterhaltung'],
      fr: ['Tous','Véhicules & Transport','Tech & Gaming','Divertissement'],
      ja: ['すべて','車両と交通','テック＆ゲーム','エンターテイメント'],
      pt: ['Todos','Veículos e Transporte','Tecnologia e Jogos','Entretenimento'],
      hi: ['सभी','वाहन और परिवहन','टेक और गेमिंग','मनोरंजन'],
      ar: ['الكل','المركبات والنقل','التقنية والألعاب','الترفيه'],
      ko: ['모두','차량 및 교통','테크 & 게이밍','엔터테인먼트'],
      it: ['Tutti','Veicoli e Trasporti','Tech & Gaming','Intrattenimento'],
    };
    (function applyFilterLabels() {
      var lang = document.documentElement.lang || 'en';
      var labels = filterLabels[lang] || filterLabels.en;
      filterBtns.forEach(function(btn, i) { if (labels[i]) btn.textContent = labels[i]; });
    })();

    const categoryMapping = {
      // English
      'Sports Bikes':'vehicles','Luxury Yachts':'vehicles','Aviation':'vehicles',
      'Formula 1':'vehicles','Electric Motorcycles':'vehicles','High-Speed Rail':'vehicles',
      'Offshore Powerboats':'vehicles','EV Performance':'vehicles',
      'Tech Gadgets':'tech','Mobile Tech':'tech','Gaming Hardware':'tech',
      'PC Gaming':'tech','Mobile Gaming':'tech','Gaming Industry':'tech','Internet Culture':'tech',
      'Photography & Cinema':'tech','Cinema':'entertainment','Television':'entertainment','Music History':'entertainment',
      // Spanish
      'Motos Deportivas':'vehicles','Yates de Lujo':'vehicles','Aviación':'vehicles',
      'Fórmula 1':'vehicles','Motos Eléctricas':'vehicles','Trenes de Alta Velocidad':'vehicles',
      'Lanchas Rápidas':'vehicles','Rendimiento EV':'vehicles',
      'Gadgets Tecnológicos':'tech','Tecnología Móvil':'tech','Hardware de Gaming':'tech',
      'Gaming PC':'tech','Gaming Móvil':'tech','Industria del Gaming':'tech','Cultura de Internet':'tech',
      'Fotografía y Cine':'tech','Cine':'entertainment','Televisión':'entertainment','Historia de la Música':'entertainment',
      // German
      'Sportmotorräder':'vehicles','Luxusyachten':'vehicles','Luftfahrt':'vehicles',
      'Formel 1':'vehicles','Elektromotorräder':'vehicles','Hochgeschwindigkeitszüge':'vehicles',
      'Offshore-Schnellboote':'vehicles','EV-Leistung':'vehicles',
      'Technik-Gadgets':'tech','Mobile Tech':'tech','Gaming-Hardware':'tech',
      'PC-Gaming':'tech','Mobile Gaming':'tech','Gaming-Industrie':'tech','Internetkultur':'tech',
      'Fotografie & Kino':'tech','Kino':'entertainment','Fernsehen':'entertainment','Musikgeschichte':'entertainment',
      // French
      'Motos Sportives':'vehicles','Yachts de Luxe':'vehicles','Aviation':'vehicles',
      'Formule 1':'vehicles','Motos Électriques':'vehicles','Train à Grande Vitesse':'vehicles',
      'Hors-Bord Performants':'vehicles','Performance EV':'vehicles',
      'Gadgets Tech':'tech','Tech Mobile':'tech','Matériel de Jeu':'tech',
      'PC Gaming':'tech','Jeux Mobile':'tech','Industrie du Jeu Vidéo':'tech','Culture Internet':'tech',
      'Photographie & Cinéma':'tech','Cinéma':'entertainment','Télévision':'entertainment','Histoire de la Musique':'entertainment',
      // Japanese
      'スポーツバイク':'vehicles','高級ヨット':'vehicles','航空':'vehicles',
      'フォーミュラ1':'vehicles','電動バイク':'vehicles','高速鉄道':'vehicles',
      'オフショアパワーボート':'vehicles','EVパフォーマンス':'vehicles',
      'テックガジェット':'tech','モバイルテック':'tech','ゲームハードウェア':'tech',
      'PCゲーム':'tech','モバイルゲーム':'tech','ゲーム業界':'tech','インターネット文化':'tech',
      '写真 & シネマ':'tech','シネマ':'entertainment','テレビ':'entertainment','音楽史':'entertainment',
      // Portuguese
      'Motos Esportivas':'vehicles','Iates de Luxo':'vehicles','Aviação':'vehicles',
      'Fórmula 1':'vehicles','Motas Elétricas':'vehicles','Comboios de Alta Velocidade':'vehicles',
      'Lanchas de Alta Velocidade':'vehicles','Desempenho EV':'vehicles',
      'Gadgets Tech':'tech','Tecnologia Móvel':'tech','Hardware de Jogos':'tech',
      'PC Gaming':'tech','Jogos Mobile':'tech','Indústria de Jogos':'tech','Cultura da Internet':'tech',
      'Fotografia & Cinema':'tech','Cinema':'entertainment','Televisão':'entertainment','História da Música':'entertainment',
      // Hindi
      'स्पोर्ट्स बाइक':'vehicles','लक्ज़री यॉट':'vehicles','विमानन':'vehicles',
      'फ़ॉर्मूला 1':'vehicles','इलेक्ट्रिक मोटरसाइकिल':'vehicles','हाई-स्पीड रेल':'vehicles',
      'ऑफशोर पावरबोट':'vehicles','EV प्रदर्शन':'vehicles',
      'टेक गैजेट':'tech','मोबाइल टेक':'tech','गेमिंग हार्डवेयर':'tech',
      'पीसी गेमिंग':'tech','मोबाइल गेमिंग':'tech','गेमिंग उद्योग':'tech','इंटरनेट संस्कृति':'tech',
      'फ़ोटोग्राफ़ी और सिनेमा':'tech','सिनेमा':'entertainment','टेलीविज़न':'entertainment','संगीत इतिहास':'entertainment',
      // Arabic
      'دراجات رياضية':'vehicles','يخوت فاخرة':'vehicles','طيران':'vehicles',
      'فورمولا 1':'vehicles','دراجات كهربائية':'vehicles','سكك حديدية عالية السرعة':'vehicles',
      'قوارب سريعة':'vehicles','أداء كهربائي':'vehicles',
      'أدوات تقنية':'tech','تقنية محمولة':'tech','أجهزة ألعاب':'tech',
      'ألعاب كمبيوتر':'tech','ألعاب محمولة':'tech','صناعة الألعاب':'tech','ثقافة الإنترنت':'tech',
      'تصوير وسينما':'tech','سينما':'entertainment','تلفزيون':'entertainment','تاريخ الموسيقى':'entertainment',
      // Korean
      '스포츠 바이크':'vehicles','럭셔리 요트':'vehicles','항공':'vehicles',
      '포뮬러 1':'vehicles','전기 모터사이클':'vehicles','고속 철도':'vehicles',
      '고속 모터보트':'vehicles','EV 퍼포먼스':'vehicles',
      '테크 가젯':'tech','모바일 기술':'tech','게임 하드웨어':'tech',
      'PC 게이밍':'tech','모바일 게이밍':'tech','게임 산업':'tech','인터넷 문화':'tech',
      '사진 &amp; 시네마':'tech','시네마':'entertainment','텔레비전':'entertainment','음악 역사':'entertainment',
      // Italian
      'Moto Sportive':'vehicles','Yacht di Lusso':'vehicles','Aviazione':'vehicles',
      'Formula 1':'vehicles','Moto Elettriche':'vehicles','Treni Alta Velocità':'vehicles',
      'Motoscafi Offshore':'vehicles','Prestazioni EV':'vehicles',
      'Gadget Tech':'tech','Tecnologia Mobile':'tech','Hardware Gaming':'tech',
      'PC Gaming':'tech','Gaming Mobile':'tech','Industria Videoludica':'tech','Cultura Internet':'tech',
      'Fotografia & Cinema':'tech','Cinema':'entertainment','Televisione':'entertainment','Storia della Musica':'entertainment'
    };

    const articleMetadata = {
      'top-10-sports-bikes-2026': { img: '/covers/sports-bikes.svg', categoryKey: 'vehicles', badge: 'Sports Bikes', icon: 'fa-motorcycle' },
      'top-10-luxury-yachts': { img: '/covers/luxury-yachts.svg', categoryKey: 'vehicles', badge: 'Luxury Yachts', icon: 'fa-ship' },
      'top-10-airplanes': { img: '/covers/airplanes.svg', categoryKey: 'vehicles', badge: 'Aviation', icon: 'fa-plane' },
      'top-10-f1-cars-all-time': { img: '/covers/f1-cars.svg', categoryKey: 'vehicles', badge: 'Formula 1', icon: 'fa-flag-checkered' },
      'top-10-must-have-tech-gadgets': { img: '/covers/tech-gadgets.svg', categoryKey: 'tech', badge: 'Tech Gadgets', icon: 'fa-microchip' },
      'top-10-electric-sports-bikes': { img: '/covers/electric-sports-bikes.svg', categoryKey: 'vehicles', badge: 'Electric Bikes', icon: 'fa-bolt' },
      'top-10-high-speed-trains': { img: '/covers/high-speed-trains.svg', categoryKey: 'vehicles', badge: 'High-Speed Rail', icon: 'fa-train' },
      'top-10-professional-cameras': { img: '/covers/professional-cameras.svg', categoryKey: 'tech', badge: 'Photography', icon: 'fa-camera' },
      'top-10-powerboats': { img: '/covers/powerboats.svg', categoryKey: 'vehicles', badge: 'Speedboats', icon: 'fa-water' },
      'top-10-gaming-consoles': { img: '/covers/gaming-consoles.svg', categoryKey: 'tech', badge: 'Gaming Hardware', icon: 'fa-gamepad' },
      'top-10-electric-sports-cars': { img: '/covers/electric-sports-cars.svg', categoryKey: 'vehicles', badge: 'EV Performance', icon: 'fa-bolt-lightning' },
      'top-10-smartphones': { img: '/covers/smartphones.svg', categoryKey: 'tech', badge: 'Smartphones', icon: 'fa-mobile-screen' },
      'top-10-gaming-laptops': { img: '/covers/gaming-laptops.svg', categoryKey: 'tech', badge: 'Gaming Laptops', icon: 'fa-laptop' },
      'top-10-pc-games': { img: '/covers/pc-games.svg', categoryKey: 'tech', badge: 'PC Gaming', icon: 'fa-desktop' },
      'top-10-mobile-games': { img: '/covers/mobile-games.svg', categoryKey: 'tech', badge: 'Mobile Games', icon: 'fa-mobile' },
      'top-10-most-interesting-websites': { img: '/covers/interesting-websites.svg', categoryKey: 'tech', badge: 'Web Culture', icon: 'fa-globe' },
      'top-10-gaming-companies': { img: '/covers/gaming-companies.svg', categoryKey: 'tech', badge: 'Gaming Industry', icon: 'fa-building' },
      'top-10-greatest-movies': { img: '/covers/greatest-movies.svg', categoryKey: 'entertainment', badge: 'Cinema', icon: 'fa-film' },
      'top-10-bingeworthy-series': { img: '/covers/bingeworthy-series.svg', categoryKey: 'entertainment', badge: 'Television', icon: 'fa-tv' },
      'top-10-greatest-albums': { img: '/covers/greatest-albums.svg', categoryKey: 'entertainment', badge: 'Music History', icon: 'fa-record-vinyl' }
    };

    function getArticleSlug(href) {
      if (!href) return '';
      const match = href.match(/\/([^\/]+)\.html(?:[?#]|$)/);
      return match ? match[1] : '';
    }

    // Enhance all article cards (including across all localized versions)
    articleCards.forEach(card => {
      const href = card.getAttribute('href') || '';
      const slug = getArticleSlug(href);
      const meta = articleMetadata[slug];
      const metaEl = card.querySelector('.meta');
      const metaText = metaEl ? metaEl.textContent.trim() : '';

      card.dataset.category = (meta && meta.categoryKey) || categoryMapping[metaText] || 'other';

      // If card does not have thumbnail wrapper yet, inject it
      if (!card.querySelector('.card-thumb-wrap') && meta) {
        const titleEl = card.querySelector('h3');
        const descEl = card.querySelector('p');
        const title = titleEl ? titleEl.textContent : '';
        const desc = descEl ? descEl.textContent : '';
        const badgeText = metaText || meta.badge;
        const thumbSrc = (meta && meta.img) ? meta.img : '/covers/default-thumb.svg';

        card.innerHTML = `
          <div class="card-thumb-wrap">
            <img src="${thumbSrc}" alt="${escapeHtml(title)}" class="card-thumb" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='/covers/default-thumb.svg';">
            <div class="card-thumb-overlay"></div>
            <span class="card-badge"><i class="fa-solid ${meta.icon}"></i> ${escapeHtml(badgeText)}</span>
            <span class="card-count-badge"><i class="fa-solid fa-list-ol"></i> 10 Ranked</span>
          </div>
          <div class="card-body">
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(desc)}</p>
            <div class="card-action-bar">
              <span class="card-read-more">Read List <i class="fa-solid fa-arrow-right"></i></span>
              <button class="vote-btn card-vote-btn" data-category="articles" data-item="${slug}" aria-label="Like article">
                <i class="fa-solid fa-heart vote-heart"></i>
                <span class="vote-count">0</span>
              </button>
            </div>
          </div>
        `;
      }
    });

    // Global defensive image fallback: if any card thumbnail or preview image fails to load, swap to default logo cover
    document.addEventListener('error', (e) => {
      const target = e.target;
      if (target && target.tagName === 'IMG' && (target.classList.contains('card-thumb') || target.closest('.tray-card') || target.closest('.card-thumb-wrap'))) {
        if (!target.dataset.hasFallback) {
          target.dataset.hasFallback = 'true';
          target.src = '/covers/default-thumb.svg';
        }
      }
    }, true);

    // Category Filter Buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.dataset.filter;

        articleCards.forEach(card => {
          if (filterValue === 'all' || card.dataset.category === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.classList.remove('filtering-out');
              card.style.position = 'relative';
            }, 10);
          } else {
            card.classList.add('filtering-out');
            setTimeout(() => {
              if (card.classList.contains('filtering-out')) {
                card.style.display = 'none';
              }
            }, 400);
          }
        });
      });
    });

    // Smooth scroll to articles grid
    function smoothScrollToArticles() {
      const recentPosts = document.getElementById('recentPosts');
      const sc = document.getElementById('scrollContainer') || window;
      if (recentPosts && sc !== window) {
        sc.scrollTo({
          top: recentPosts.offsetTop,
          behavior: 'smooth'
        });
      } else if (recentPosts) {
        recentPosts.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Explore Dock Button & Jump Pill Click Delegation
    document.addEventListener('click', function(e) {
      const jumpTrigger = e.target.closest('#jumpToArticlesPill, #exploreDockBtn, .tray-view-all, [data-jump="articles"]');
      if (jumpTrigger) {
        e.preventDefault();
        smoothScrollToArticles();
      }

      // If user clicks "Hypercars" pill in quick bar, scroll to top
      const carPill = e.target.closest('.quick-pill[data-pill-category="cars"]');
      if (carPill) {
        e.preventDefault();
        const sc = document.getElementById('scrollContainer') || window;
        if (sc !== window) sc.scrollTo({ top: 0, behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // If user dismisses trending recommendations tray
      const trayClose = e.target.closest('#trayCloseBtn');
      if (trayClose) {
        e.preventDefault();
        const tray = document.getElementById('trendingPreviewTray');
        if (tray) {
          tray.style.opacity = '0';
          tray.style.transform = 'translateX(20px)';
          setTimeout(() => { tray.style.display = 'none'; }, 250);
        }
      }
    });

    // Scroll Observer: Hide explore-dock-btn when user enters #recentPosts
    const mainScrollContainer = document.getElementById('scrollContainer');
    const dockBtn = document.getElementById('exploreDockBtn');
    const recentPostsTarget = document.getElementById('recentPosts');
    if (mainScrollContainer && dockBtn && recentPostsTarget) {
      mainScrollContainer.addEventListener('scroll', function() {
        const threshold = recentPostsTarget.offsetTop - 350;
        if (mainScrollContainer.scrollTop >= threshold) {
          dockBtn.classList.add('hidden');
        } else {
          dockBtn.classList.remove('hidden');
        }
      }, { passive: true });
    }

// Theme Toggle Logic
document.addEventListener('click', e => {
  const toggleBtn = e.target.closest('.theme-toggle');
  if (toggleBtn) {
    const isLight = document.documentElement.classList.toggle('light-theme');
    const newTheme = isLight ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.querySelectorAll('.theme-toggle i').forEach(icon => {
      icon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    });
    // Track theme toggle action in Google Analytics
    if (typeof gtag === 'function') {
      gtag('event', 'theme_toggle', {
        'theme_mode': newTheme,
        'event_category': 'user_preference',
        'event_label': newTheme
      });
      gtag('set', 'user_properties', {
        'theme_mode': newTheme
      });
    }
  }
});
setTimeout(() => {
  const isLight = document.documentElement.classList.contains('light-theme');
  document.querySelectorAll('.theme-toggle i').forEach(icon => {
    icon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  });
}, 0);

// --- Top 10 API Integration (Cloudflare Worker + D1 Backend) ---
(function() {
  const API_BASE = 'https://toptenpicker-api.nareshhp777.workers.dev';
  const API_KEY = 'top10-client-sec-2026';

  // 1. Community Voting Engine
  function initVoting() {
    const voteButtons = document.querySelectorAll('.vote-btn');
    if (!voteButtons.length) return;

    // Collect all unique categories on page
    const categories = new Set();
    voteButtons.forEach(btn => {
      const cat = btn.dataset.category;
      const item = btn.dataset.item;
      if (cat) categories.add(cat);
      // Restore user's vote state from localStorage
      if (cat && item && localStorage.getItem('voted_' + cat + '_' + item)) {
        btn.classList.add('voted');
        const icon = btn.querySelector('.vote-heart');
        if (icon) icon.className = 'fa-solid fa-heart vote-heart';
        const txt = btn.querySelector('.vote-text');
        if (txt) txt.textContent = 'Liked';
      }
    });

    // Fetch live votes for each category from Cloudflare D1
    categories.forEach(cat => {
      fetch(`${API_BASE}/api/votes?category=${encodeURIComponent(cat)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.votes) {
            voteButtons.forEach(btn => {
              if (btn.dataset.category === cat) {
                const count = data.votes[btn.dataset.item] || 0;
                const countEl = btn.querySelector('.vote-count');
                if (countEl) countEl.textContent = count;
              }
            });
          }
        })
        .catch(() => {});
    });

    // Handle vote click (event delegation)
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('.vote-btn');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const cat = btn.dataset.category;
      const item = btn.dataset.item;
      if (!cat || !item) return;

      // Prevent duplicate voting
      if (localStorage.getItem('voted_' + cat + '_' + item)) {
        return;
      }

      // Optimistic UI update
      const countEl = btn.querySelector('.vote-count');
      const current = parseInt(countEl ? countEl.textContent : '0', 10) || 0;
      if (countEl) countEl.textContent = current + 1;
      btn.classList.add('voted');
      const txt = btn.querySelector('.vote-text');
      if (txt) txt.textContent = 'Liked';
      const icon = btn.querySelector('.vote-heart');
      if (icon) icon.className = 'fa-solid fa-heart vote-heart';
      localStorage.setItem('voted_' + cat + '_' + item, '1');

      // Send to Cloudflare Worker
      fetch(`${API_BASE}/api/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Key': API_KEY
        },
        body: JSON.stringify({ category: cat, item_id: item })
      })
      .then(res => res.json())
      .then(resData => {
        if (resData && typeof resData.votes === 'number') {
          if (countEl) countEl.textContent = resData.votes;
        }
      })
      .catch(() => {});
    });
  }

  // 2. Newsletter Subscription Engine
  function initNewsletter() {
    document.addEventListener('submit', function(e) {
      const form = e.target.closest('.newsletter-form');
      if (!form) return;
      e.preventDefault();

      const input = form.querySelector('.newsletter-input');
      const btn = form.querySelector('.newsletter-submit-btn');
      const feedback = form.querySelector('.newsletter-feedback');
      if (!input || !btn) return;

      const email = input.value.trim();
      if (!email || !email.includes('@')) return;

      const originalBtnHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

      fetch(`${API_BASE}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Key': API_KEY
        },
        body: JSON.stringify({ email })
      })
      .then(res => res.json())
      .then(data => {
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml;
        if (feedback) {
          feedback.style.display = 'flex';
          if (data.success) {
            feedback.className = 'newsletter-feedback success';
            feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + (data.message || 'Subscribed successfully!');
            input.value = '';
          } else {
            feedback.className = 'newsletter-feedback error';
            feedback.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + (data.error || 'Failed to subscribe.');
          }
        }
      })
      .catch(() => {
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml;
        if (feedback) {
          feedback.style.display = 'flex';
          feedback.className = 'newsletter-feedback error';
          feedback.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Connection error. Please try again.';
        }
      });
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initVoting();
      initNewsletter();
    });
  } else {
    initVoting();
    initNewsletter();
  }
})();

