const fs = require('fs');
const path = require('path');

// 1. Update base.njk
const baseNjkPath = path.join(__dirname, '../src/_includes/layouts/base.njk');
let baseContent = fs.readFileSync(baseNjkPath, 'utf8');
const scriptTag = `
  <script>
    if (localStorage.getItem('theme') === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      document.documentElement.classList.add('light-theme');
    }
  </script>
</head>`;
if (!baseContent.includes('light-theme')) {
  baseContent = baseContent.replace('</head>', scriptTag);
  fs.writeFileSync(baseNjkPath, baseContent, 'utf8');
}

// 2. Update app.js
const appJsPath = path.join(__dirname, '../app.js');
let appJsContent = fs.readFileSync(appJsPath, 'utf8');
const toggleScript = `
// Theme Toggle Logic
document.addEventListener('click', e => {
  const toggleBtn = e.target.closest('.theme-toggle');
  if (toggleBtn) {
    const isLight = document.documentElement.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    document.querySelectorAll('.theme-toggle i').forEach(icon => {
      icon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    });
  }
});
setTimeout(() => {
    const isLight = document.documentElement.classList.contains('light-theme');
    document.querySelectorAll('.theme-toggle i').forEach(icon => {
      icon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    });
}, 0);
`;
if (!appJsContent.includes('Theme Toggle Logic')) {
  fs.writeFileSync(appJsPath, appJsContent + '\n' + toggleScript, 'utf8');
}

// 3. Update all html/njk files to inject the button before `<button class="hamburger"`
function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (f.endsWith('.html') || f.endsWith('.njk')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('class="hamburger"') && !content.includes('theme-toggle')) {
         content = content.replace(/<button class="hamburger"/g, '<button class="theme-toggle" aria-label="Toggle theme" style="margin-right: 12px;"><i class="fa-solid fa-sun"></i></button>\n        <button class="hamburger"');
         fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  });
}
walk(path.join(__dirname, '../src'));
console.log('Theme toggle implemented');
