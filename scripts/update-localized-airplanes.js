const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const locales = ['es', 'de', 'fr', 'ja', 'pt', 'hi', 'ar', 'ko', 'it'];
const slugs = [
  'bombardier-global-8000',
  'gulfstream-g800',
  'dassault-falcon-10x',
  'boom-supersonic-overture',
  'embraer-praetor-600',
  'cessna-citation-longitude',
  'airbus-a350-1000ulr',
  'eve-air-mobility-evtol',
  'cirrus-vision-jet-g2-plus',
  'zeroavia-za2000'
];

const lightboxHtml = `lightboxHtml: |-
  <div id="imageLightbox" class="lightbox-overlay">
      <button class="lightbox-close" aria-label="Close modal"><i class="fa-solid fa-xmark"></i></button>
      <img src="" alt="Fullscreen View" class="lightbox-img">
    </div>
pageScriptHtml: |-
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      var galleries = document.querySelectorAll('.bento-gallery');
      galleries.forEach(function(gallery) {
        var heroItem = gallery.querySelector('.bento-item.hero img');
        var subItems = gallery.querySelectorAll('.bento-item:not(.hero) img');
        subItems.forEach(function(subItem) {
          subItem.addEventListener('click', function() {
            heroItem.parentElement.classList.add('swapping');
            subItem.parentElement.classList.add('swapping');
            setTimeout(function() {
              var tempSrc = heroItem.src;
              var tempAlt = heroItem.alt;
              heroItem.src = subItem.src;
              heroItem.alt = subItem.alt;
              subItem.src = tempSrc;
              subItem.alt = tempAlt;
              heroItem.parentElement.classList.remove('swapping');
              subItem.parentElement.classList.remove('swapping');
            }, 300);
          });
        });
      });

      var observerOptions = { root: null, rootMargin: '0px 0px -100px 0px', threshold: 0.1 };
      var galleryObserver = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, observerOptions);
      galleries.forEach(function(g) { galleryObserver.observe(g); });

      var lightbox = document.getElementById('imageLightbox');
      var lightboxImg = lightbox.querySelector('.lightbox-img');
      var lightboxClose = lightbox.querySelector('.lightbox-close');
      var heroImages = document.querySelectorAll('.bento-item.hero img');
      heroImages.forEach(function(img) {
        img.addEventListener('click', function() {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
        });
      });
      lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
      });
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
          lightbox.classList.remove('active');
        }
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          lightbox.classList.remove('active');
        }
      });
    });
    </script>`;

locales.forEach(loc => {
  const filePath = path.join(__dirname, '..', 'src', loc, 'articles', 'top-10-airplanes.html');
  if (!fs.existsSync(filePath)) {
    console.log(`Missing file: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) {
    console.log(`Failed to match frontmatter in ${filePath}`);
    return;
  }

  let fm = fmMatch[1];
  let body = fmMatch[2];

  // Update layout and family
  fm = fm.replace(/layout:\s*layouts\/article\.njk/, 'layout: layouts/showcase.njk');
  fm = fm.replace(/family:\s*article/, 'family: showcase\nshowcaseType: airplanes');

  if (!fm.includes('lightboxHtml:')) {
    fm = fm + '\n' + lightboxHtml;
  }

  const $ = cheerio.load(body, { xmlMode: false, decodeEntities: false });
  const items = $('ol.rank-list > li');

  let cardsHtml = '\n      <section class="showcase-feed" data-category="airplanes">\n';

  items.each((i, el) => {
    const rank = i + 1;
    const slug = slugs[i];
    const h2Text = $(el).find('h2').text().trim();
    const pText = $(el).find('p').html() || '';
    
    // Parse spec-row
    const specSpans = $(el).find('.spec-row span');
    let pillsHtml = '';
    specSpans.each((j, span) => {
      const strong = $(span).find('strong').text().trim();
      let label = $(span).text().replace(strong, '').replace(':', '').trim();
      pillsHtml += `\n            <div class="spec-pill"><span class="label">${label.toUpperCase()}</span><span class="val">${strong}</span></div>`;
    });

    cardsHtml += `
        <article class="showcase-card">
          <div class="card-top">
            <span class="giant-rank">#${rank}</span>
            <h2>${h2Text}</h2>
          </div>
          <div class="bento-gallery">
            <div class="bento-item hero"><img src="/airplanes/${slug}/angle1.webp" alt="${h2Text} - Angle 1" width="1200" height="800" loading="lazy" decoding="async"></div>
            <div class="bento-item detail-1"><img src="/airplanes/${slug}/angle2.webp" alt="${h2Text} - Angle 2" width="600" height="500" loading="lazy" decoding="async"></div>
            <div class="bento-item detail-2"><img src="/airplanes/${slug}/angle3.webp" alt="${h2Text} - Angle 3" width="600" height="500" loading="lazy" decoding="async"></div>
          </div>
          <div class="spec-grid">${pillsHtml}
          </div>
          <p>${pText}</p>
        </article>
`;
  });

  cardsHtml += '\n      </section>\n';

  // Replace <ol class="rank-list">...</ol>
  const rankListMatch = body.match(/<ol class="rank-list">[\s\S]*?<\/ol>/);
  if (rankListMatch) {
    body = body.replace(rankListMatch[0], cardsHtml.trim());
  } else {
    console.log(`Could not find ol.rank-list in ${loc}`);
  }

  const updatedContent = `---\n${fm.trim()}\n---\n${body.trim()}\n`;
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Updated: ${filePath}`);
});
