# Project TODO - Boiling Water App

> **Last Updated:** 2026-01-31  
> **Status:** Pre-Alpha (working prototype with zero-hardcoding substance system)

---

## 🔴 CRITICAL: Must Fix Before Next Release

### 1. Level 3 Pause Bug (BLOCKS GAMEPLAY)
**Problem:** `pauseTime` set when boiling begins, never cleared for non-tutorial experiments  
**Impact:** Simulation freezes after boiling in Level 2+ experiments  
**Location:** [GameScene.jsx](../../src/components/GameScene.jsx) boil-stats-modal  
**Fix Required:** Add unpause logic for all experiment completion handlers

### 2. Saltwater Boiling Point - Van't Hoff Factor ✅ FIXED
**Status:** Fixed - boilingPointElevation corrected to 0.515°C

---

## 🎯 IMMEDIATE: Current Sprint Tasks

### Test & Validate Recent Changes
- [ ] Test Level 2 dropdown (tutorial → Level 2 → verify dropdown works)
- [ ] Test element loading in-game (H, O, N and verify physics)
- [ ] Verify saltwater boiling at correct temperature
- [ ] Fix Level 3 pause bug

### Add Antoine TminC/TmaxC Notes to Remaining JSON Files
**Priority:** Low (delegate to less expensive AI)  
**Template:** See `src/data/substances/compounds/pure/water-h2o/liquid/state.json` for example  
**Completed:** water-h2o, saltwater-3pct-nacl  
**Remaining files to update:**
- [ ] `compounds/pure/ethanol-c2h5oh/liquid/state.json`
- [ ] `compounds/pure/acetone-c3h6o/liquid/state.json`
- [ ] `compounds/pure/ammonia-nh3/liquid/state.json`
- [ ] `compounds/pure/ammonia-nh3/gas/state.json`
- [ ] `compounds/pure/methane-ch4/liquid/state.json`
- [ ] `compounds/pure/methane-ch4/gas/state.json`
- [ ] `compounds/pure/propane-c3h8/liquid/state.json`
- [ ] `compounds/pure/propane-c3h8/gas/state.json`
- [ ] `compounds/pure/glycerin-c3h8o3/liquid/state.json`
- [ ] `compounds/pure/isopropyl-alcohol-c3h8o/liquid/state.json`
- [ ] `compounds/pure/hydrogen-peroxide-h2o2/liquid/state.json`
- [ ] `compounds/pure/acetic-acid-ch3cooh/liquid/state.json`

**What to add:** Add `TminC_note` and `TmaxC_note` fields explaining that these are empirically verified range boundaries, not hard limits. The equation works outside this range but accuracy may degrade.

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
   - **Goal:** Collect anonymized experiment data for insights and educational improvements
   - **Status:** Design/ideation phase
   - **Size:** Medium (data layer + optional AI analysis)
   - **Timeline:** Post-1.0 release feature
   
   **Phase 1: Local Storage (Simple)**
   - Store all experiment results to `localStorage` or IndexedDB
   - Schema example:
     ```json
     {
       "experimentId": "uuid-here",
       "timestamp": "2026-01-29T16:45:00Z",
       "substance": "ethanol",
       "altitude": 2500,
       "initialTemp": 20,
       "boilingPointObserved": 75.2,
       "timeToBoil": 187,
       "heatInputWatts": 1700,
       "temperatureCurve": [20, 21.5, 23.1, ...],
       "userActions": ["filled_pot", "turned_heat_on", "adjusted_burner_to_high"]
     }
     ```
   - Export button: Download personal experiment history as JSON/CSV
   
   **Phase 2: Cloud Aggregation (Opt-in)**
   - User consent to anonymized data sharing
   - POST experiment results to cloud endpoint (Firebase/Supabase/custom)
   - Aggregate database for pattern analysis
   
   **Phase 3: AI-Powered Insights (Automated)**
   - GitHub Actions: Analyze experiment corpus weekly
   - AI generates insights document (`docs/EXPERIMENT_INSIGHTS.md`)
   - Example insights:
     - "70% of users attempt ethanol first (curiosity about alcohol)"
     - "Common error: Expecting water to boil instantly at 100°C"
     - "Altitude experiments have 3x replay rate (high educational value)"
   
   **Privacy Considerations:**
   - All data collection opt-in only
   - No personal identifiers stored
   - GDPR-compliant data handling
   - Clear data retention policies
   
   **Potential Use Cases:**
   - Improve tutorial based on where users struggle
   - Identify confusing experiments
   - Generate personalized learning paths
   - A/B test educational content effectiveness
   - Community leaderboards (optional)
   
   **Cost Estimate (if cloud-enabled):**
   - Storage: ~$5/month (100k experiments)
   - AI Analysis: ~$10-20/month (weekly batch processing)
   - Total: <$30/month for full analytics pipeline

