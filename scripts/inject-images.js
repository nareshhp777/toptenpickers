const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const srcDir = path.join(__dirname, '../src');
let modifiedCount = 0;

walkDir(srcDir, function(filePath) {
  // Only process HTML files inside 'articles' directories
  if (filePath.includes(`${path.sep}articles${path.sep}`) && filePath.endsWith('.html')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Regex to match <li> followed by optional whitespace and <h2>
    // We will capture the <li> spacing, the <h2> tag entirely, and the inner text of <h2>
    const regex = /(<li>\s*)(<h2>(.*?)<\/h2>)/g;
    
    let hasChanges = false;
    
    let newContent = content.replace(regex, (match, p1, p2, p3) => {
      // Check if there's already an img right after this h2 to avoid double injection
      // We can't easily check ahead in a simple replace, but we can assume if the file already has 'article-img' it might be processed.
      // But let's just do a naive replace and we'll check if it already has placeholders.
      
      const encodedText = encodeURIComponent(p3.trim());
      const imgTag = `\n          <img src="https://via.placeholder.com/800x450?text=${encodedText}" alt="${p3.trim()}" class="article-img" style="width: 100%; border-radius: 8px; margin: 16px 0; object-fit: cover; aspect-ratio: 16/9;">`;
      
      hasChanges = true;
      return p1 + p2 + imgTag;
    });

    // Prevent double injection if run multiple times
    if (hasChanges && !content.includes('class="article-img"')) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      modifiedCount++;
      console.log(`Injected images into: ${filePath}`);
    }
  }
});

console.log(`\nFinished! Successfully injected placeholder images into ${modifiedCount} articles.`);
