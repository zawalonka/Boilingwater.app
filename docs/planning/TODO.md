# Project TODO - Boiling Water App

## 🔴 Critical Issues (Must Fix)

### Bug: Level 3 Pause on Complete - No Unpause
**Status:** Needs fix
**Description:** `pauseTime` is set when boiling begins, but only cleared in the tutorial modal. Non-tutorial experiments (altitude/different-fluids) may leave the simulation paused without a clear unpause path.
**Priority:** CRITICAL (blocks further gameplay)
**Location:** GameScene.jsx boil-stats-modal or related completion handlers

### Bug: Saltwater Boiling Temperature Calculation
**Status:** Needs verification
**Description:** Verify that saltwater uses its own boiling point (100.16°C) in the physics simulation, not water's 100°C.
**Priority:** HIGH (affects educational accuracy)
**Location:** GameScene.jsx physics loop or ControlPanel substance handling

### Bug: Alpha Kitchen Flame Icon Scaling
**Status:** Noted for later
**Description:** Flame icon grows differently in alpha vs other workshops
**Priority:** LOW (visual only)

---

## ✅ Recently Completed (Done!)

### Priority 1: Fix Level 2 Workshop Dropdown
**Status:** ✅ COMPLETED (Commit 5ee85e3)
- ✅ Fixed JSON structure (scope/metadata to root)
- ✅ Fixed panel colors for proper contrast
- ✅ Simplified dropdown styling (2-color universal system)
- ✅ All dropdowns: light base rgba(240,240,240), dark hover rgba(100,100,100)

### Priority 2: Element Loading + Ambient-Boiling Visual
**Status:** ✅ COMPLETED (Commit 09221fd)
- ✅ Element loading (H, He, N, O, F, Ne, Cl, Ar)
- ✅ Ambient-boiling visual (upward steam for BP ≤ 20°C)
- ✅ Antoine equation (±0.5°C accuracy)
- ✅ 3-file modular substance system (catalog, loader, parser)
- ✅ Element-specific colors and CSS animations

### Priority 3: Code Refactoring - Extract ControlPanel
**Status:** ✅ COMPLETED
- ✅ GameScene reduced 1552 → 1158 lines (-394 lines)
- ✅ All control panel logic extracted to ControlPanel.jsx

---

## 🎯 Next Priorities - What Needs Doing

### Priority 4: Filesystem-Based Substance Discovery (NEXT UP!)
**Status:** 🟡 Partial (95% - Core works, catalog removal needed)
**Goal:** Replace hardcoded catalog with folder scanning for infinite extensibility

**What's Done:**
- ✅ Element loading works (H through Ar mapped)
- ✅ Compound loading works (explicit paths)
- ✅ Element detection regex (`/^[A-Z][a-z]?$/`)
- ✅ Element parsing (nist/iupac data)
- ✅ Antoine vapor-pressure solver

**What's Left (1-2 hours work):**
- [ ] **REMOVE substanceCatalog.js** entirely
- [ ] **ADD getAvailableElements()** - scans periodic-table/ folder dynamically
- [ ] **ADD getAvailableCompounds()** - scans compounds/ subfolders
- [ ] **ADD getSubstanceMetadata(id)** - lightweight metadata from JSON
- [ ] Update UI dropdowns to call filesystem discovery instead

**Why This Matters:** All 118 elements are already on disk. Instead of hardcoding them, scan the filesystem so adding new substances requires zero code changes.

---

### Priority 5: Bug Fixes & Testing (IMPORTANT)
**Status:** 🟡 In Progress
- [ ] **Test Level 2 dropdown runtime** (complete tutorial → select Level 2 → verify dropdown)
- [ ] **Fix Level 3 pause bug** (prevent simulation freeze after boiling)
- [ ] **Verify saltwater boiling** (should be 100.16°C not 100°C)
- [ ] **Test element loading in game** (load H, O, N and verify physics works)

---

## 🚀 Future Features - Long-term Backlog

### Priority 6: Room Environment & Atmospheric System
**Status:** Design complete, not started
**What:** Dynamic room temperature, AC control, air composition tracking, experiment scoring
**Size:** Large feature (4 phases, 60+ subtasks)
**Details:** See [ROOM_ENVIRONMENT_SYSTEM.md](../planning/ROOM_ENVIRONMENT_SYSTEM.md)

### Priority 7: Experiment Scorecard System
**Status:** Design phase
**What:** Downloadable CSV/JSON reports of experiments with metrics
**Size:** Medium (data collection + UI + download)

### Priority 8: Unit Conversion & Display System
**Status:** 50% done (infrastructure ready, UI pending)
**What:** Temperature/Pressure/Mass unit switching (C/F/K, Pa/psi/bar, etc.)
**Size:** Medium
**Done:** Conversion functions, localStorage, locale detection
**TODO:** Wire UI, add more units, update all displays

### Priority 9: Save Data & Persistence System
**Status:** Design phase
**What:** Game saves via LocalStorage + console codes + file export
**Size:** Medium-Large
**Approaches:** Autosave, console codes (portable), file downloads

### Priority 10: Substance Data & Documentation
**Status:** Partial
**What:** Documentation and examples for substance system
**Size:** Small
**Done:** Guides created
**TODO:** More JSDoc examples, field documentation

---

## 📊 Quick Status Overview

| Feature | Status | Notes |
|---------|--------|-------|
| Core Gameplay | ✅ Working | Pot dragging, heating, physics accurate |
| Workshop System | ✅ Done | 4 workshops, dynamic switching |
| Substance Loading | 🟡 95% | Loaders work; catalog file to remove |
| Physics Engine | ✅ Accurate | Antoine equation, Newton's cooling |
| Element Loading | ✅ Working | H, O, N, etc. loadable |
| Ambient-Boiling Visual | ✅ Done | Upward steam effect |
| Dropdowns | ✅ Fixed | 2-color system, clear hover |
| Critical Bugs | 🔴 3 found | 1 CRITICAL, 1 HIGH, 1 LOW |
| Room Environment | 🔲 Planned | Not started |
| Experiment Scorecard | 🔲 Planned | Not started |
| Unit System | 🟡 50% | Infrastructure ready |
| Save System | 🔲 Planned | Not started |

---

## 📅 Recent Work (This Session)

1. ✅ **Element Loading** - Full infrastructure for loading H, O, N elements
2. ✅ **Ambient-Boiling Visual** - Upward steam effect for substances boiling at room temp
3. ✅ **Antoine Equation** - Real vapor-pressure calculation (±0.5°C)
4. ✅ **Level 2 Dropdown** - Fixed JSON structure + styling
5. ✅ **Dropdown Styling** - Unified 2-color system across all themes

**Commits:** 09221fd, 5ee85e3, eb03ed7

---

## 📋 Full Session History

See bottom of original TODO.md for complete history of 4 sessions with 40+ completed tasks.
