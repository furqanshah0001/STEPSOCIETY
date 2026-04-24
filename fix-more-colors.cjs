const fs = require('fs');
const path = require('path');

const replacements = [
  { old: /text-white\/40/g, new: 'text-foreground/40' },
  { old: /text-white\/60/g, new: 'text-foreground/60' },
  { old: /text-zinc-500/g, new: 'text-foreground/50' },
  { old: /text-zinc-600/g, new: 'text-foreground/40' },
  { old: /text-zinc-700/g, new: 'text-foreground/30' },
  { old: /text-zinc-400/g, new: 'text-foreground/60' },
  { old: /bg-black\/40/g, new: 'bg-foreground/5' },
  { old: /bg-black\/50/g, new: 'bg-foreground/5' },
  { old: /bg-black\/60/g, new: 'bg-foreground/10' },
  { old: /bg-black\/95/g, new: 'bg-background/95' },
  { old: /bg-[bB]lack(?![A-Za-z0-9\/\-])/g, new: 'bg-surface' }, 
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
  
  // Revert specific cases where we NEED pure black/white
  // e.g. text-black on neon buttons, or QR code squares
  content = content.replace(/<div className="w-2 h-2 bg-surface m-0\.5" \/>/g, '<div className="w-2 h-2 bg-black m-0.5" />');
  content = content.replace(/<div className="w-2 h-2 bg-foreground m-0\.5" \/>/g, '<div className="w-2 h-2 bg-white m-0.5" />');
  // the text-left bg-black in App.tsx
  content = content.replace(/text-left bg-surface/g, 'text-left bg-black'); // that input error screen is nice as pure black 

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
