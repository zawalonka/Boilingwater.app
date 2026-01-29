#!/usr/bin/env node

/**
 * Update Educational Notes Script
 * 
 * Reads substance-data/educational-notes.json and applies notes to substance files.
 * Uses element IDs/names to find files (doesn't rely on ordering).
 * Only updates files that are referenced in the notes library.
 * 
 * Usage: node scripts/update-educational-notes.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIBRARY_PATH = path.join(__dirname, './temp-data/educational-notes.json');
const ELEMENTS_DIR = path.join(__dirname, '../src/data/substances/periodic-table');
const COMPOUNDS_DIR = path.join(__dirname, '../src/data/substances/compounds/pure');
const MIXTURES_DIR = path.join(__dirname, '../src/data/substances/compounds/solutions');

let updated = { compounds: 0, elements: 0, mixtures: 0, failed: [] };

// Load library
let library;
try {
  library = JSON.parse(fs.readFileSync(LIBRARY_PATH, 'utf8'));
  console.log('✓ Loaded educational notes library');
} catch (err) {
  console.error('✗ Failed to load library:', err.message);
  process.exit(1);
}

// Helper: Find file by ID pattern (handles unordered lists)
function findFileByPattern(dir, pattern) {
  if (!fs.existsSync(dir)) return null;
  
  const files = fs.readdirSync(dir);
  return files.find(f => f.startsWith(pattern) && f.endsWith('.json'));
}

// Update compounds (first try pure directory)
console.log('\n📚 Updating compounds...');
for (const [compoundId, notes] of Object.entries(library.compounds || {})) {
  // Try pure compounds first
  let infoPath = path.join(COMPOUNDS_DIR, `${compoundId}/info.json`);
  
  // If not in pure, try solutions (mixtures)
  if (!fs.existsSync(infoPath)) {
    infoPath = path.join(MIXTURES_DIR, `${compoundId}/info.json`);
  }
  
  if (!fs.existsSync(infoPath)) {
    updated.failed.push(`Compound ${compoundId} not found in pure or solutions`);
    continue;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
    data.educationalNotes = notes;
    fs.writeFileSync(infoPath, JSON.stringify(data, null, 2) + '\n');
    updated.compounds++;
    console.log(`  ✓ ${compoundId}`);
  } catch (err) {
    updated.failed.push(`Compound ${compoundId}: ${err.message}`);
  }
}

// Update mixtures (solutions)
console.log('\n🧪 Updating mixtures...');
for (const [mixtureId, notes] of Object.entries(library.mixtures || {})) {
  const infoPath = path.join(MIXTURES_DIR, `${mixtureId}/info.json`);
  
  if (!fs.existsSync(infoPath)) {
    updated.failed.push(`Mixture ${mixtureId} not found at ${infoPath}`);
    continue;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
    data.educationalNotes = notes;
    fs.writeFileSync(infoPath, JSON.stringify(data, null, 2) + '\n');
    updated.mixtures++;
    console.log(`  ✓ ${mixtureId}`);
  } catch (err) {
    updated.failed.push(`Mixture ${mixtureId}: ${err.message}`);
  }
}

// Update elements (find by ID pattern, doesn't assume order)
console.log('\n⚛️  Updating periodic table elements...');
for (const [elementId, notes] of Object.entries(library.elements || {})) {
  // Find file matching pattern (e.g., "001_H" matches "001_H_nonmetal.json")
  const elementFile = findFileByPattern(ELEMENTS_DIR, elementId);
  
  if (!elementFile) {
    updated.failed.push(`Element ${elementId} file not found in ${ELEMENTS_DIR}`);
    continue;
  }
  
  const elementPath = path.join(ELEMENTS_DIR, elementFile);
  
  try {
    const data = JSON.parse(fs.readFileSync(elementPath, 'utf8'));
    data.educationalNotes = notes;
    fs.writeFileSync(elementPath, JSON.stringify(data, null, 2) + '\n');
    updated.elements++;
    console.log(`  ✓ ${elementId} (${elementFile})`);
  } catch (err) {
    updated.failed.push(`Element ${elementId}: ${err.message}`);
  }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log(`📊 UPDATE SUMMARY`);
console.log('='.repeat(60));
console.log(`✓ Compounds updated: ${updated.compounds}`);
console.log(`✓ Mixtures updated: ${updated.mixtures}`);
console.log(`✓ Elements updated: ${updated.elements}`);
console.log(`✗ Failed: ${updated.failed.length}`);

if (updated.failed.length > 0) {
  console.log('\n⚠️  FAILURES:');
  updated.failed.forEach(msg => console.log(`  - ${msg}`));
}

console.log('\n✅ Complete!');
process.exit(updated.failed.length > 0 ? 1 : 0);
