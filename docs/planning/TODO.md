# Project TODO - Boiling Water App

## Known Issues (To Be Fixed Later)

### Bug 1: Alpha Kitchen Flame Icon Scaling
**Status:** Noted for later fix
**Description:** Alpha kitchen flame icon grows when it should not compared to other workshops. Flame sizing logic may have different scaling factors or the workshop layout values differ.
**Affected:** Alpha kitchen workshop, Level 1+
**Priority:** Low (visual only, doesn't affect gameplay)

### Bug 2: Saltwater Boiling Temperature Calculation
**Status:** Noted for later fix
**Description:** Temperature for boiling saltwater does not properly calculate (appears to use plain water values). Likely broken logic defaulting to water properties instead of using the selected substance's properties.
**Affected:** Level 3 (different-fluids experiment), when saltwater is selected
**Priority:** Medium (affects educational accuracy)
**Location:** Likely in GameScene.jsx physics loop or ControlPanel substance handling

### Bug 3: Level 3 Pause on Complete - No Unpause
**Status:** Noted for later fix
**Description:** Game pauses when level 3 is complete with no way to unpause. May be related to showHook state or tutorial completion logic that doesn't provide unpause button.
**Affected:** Level 3 (different-fluids experiment) when boiling is achieved
**Priority:** Medium (blocks further gameplay)
**Location:** Likely in GameScene.jsx boil-stats-modal or related completion handlers

---

## Current Sprint

### Priority 4: Code Refactoring - Extract ControlPanel Component (Big Refactor)
**Status:** ✅ COMPLETED
**Result:** GameScene.jsx reduced from 1552 → 1158 lines (-394 lines)

#### 4.1 Extract ControlPanel Component from GameScene.jsx
✅ Separated control panel UI logic (~385 lines) into dedicated ControlPanel.jsx component
✅ Extracted ~45 required props (game state, UI state, config)
✅ Extracted ~15 callbacks (heat, timer, speed, location, etc.)
✅ Reduced GameScene.jsx from 1552 lines to 1158 lines
✅ Maintained all existing functionality and state management
✅ Dev server tested and working without errors

#### 4.2 Audit Other Functions for Separation & Refactoring
- [ ] Review GameScene.jsx for additional extraction opportunities (physics loop, dragging logic, etc.)
- [ ] Identify other components that could benefit from modularization
- [ ] Document candidate functions/sections in REFACTORING_SUMMARY.md
- [ ] Prioritize by impact on readability and accessibility

---

## Backlog

### Priority 1: Fix Level 2 Workshop Dropdown (Blocking - After Refactor)
**Status:** Not started

- [ ] Debug blank dropdown on Level 2 selection
- [ ] Verify getWorkshopsByLevel(2) returns level-2-placeholder
- [ ] Test filtering logic and cache behavior

---

### Priority 2: Extend substanceLoader.js (Optional Advanced Feature)
**Status:** Design phase

#### 2.1 Add Element Loading (Future Enhancement)
- [ ] loadElement(elementId) loads from periodic-table/{elementId}.json
- [ ] Add caching to avoid re-reading

#### 2.2 Add Compound Assembly Logic
- [ ] loadCompound(compoundId) loads info.json + resolves composition
- [ ] Calls loadElement() for each element; validates SMILES string
- [ ] Add composition validation

#### 2.3 Add Phase-Specific Property Assembly
- [ ] loadSubstancePhase(compoundId, phase) loads phase state file
- [ ] Calls loadCompound() + merges phase-specific props
- [ ] Returns combined object for physics engine

#### 2.4 Update Validation Schema
- [ ] Extend validateSubstanceData() for new thermodynamic fields
- [ ] Make electronegativity, entropy, Antoine coeff optional

#### 2.5 Integrate with Physics Engine
- [ ] Ensure compatibility with existing fluidProps object
- [ ] Add Antoine vapor-pressure calculation (phase 2)
- [ ] Update GameScene to use loadSubstancePhase() API
- [ ] Test phase transitions with proper data

---

### Priority 3: Substance Data & Documentation
**Status:** Design phase

- [ ] Create SUBSTANCE_STRUCTURE.md guide (how to add elements, compounds, mixtures)
- [ ] Document precomputed vs. derived fields approach
- [ ] Update substanceLoader.js JSDoc with usage examples

---

### Priority 4: Code Refactoring & Readability (Future Sprint)
**Status:** Not started

#### 4.1 Extract ControlPanel Component from GameScene.jsx
- [ ] Separate control panel UI logic (~400 lines) into dedicated ControlPanel.jsx component
- [ ] Identify and extract ~20 required props (temperature, status, controls, callbacks)
- [ ] Reduce GameScene.jsx from 1552 lines to ~1150 lines
- [ ] Maintain all existing functionality and state management
- [ ] **Priority:** Lower (nice-to-have, not blocking gameplay)

#### 4.2 Audit Other Functions for Separation & Refactoring
- [ ] Review GameScene.jsx for additional extraction opportunities (physics loop, dragging logic, etc.)
- [ ] Identify other components that could benefit from modularization
- [ ] Document candidate functions/sections in REFACTORING_SUMMARY.md
- [ ] Prioritize by impact on readability and accessibility
- [ ] **Priority:** Lower (ongoing improvement)

---

## Completed Sessions

### Session: 2026-01-29 (Educational Notes & Documentation Reorganization)
- ✅ Created comprehensive educational notes for all 118 periodic table elements
- ✅ Added educational notes to water-h2o and saltwater-3pct-nacl compounds
- ✅ Built reusable batch update script (update-educational-notes.js)
- ✅ Organized script data in scripts/temp-data/ (extensible for future scripts)
- ✅ Moved WATER_STATES_ARCHITECTURE.md → guides/SUBSTANCE_SYSTEM_GUIDE.md (better organization)
- ✅ Committed and pushed to dev (commit: e9b35d5)

### Session: 2026-01-27 (Substance Architecture)
- ✅ Created all 118 periodic table elements with exhaustive detail (H through Og)
- ✅ Created 12 household compounds with full thermodynamic phase data
- ✅ Updated substanceLoader.js with all compounds
- ✅ Fixed tutorial completion gating bug
- ✅ Tagged and released v0.1.1
- ✅ Created CHANGELOG.md

### Previous Sessions
- ✅ Created core element JSON files (H, C, N, O, Na, Cl) with NIST/IUPAC data
- ✅ Refactored substanceLoader.js for dynamic compound/phase loading
- ✅ Integrated loader with physics engine
- ✅ Removed legacy src/data/fluids/ folder
- ✅ Effects system fully implemented (steam, flame glow, water stream)
- ✅ Workshop system locked down and extensible
- ✅ Level 1 workshop system working with multiple experiments



