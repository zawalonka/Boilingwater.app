# Dynamic Boiling-Point Refactor TODO

> **Purpose:** Remove hard-coded clamps/shortcuts in boiling-point computation while keeping empirical Antoine data. Enable extreme/edge pressure scenarios without artificial caps.
> **Date:** 2026-01-31
> **Status:** Planning complete, ready to implement

---

## ✅ Goals
- Fully dynamic boiling-point calculation across altitude/pressure and mixture effects.
- Keep Antoine coefficients (empirical) as authoritative where present.
- Avoid artificial caps (e.g., 100°C ceiling) and forced Earth-only assumptions.
- Preserve stability (no NaN/undefined), but **never clamp to "normal" Earth ranges**.
- Show user warning when simulation leaves verified data range.

---

## 📐 Key Decisions Made

### Terminology
- **Interpolated:** Calculated BETWEEN measured data points (within TminC–TmaxC) — high confidence
- **Extrapolated:** Calculated BEYOND measured data points (outside TminC–TmaxC) — lower confidence, but math is continuous

### TminC/TmaxC Behavior
- These values indicate the **empirically verified range**, not hard limits
- Antoine equation produces a **smooth, continuous curve** — no discontinuity at boundaries
- Accuracy degrades gradually the further you extrapolate:
  - 0.5°C outside: negligible error
  - 10°C outside: ~0.1-0.5°C error
  - 50°C outside: ~1-5°C error
  - Near critical point: Antoine breaks down

### Implementation Approach
1. **Remove clamps entirely** — `solveAntoineEquation()` returns computed value regardless of TminC/TmaxC
2. **Return metadata** — function indicates whether result is within verified range
3. **UI warning** — ControlPanel shows warning when outside verified range:
   > ⚠️ Above verified range (100°C) — results estimated
4. **Warning appears only when currently outside range** — disappears when back inside
5. **Add clarifying comments** to Antoine data in JSON files

---

## 🔎 Audit Results (Hard-Coded Shortcuts Found)

### 1. TminC/TmaxC clamp in `solveAntoineEquation()` — [physics.js#L40-L46](../../src/utils/physics.js)
```javascript
if (Number.isFinite(TminC) && boilingPoint < TminC) {
  return TminC  // ❌ CLAMP — remove this
}
if (Number.isFinite(TmaxC) && boilingPoint > TmaxC) {
  return TmaxC  // ❌ CLAMP — remove this
}
```
**Fix:** Remove clamps, return computed value + metadata about range status.

### 2. Linear lapse-rate fallback — [physics.js#L90-L96](../../src/utils/physics.js)
```javascript
const lapseRate = Number.isFinite(fluidProps.altitudeLapseRate)
  ? fluidProps.altitudeLapseRate
  : ATMOSPHERE.TEMP_LAPSE_RATE  // ❌ Hard-coded constant
```
**Fix:** Keep as last-resort fallback but document clearly; prefer physics-based derivation.

### 3. Mixture elevation not applied — [substanceParser.js#L127-L129](../../src/utils/substanceParser.js)
`boilingPointSeaLevel` comes from `phaseTransitions.boilingPoint` but `effectOfDissolution.boilingPointElevation` is never added at runtime.
**Fix:** Apply elevation data in physics layer or parser.

---

## 🧮 Dynamic Boiling-Point Pipeline (Design)

### Core Pipeline
1. Get atmospheric pressure (from altitude or direct input)
2. Solve Antoine equation (if coefficients exist) → base boiling point
3. Apply mixture elevation (van't Hoff factor × ebullioscopic constant × molality)
4. Return result + metadata (isExtrapolated, verifiedRange)

### Mixture Handling
- Parse `effectOfDissolution.boilingPointElevation` and/or calculate dynamically:
  - `ΔTb = i × Kb × m` (van't Hoff factor × ebullioscopic constant × molality)
- Add elevation to Antoine-derived base boiling point
- Ensure mixture data is **applied at runtime**, not just informational

### Pressure Control
- Accept any positive pressure value
- Only guard against invalid inputs (NaN, ≤0 Pa)
- No Earth-centric assumptions

---

## 🧾 Data Contract Updates
- [ ] Add comments to Antoine sections in JSON explaining TminC/TmaxC meaning
- [ ] Document required fields for dynamic computation in SUBSTANCE_SYSTEM_GUIDE.md
- [ ] Ensure all mixture files have `effectOfDissolution` with computable data

---

## 🛡️ Guardrails (Prevent Regression)
- [ ] Add to DEVELOPMENT.md: "No artificial clamps in physics calculations without physics justification"
- [ ] Code review checklist item: "Verify no hard-coded temperature/pressure limits"

---

## 📌 Files To Modify

| File | Change |
|------|--------|
| `src/utils/physics.js` | Remove TminC/TmaxC clamps, return range metadata |
| `src/utils/substanceParser.js` | Parse and expose mixture elevation data |
| `src/components/ControlPanel.jsx` | Show extrapolation warning |
| `src/data/substances/**/state.json` | Add clarifying comments to Antoine sections |
| `docs/guides/SUBSTANCE_SYSTEM_GUIDE.md` | Document data contract |
| `docs/guides/DEVELOPMENT.md` | Add guardrail checklist |

---

## ✅ Completion Criteria
- [ ] Boiling point computed dynamically for any pressure input
- [ ] Mixture elevation applied at runtime (saltwater shows 100.515°C, not 100°C)
- [ ] No artificial caps in compute path
- [ ] UI warning appears when outside verified Antoine range
- [ ] Antoine data files have clarifying comments
- [ ] Dev guide updated with guardrails
