const fs = require('fs');
const path = require('path');

const replacements = [
  { old: /bg-\[#0A0A0A\]/g, new: 'bg-background' },
  { old: /bg-\[#1A1A1A\]/g, new: 'bg-surface' },
  { old: /text-white(?!(\/[0-9]+|Space))/g, new: 'text-foreground' },
  { old: /text-white\/10/g, new: 'text-foreground/10' },
  { old: /text-white\/20/g, new: 'text-foreground/20' },
  { old: /border-white\/10/g, new: 'border-foreground/10' },
  { old: /border-white\/20/g, new: 'border-foreground/20' },
  { old: /bg-white\/5/g, new: 'bg-foreground/5' },
  { old: /bg-white\/10/g, new: 'bg-foreground/10' },
  { old: /text-white\/50/g, new: 'text-foreground/50' },
  { old: /text-white\/70/g, new: 'text-foreground/70' },
  { old: /text-white\/30/g, new: 'text-foreground/30' },
  { old: /border-white\/5/g, new: 'border-foreground/5' },
  { old: /border-\[#1A1A1A\]/g, new: 'border-surface' }
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  replacements.forEach(r => {
    content = content.replace(r.old, r.new);
  });
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
