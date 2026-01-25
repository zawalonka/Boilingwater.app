import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const THEMES_DIR = join(__dirname, '..', 'public', 'assets', 'themes');

async function optimizeImage(imagePath) {
  console.log(`Optimizing ${imagePath}...`);
  
  const image = sharp(imagePath);
  const metadata = await image.metadata();
  
  await image
    .png({
      quality: 80,
      compressionLevel: 9,
      effort: 10
    })
    .toFile(imagePath + '.optimized');
  
  // Replace original with optimized
  const fs = await import('fs');
  fs.renameSync(imagePath + '.optimized', imagePath);
  
  const stats = fs.statSync(imagePath);
  console.log(`  ✓ ${(stats.size / 1024).toFixed(2)}KB`);
}

async function optimizeThemeImages() {
  const themes = await readdir(THEMES_DIR);
  
  for (const theme of themes) {
    const themePath = join(THEMES_DIR, theme);
    const files = await readdir(themePath);
    
    console.log(`\n📦 Theme: ${theme}`);
    
    for (const file of files) {
      if (file.endsWith('.png')) {
        await optimizeImage(join(themePath, file));
      }
    }
  }
  
  console.log('\n✨ All images optimized!');
}

optimizeThemeImages().catch(console.error);
