# Project TODO - Boiling Water App

> **Last Updated:** 2026-01-31  
> **Status:** Pre-Alpha (working prototype with zero-hardcoding substance system)
> **Completed items:** See [COMPLETED_TODOS.md](COMPLETED_TODOS.md)

---

## 🎯 IMMEDIATE: Current Sprint Tasks

### Test & Validate Recent Changes
- [ ] Test Level 2 dropdown (tutorial → Level 2 → verify dropdown works)
- [ ] Test element loading in-game (H, O, N and verify physics)
- [ ] Verify saltwater boiling at correct temperature (100.51°C at sea level, ~66.7°C at 10km)
- [ ] Test experiment-specific popups (L1E1-Tutorial, L1E2-Altitude, L1E3-Different Fluids)

### ~~Add Antoine TminC/TmaxC Notes to Remaining JSON Files~~ ✅ DONE
Added `TminC_note` and `TmaxC_note` fields to all remaining Antoine coefficient blocks in:
- `compounds/pure/ethanol-c2h5oh/liquid/state.json`
- `compounds/pure/acetone-c3h6o/liquid/state.json`
- `compounds/pure/ammonia-nh3/liquid/state.json`
- `compounds/pure/ammonia-nh3/gas/state.json`
- `compounds/pure/methane-ch4/liquid/state.json`
- `compounds/pure/methane-ch4/gas/state.json`
- `compounds/pure/propane-c3h8/liquid/state.json`
- `compounds/pure/propane-c3h8/gas/state.json`
- `compounds/pure/glycerin-c3h8o3/liquid/state.json`
- `compounds/pure/isopropyl-alcohol-c3h8o/liquid/state.json`
- `compounds/pure/hydrogen-peroxide-h2o2/liquid/state.json`
- `compounds/pure/acetic-acid-ch3cooh/liquid/state.json`

### ~~Add Regression Guardrails~~ ✅ DONE
Added to copilot-instructions.md:
- No artificial clamps without physics justification
- No static values for temperature-dependent properties
- Dynamic calculation preferred over pre-computed constants
- TminC/TmaxC are range markers, not limits

---

## 🚀 BACKLOG: Planned Features

### High Priority
1. **Unit Conversion System**
   - Wire UI, add more units, update all displays

2. **Room Environment & Atmospheric System** (Design complete)
   - Dynamic room temperature with PID-controlled AC
   - Air composition tracking (O₂, N₂, CO₂, toxic gases)
   - See [ROOM_ENVIRONMENT_SYSTEM.md](ROOM_ENVIRONMENT_SYSTEM.md)

3. **Experiment Scorecard System** (Design phase)
   - Downloadable CSV/JSON reports
   - Metrics: efficiency, sustainability, score

### Medium Priority
4. **Save Data & Persistence**
   - LocalStorage autosave
   - Console codes (portable)
   - File export/import

5. **Substance Documentation**
   - More JSDoc examples
   - Field documentation
   - Developer guides

### Low Priority (Visual)
6. **Alpha Kitchen Flame Icon Scaling**
   - Flame icon grows differently in alpha vs other workshops
   - Visual polish only

### Very Low Priority (Future/Nice-to-Have)
7. **Experiment Data Collection & AI Analysis System**
   - See [COMPLETED_TODOS.md](COMPLETED_TODOS.md) for full design notes
   - Local storage → Cloud aggregation → AI insights pipeline
   - Post-1.0 release feature

