# Physics Refactoring & Extensible Substance System

## Overview
Refactored the Boiling Water physics engine to support multiple substances and implemented Newton's Law of Cooling for realistic temperature decay.

## Key Changes

### 1. **Extensible Substance Architecture** 
The game is now prepared to support different substances (water, ethanol, acetone, saltwater, glycerin, etc.) without modifying core game code.

#### File Structure
```
src/data/substances/
├── compounds/
│   ├── pure/
│   │   └── water-h2o/
│   │       ├── info.json
│   │       ├── liquid/state.json
│   │       └── ... other phases
│   └── solutions/
│       └── saltwater-3pct-nacl/
│           ├── info.json
│           └── liquid/state.json
└── periodic-table/
  ├── 001_H_nonmetal.json
  └── ... 118 elements
```

#### How to Add a New Substance
1. Create `src/data/substances/compounds/pure/{compound-name}/info.json`
2. Add phase state files under `{phase}/state.json`
3. Run `npm run dev` or `npm run build` to regenerate the catalog
4. No code changes needed!

### 2. **Substance Properties Separation**

**Before:** All fluid properties hardcoded in `src/constants/physics.js`
```javascript
export const WATER_CONSTANTS = {
  SPECIFIC_HEAT_LIQUID: 4.186,
  HEAT_OF_VAPORIZATION: 2257,
  // ... all hardcoded for water only
}
```

**After:** Substance-specific properties in JSON, universal constants separate
```
src/data/substances/**          ← Substance data
src/generated/substanceCatalog.js ← Auto-generated catalog
src/constants/physics.js        ← Universal constants only
src/utils/substanceLoader.js    ← Dynamic substance loading
```

### 3. **Realistic Cooling Model**

**Before:** Constant -200W cooling (unrealistic)
- Hot water at 100°C cooled at same rate as warm water at 30°C
- Violated Newton's Law of Cooling

**After:** Exponential cooling using Newton's Law of Cooling
$$\frac{dT}{dt} = -k(T - T_{ambient})$$

Where:
- k = heat transfer coefficient (0.0015/s for water in metal pot)
- T = current temperature
- T_ambient = room temperature (20°C)

**Real-world behavior now modeled:**
- 100°C water: cools ~0.12°C/s initially (fast)
- 60°C water: cools ~0.06°C/s (medium)
- 30°C water: cools ~0.015°C/s (slow)
- Eventually approaches ambient temperature (20°C) asymptotically

### 4. **Physics Functions Updated**

All physics functions now accept a substance properties object (`fluidProps` in code):

#### `calculateBoilingPoint(altitude, fluidProps)`
```javascript
// Uses fluid-specific altitude lapse rate
const temperatureDrop = altitude * fluidProps.altitudeLapseRate
const boilingPoint = fluidProps.boilingPointSeaLevel - temperatureDrop
```

#### `calculateHeatingEnergy(mass, tempStart, tempEnd, fluidProps)`
```javascript
// Uses fluid-specific specific heat capacity
const energy = massGrams * fluidProps.specificHeat * deltaT
```

#### `applyHeatEnergy(mass, currentTemp, energyJoules, boilingPoint, fluidProps)`
```javascript
// Uses fluid-specific vaporization heat
const steamGenerated = remainingEnergy / (fluidProps.heatOfVaporization * 1000)
```

#### `simulateTimeStep(state, heatInputWatts, deltaTime, fluidProps)`
```javascript
// Heating phase
if (heatInputWatts > 0) {
  result = applyHeatEnergy(waterMass, currentTemp, energyApplied, boilingPoint, fluidProps)
}

// Cooling phase: Newton's Law of Cooling
if (currentTemp > AMBIENT_TEMP && heatInputWatts <= 0) {
  const tempDifference = currentTemp - AMBIENT_TEMP
  const coolingRate = fluidProps.coolingCoefficient * tempDifference * deltaTime
  currentTemp = currentTemp - coolingRate
}
```

### 5. **GameScene.jsx Updates**

#### New: Substance Loading on Mount
```javascript
useEffect(() => {
  async function initializeFluid() {
    const substanceData = await loadSubstance('water', 'liquid')
    const props = parseSubstanceProperties(substanceData)
    setFluidProps(props)
  }
  initializeFluid()
}, [])
```

