/**
 * ImageKit Automatic Uploader
 * 
 * Usage:
 *   node scripts/upload-to-imagekit.js <YOUR_IMAGEKIT_PRIVATE_KEY>
 * 
 * You can find your Private Key in:
 *   ImageKit Dashboard -> Developer Options -> API Keys -> Private Key
 */

const fs = require('fs');
const path = require('path');

const privateKey = process.argv[2];

if (!privateKey) {
  console.error('\nError: Private Key required!');
  console.log('Usage: node scripts/upload-to-imagekit.js <YOUR_IMAGEKIT_PRIVATE_KEY>\n');
  process.exit(1);
}

const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');
const FOLDERS = ['cars', 'bikes', 'yachts', 'airplanes'];

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else if (file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg')) {
      results.push(full);
    }
  });
  return results;
}

async function uploadFile(filePath) {
  const rootDir = path.join(__dirname, '..');
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const folder = '/' + path.dirname(relPath);
  const fileName = path.basename(filePath);

  const fileBuffer = fs.readFileSync(filePath);
  const base64File = fileBuffer.toString('base64');

  const formData = new URLSearchParams();
  formData.append('file', 'data:image/webp;base64,' + base64File);
  formData.append('fileName', fileName);
  formData.append('folder', folder);
  formData.append('useUniqueFileName', 'false');

  try {
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (response.ok) {
      console.log(`[SUCCESS] Uploaded: ${folder}/${fileName}`);
    } else {
      const err = await response.text();
      console.error(`[FAILED] ${folder}/${fileName}: ${response.status} - ${err}`);
    }
  } catch (err) {
    console.error(`[ERROR] ${folder}/${fileName}:`, err.message);
  }
}

async function start() {
  const rootDir = path.join(__dirname, '..');
  let allFiles = [];
  for (const f of FOLDERS) {
    const targetDir = path.join(rootDir, f);
    if (fs.existsSync(targetDir)) {
      allFiles = allFiles.concat(getFiles(targetDir));
    }
  }

  console.log(`Found ${allFiles.length} files to upload to ImageKit.`);
  console.log(`Starting upload in batches...\n`);

  // Batch in concurrent chunks of 5
  for (let i = 0; i < allFiles.length; i += 5) {
    const batch = allFiles.slice(i, i + 5);
    await Promise.all(batch.map(uploadFile));
  }

  console.log('\nAll uploads finished!');
}

start();
