# Changelog

All notable releases for Boiling Water will be documented in this file.

**Note:** Active development happens continuously between tagged versions. Tags mark significant milestones, but many commits occur between them. For full change history, refer to the commit log.

Versioning standard is evolving organically as the project matures.

---

## [0.1.3] - 2026-01-29

### Major Refactoring
- **Extracted ControlPanel component** from GameScene.jsx for better separation of concerns
  - GameScene.jsx reduced from 1552 → 1158 lines (25% reduction)
  - ControlPanel.jsx created as dedicated presentational component (385 lines)
  - All UI controls now modular and reusable

### Added
- Educational notes for all 118 periodic table elements (discovery, etymology, real-world uses, interesting facts)
- Educational notes for water (H2O) and saltwater (3% NaCl) compounds
- Batch update script (update-educational-notes.js) for future substance content updates
- scripts/temp-data/ folder for script-specific data (extensible for future tools)
- GAMESCENE_REFACTOR_PLAN.md documentation of refactoring strategy

### Documentation
- Reorganized docs structure: WATER_STATES_ARCHITECTURE.md → guides/SUBSTANCE_SYSTEM_GUIDE.md
- Cleaned up TODO.md (487 → ~100 lines, removed completed items)
- Deleted EDUCATIONAL_NOTES_TODO.md (project complete)
- Documented 3 known bugs for future fixing (flame scaling, saltwater calc, level 3 pause)

### Code Quality
- Better separation of concerns: GameScene focuses on physics/state, ControlPanel handles UI
- Improved readability and maintainability
- All 120 substances now have comprehensive educational content
- Dev server tested and working without errors

### Known Issues (Noted for Future Fixes)
- Alpha kitchen flame icon scaling differs from other workshops
- Saltwater boiling point calculation uses plain water values (Level 3)
- Level 3 pause on completion with no unpause option

---

## [0.1.2] - 2026-01-29

### Changed
- Updated copilot-instructions.md to reflect current project state (substances architecture, 118 periodic table elements, workshop system)
- Fixed outdated comments in src/constants/physics.js (fluids → substances)
- Code cleanup: verified all imports, exports, and cross-references are consistent
- Validated periodic table element references in compound definitions

### Code Quality
- All 118 periodic table elements properly structured and referenced
- All 12 compound definitions with correct phase states
- Workshop system validation and inheritance working correctly
- Physics engine imports and usage consistent across components

---

## [0.1.1] - 2026-01-27

### Fixed
- Tutorial completion now correctly unlocks level/workshop selectors and advanced controls
- Tutorial gating logic aligned with experiment system (checks `activeExperiment === 'boiling-water'` instead of non-existent Level 0)

### Changed
- Updated docs link from removed `src/data/fluids` to new `src/data/substances` path

### Documentation
- Added UI state gotcha to GOTCHAS.md documenting tutorial unlock bug and fix

---

## [0.1.0] - 2026-01-26

### Added
- Data-driven substance architecture with periodic table elements, compounds, and mixtures
- H2O compound with phase states (ice, water, steam) and thermodynamic properties
- Saltwater-3pct mixture with colligative properties
- Refactored loader to support new compound/phase structure

### Removed
- Legacy `src/data/fluids` folder (replaced by `src/data/substances`)

---

## Pre-Alpha Development

Active development with theme system, physics engine, experiment hierarchy, and location-based altitude effects. See commit history for full details.