#### Updated: Physics Simulation Loop
```javascript
const newState = simulateTimeStep(
  { waterMass: waterInPot, temperature, altitude },
  heatInputWatts,
  deltaTime,
  fluidProps  // NEW: Pass fluid properties
)
```

#### Updated: Boiling Point Calculation
```javascript
// BEFORE
const boilingPoint = calculateBoilingPoint(altitude)

// AFTER
const boilingPoint = fluidProps ? calculateBoilingPoint(altitude, fluidProps) : 100
```

### 6. **Substance Loader API**

```javascript
// Load a substance by ID + phase
const substanceData = await loadSubstance('water', 'liquid')

// Parse JSON to physics-engine format
const props = parseSubstanceProperties(substanceData)

// Get available substances list
const list = getAvailableSubstances()  // { compounds, elements, all }

// Load info only (no phase files)
const info = await loadSubstanceInfo('O')
```

## Physics Accuracy

### ✅ Heating Speed: ACCURATE
- Formula: Q = mcΔT with c = 4.186 J/(g·°C)
- 1kg water 20°C→100°C at 1700W: 197 seconds ✓

### ✅ Evaporation Rate: ACCURATE
- Latent heat: 2257 kJ/kg (standard for water)
- Formula: m_steam = Q / L_v ✓

### ✅ Cooling Speed: NOW ACCURATE
- Formula: dT/dt = -k(T - T_ambient)
- Exponential decay (not linear)
- 100°C water cools faster than 30°C water ✓

## File Changes Summary

| File | Change | Impact |
|------|--------|--------|
| `src/data/substances/**` | NEW | Substance data storage (compounds + elements) |
| `src/generated/substanceCatalog.js` | NEW | Auto-generated catalog |
| `scripts/generateSubstanceCatalog.js` | NEW | Catalog generator |
| `src/utils/substanceLoader.js` | NEW | Substance loading utility |
| `src/constants/physics.js` | REFACTORED | Removed WATER_CONSTANTS, kept ATMOSPHERE/UNIVERSAL |
| `src/utils/physics.js` | UPDATED | All functions accept fluidProps, Newton's Law added |
| `src/components/GameScene.jsx` | UPDATED | Loads fluid on mount, passes to physics functions |

## Future Enhancements

### Easy to Add
1. **New Substances** - Just add JSON files under `src/data/substances/`
2. **Fluid Selector UI** - Dropdown to choose substance
3. **Substance-Specific Visuals** - Different colors/opacity from JSON
4. **Custom Cooling** - Different heat transfer coefficients per substance
5. **Temperature-Dependent Cooling** - More complex cooling models

### Examples for Future Substances
```json
// info.json (compound metadata)
{
  "id": "ethanol",
  "type": "compound",
  "name": "Ethanol",
  "chemicalFormula": "C₂H₆O",
  "phaseTransitions": {
    "meltingPoint": -114.14,
    "boilingPoint": 78.37
  },
  "states": ["liquid", "gas"]
}
```

```json
// liquid/state.json (phase data)
{
  "compoundId": "ethanol",
  "phase": "liquid",
  "specificHeat": { "value": 2.44, "unit": "J/(g·°C)" },
  "latentHeatOfVaporization": { "value": 838, "unit": "kJ/kg" }
}
```

## Status

- **Updated:** January 29, 2026
- **Scope:** Zero-hardcoding substance system + physics refactor

## Testing Recommendations

1. **Heating**: Verify pot reaches boiling point in ~3 minutes at MED setting
2. **Cooling**: Turn off burner, observe exponential temperature decay
3. **Edge Cases**:
   - Different altitudes affect boiling point ✓
   - Very hot water (100°C) cools faster than slightly warm water
   - Temperature never drops below 20°C ambient
4. **Evaporation**: Boiling water gradually decreases mass as steam escapes

## Educational Value

This refactoring makes the game a powerful teaching tool:
- **Physics Students**: See Newton's Law of Cooling in real-time
- **Chemistry Students**: Different fluids with different properties
- **Engineering Students**: Heat transfer coefficients, thermodynamics
- **Extensibility**: Teachers can add custom fluids for specific lessons

---
**Last Updated**: January 24, 2026  
**Author**: Physics Engine Refactoring
