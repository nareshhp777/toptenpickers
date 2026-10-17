const fs = require('fs');
const path = require('path');

const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/toptenpicker';
const PREFIXES = ['/cars/', '/bikes/', '/yachts/', '/airplanes/'];

function findAndReplace(dir, dryRun = true) {
  let totalReplacements = 0;
  let filesModified = 0;

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.name.endsWith('.html') || entry.name.endsWith('.njk')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let countInFile = 0;

        for (const prefix of PREFIXES) {
          // Match "/cars/..." and '/cars/...'
          const doubleQuoteTarget = `"${prefix}`;
          const singleQuoteTarget = `'${prefix}`;
          
          while (content.includes(doubleQuoteTarget)) {
            content = content.replace(doubleQuoteTarget, `"${IMAGEKIT_ENDPOINT}${prefix}`);
            countInFile++;
          }
          while (content.includes(singleQuoteTarget)) {
            content = content.replace(singleQuoteTarget, `'${IMAGEKIT_ENDPOINT}${prefix}`);
            countInFile++;
          }
        }

        if (countInFile > 0) {
          filesModified++;
          totalReplacements += countInFile;
          if (!dryRun) {
            fs.writeFileSync(fullPath, content, 'utf8');
          }
          console.log(`[${dryRun ? 'DRY-RUN' : 'UPDATED'}] ${path.relative(path.join(__dirname, '..'), fullPath)}: ${countInFile} URLs`);
        }
      }
    }
  }

  traverse(dir);
  console.log(`\nSummary: ${totalReplacements} image URLs across ${filesModified} files.`);
}

const isExecute = process.argv.includes('--write');
findAndReplace(path.join(__dirname, '../src'), !isExecute);
if (!isExecute) {
  console.log('\nRun with "node scripts/migrate-to-imagekit.js --write" to apply changes.');
}
