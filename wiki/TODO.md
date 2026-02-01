# Wiki TODO - Static Knowledge Site

> **Last Updated:** 2026-01-31
> **Scope:** Separate from gameplay. Build-generated static site for GitHub Pages.

---

## ✅ Phase 0: Bootstrap (Required First)
1. **Create wiki Copilot instructions + folder structure**
   - [ ] Add wiki-specific Copilot instructions file (separate from game rules)
   - [ ] Define wiki folder layout (source, generator, output)
   - [ ] Ensure wiki tools/scripts never touch gameplay code

## Phase 1: Core Generator
2. **Static site generator (build-time)**
   - [ ] Build script (Node) to generate HTML from repo data
   - [ ] Incremental rebuilds by changed files
   - [ ] Force-rebuild flag

3. **Entity model + relationships**
   - [ ] Elements, compounds, solutions, phases
   - [ ] Formulas and processes
   - [ ] Levels and experiments (from current constants)
   - [ ] Parent/child graphs with cross-links

4. **Page types**
   - [ ] Index (overview + counts)
   - [ ] Entity detail pages (parsed JSON + readable layout)
   - [ ] Relationship pages (parents/children)
   - [ ] Usage pages (formulas → processes → game callsites)

## Phase 2: UX & Validation
5. **Readable layout & learning focus**
   - [ ] Render formulas with readable math + code blocks
   - [ ] Consistent sectioning for properties, sources, notes

6. **Quality checks**
   - [ ] Broken-link validation
   - [ ] Missing data warnings
   - [ ] Output integrity checks

## Phase 3: Integration
7. **Build & deploy**
   - [ ] Hook into build pipeline for GitHub Pages
   - [ ] Add hamburger menu link to wiki
   - [ ] Add docs for running generator locally
