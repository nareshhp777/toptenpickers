const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const articlesDir = path.join(__dirname, '../src/articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Split frontmatter and body
  const parts = content.split('---');
  if (parts.length < 3) {
    console.log(`Skipping ${file} - no valid frontmatter`);
    return;
  }

  // Ensure we correctly split the frontmatter
  const frontmatter = parts[1];
  let body = parts.slice(2).join('---');

  const $ = cheerio.load(body, null, false);
  
  // Extract top 3 items
  const items = [];
  $('ol.rank-list li h2').each((i, el) => {
    if (i < 3) {
      items.push($(el).text().trim());
    }
  });
  
  if (items.length < 3) {
      console.log(`Skipping ${file} - less than 3 items found`);
      return;
  }

  // 1. Generate Key Takeaways (GEO)
  if (!body.includes('class="key-takeaways"')) {
    const takeawaysHtml = `
      <div class="key-takeaways" style="background: var(--card-bg); border-left: 4px solid var(--accent); padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
        <h3 style="margin-top: 0; font-size: 1.2rem;">Key Takeaways</h3>
        <ul style="margin-bottom: 0; padding-left: 20px; font-size: 0.95rem; color: #e8edf5;">
          <li><strong>#1 Pick:</strong> ${items[0]} leads the rankings with unmatched specifications.</li>
          <li><strong>Runner-up:</strong> ${items[1]} offers incredible performance and value.</li>
          <li><strong>Top Tier:</strong> ${items[2]} rounds out the top 3, securing its place among the elite.</li>
        </ul>
      </div>
    `;
    
    // Insert after the first paragraph following the hero
    const firstP = $('.article-hero').next('p');
    if (firstP.length) {
      firstP.after(takeawaysHtml);
      body = $.html(); // Update body with cheerio's output
    }
  }

  // 2. Generate FAQ Schema (AEO)
  if (!frontmatter.includes('FAQPage')) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What is the #1 ranked item in this top 10 list?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The #1 ranked item is ${items[0]}, featuring industry-leading performance and specifications.`
          }
        },
        {
          "@type": "Question",
          "name": `Which items made the top 3?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The top 3 items are ${items[0]}, ${items[1]}, and ${items[2]}.`
          }
        }
      ]
    };
    
    const schemaHtml = `\n  <script type="application/ld+json">\n    ${JSON.stringify(faqSchema, null, 2).replace(/\n/g, '\n    ')}\n  </script>`;
    
    // Append schema to headTailHtml
    // We need to do string manipulation on the frontmatter string
    const targetKey = 'headTailHtml: |-';
    const idx = frontmatter.indexOf(targetKey);
    if (idx !== -1) {
      // Find the next top-level key to know where headTailHtml ends
      const nextKeyMatch = frontmatter.substring(idx + targetKey.length).match(/\n[a-zA-Z]+:/);
      if (nextKeyMatch) {
          const insertIdx = idx + targetKey.length + nextKeyMatch.index;
          const newFrontmatter = frontmatter.substring(0, insertIdx) + schemaHtml + frontmatter.substring(insertIdx);
          parts[1] = newFrontmatter;
      } else {
          parts[1] = frontmatter + schemaHtml; // if it's the last key
      }
    }
  }

  // Reassemble
  const newContent = `---${parts[1]}---${body}`;
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Enhanced ${file}`);
});
