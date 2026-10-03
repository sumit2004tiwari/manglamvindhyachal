const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src').filter(f => f.endsWith('.ts'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(/['"]\.\.\/generated\/prisma\/index\.js['"]/g, "'@prisma/client'")
                          .replace(/['"]\.\/generated\/prisma\/index\.js['"]/g, "'@prisma/client'")
                          .replace(/['"]\.\.\/\.\.\/generated\/prisma\/index\.js['"]/g, "'@prisma/client'");
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log("Updated", f);
  }
});
