# Substance File Template & Structure Guide

This guide explains how to create substance files (compounds, mixtures, solutions) and properly reference periodic table elements.

---

## File Structure Overview

```
src/data/substances/
├── periodic-table/              # All 118 elements
│   ├── 001_H_nonmetal.json
│   ├── 006_C_nonmetal.json
│   ├── 008_O_nonmetal.json
│   └── ...
└── compounds/
    ├── pure/                    # Pure chemical compounds
    │   └── {compound-id}/
    │       ├── info.json        # Compound metadata
    │       ├── solid/
    │       │   └── state.json   # Solid phase properties
    │       ├── liquid/
    │       │   └── state.json   # Liquid phase properties
    │       └── gas/
    │           └── state.json   # Gas phase properties
    └── solutions/               # Mixtures & solutions
        └── {solution-id}/
            ├── info.json
            └── liquid/
                └── state.json
```

---

## Periodic Table Element Format

**Filename Pattern:** `{atomicNumber:03d}_{symbol}_{elementCategory}.json`

**Examples:**
- `001_H_nonmetal.json` (Hydrogen)
- `006_C_nonmetal.json` (Carbon)
- `008_O_nonmetal.json` (Oxygen)
- `007_N_nonmetal.json` (Nitrogen)
- `011_Na_alkali-metal.json` (Sodium)
- `017_Cl_halogen.json` (Chlorine)

**Element Categories:**
- `nonmetal`
- `alkali-metal`
- `alkaline-earth-metal`
- `transition-metal`
- `post-transition-metal`
- `metalloid`
- `halogen`
- `noble-gas`
- `lanthanide`
- `actinide`

---

## Template: Pure Compound Info File

**Location:** `src/data/substances/compounds/pure/{compound-id}/info.json`

```json
{
  "id": "compound-id",
  "type": "compound",
  "name": "Full Chemical Name",
  "aliases": ["Common Name 1", "Common Name 2", "Abbreviation"],
  "chemicalFormula": "Chemical formula with subscripts",
  "explicitSmiles": "SMILES string",
  "molarMass": 0.0,
  "deltaHf": 0.0,
  "deltaGf": 0.0,
  
  "elements": [
    {
      "symbol": "Element symbol",
      "atomicNumber": 0,
      "count": 0,
      "reference": "periodic-table/{number:03d}_{symbol}_{category}.json"
    }
  ],
  
  "phaseTransitions": {
    "meltingPoint": 0.0,
    "boilingPoint": 0.0,
    "triplePoint": {
      "temperature": 0.0,
      "pressure": 0.0
    },
    "criticalPoint": {
      "temperature": 0.0,
      "pressure": 0.0,
      "density": 0.0
    }
  },
  
  "states": ["solid", "liquid", "gas"],
  "commonUses": ["use 1", "use 2"],
  "safetyNotes": "Safety information",
  "educationalNotes": "Educational value for students",
  "lastUpdated": "YYYY-MM-DD"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (kebab-case) |
| `type` | string | Yes | Always `"compound"` for pure compounds |
| `name` | string | Yes | IUPAC or common chemical name |
| `aliases` | array | No | Alternative names, common names, abbreviations |
| `chemicalFormula` | string | Yes | Formula with Unicode subscripts (e.g., H₂O, C₂H₅OH) |
| `explicitSmiles` | string | Yes | SMILES notation for structure |
| `molarMass` | number | Yes | Molecular weight in g/mol |
| `deltaHf` | number | No | Standard enthalpy of formation (kJ/mol) |
| `deltaGf` | number | No | Standard Gibbs free energy (kJ/mol) |
| `elements` | array | Yes | List of constituent elements with references |
| `phaseTransitions` | object | Yes | Phase change temperatures and properties |
| `states` | array | Yes | Available phase states (solid/liquid/gas) |
| `commonUses` | array | No | Real-world applications |
| `safetyNotes` | string | No | Safety warnings, hazards |
| `educationalNotes` | string | No | Teaching points, interesting facts |
| `lastUpdated` | string | Yes | ISO date format (YYYY-MM-DD) |

---

## Element Reference Format (CRITICAL)

**CORRECT FORMAT:**
```json
{
  "symbol": "H",
  "atomicNumber": 1,
  "count": 2,
  "reference": "periodic-table/001_H_nonmetal.json"
}
```

**Pattern:** `periodic-table/{atomicNumber:03d}_{symbol}_{category}.json`

**INCORRECT FORMATS (Do Not Use):**
```json
"reference": "periodic-table/001_nonmetal_H.json"  // ❌ Wrong order
"reference": "periodic-table/H_001_nonmetal.json"  // ❌ Wrong order
"reference": "periodic-table/001-H-nonmetal.json"  // ❌ Wrong separator
```

### Common Element References

| Element | Correct Reference |
|---------|-------------------|
| Hydrogen | `periodic-table/001_H_nonmetal.json` |
| Carbon | `periodic-table/006_C_nonmetal.json` |
| Nitrogen | `periodic-table/007_N_nonmetal.json` |
| Oxygen | `periodic-table/008_O_nonmetal.json` |
| Sodium | `periodic-table/011_Na_alkali-metal.json` |
| Chlorine | `periodic-table/017_Cl_halogen.json` |

---

## Template: Mixture/Solution Info File

**Location:** `src/data/substances/compounds/solutions/{solution-id}/info.json`

```json
{
  "id": "solution-id",
  "type": "mixture",
  "name": "Solution Name",
  "aliases": ["Common Name"],
  "description": "Description of the mixture",
  "concentration": {
    "solute": "Solute formula",
    "soluteSmiles": "SMILES",
    "percentByMass": 0.0,
    "molarConcentration": 0.0
  },
  
  "components": [
    {
      "id": "component-id",
      "name": "Component name",
      "smiles": "SMILES",
      "role": "solvent",
      "massFraction": 0.97,
      "reference": "compounds/pure/{component-id}/info.json"
    },
    {
      "id": "component-id-2",
      "name": "Component 2 name",
      "smiles": "SMILES",
      "role": "solute",
      "massFraction": 0.03,
      "reference": "compounds/{component-id-2}/info.json"
    }
  ],
  
  "effectOfDissolution": {
    "boilingPointElevation": 0.0,
    "meltingPointDepression": 0.0,
    "osmioticPressure": "description"
  },
  
  "phaseTransitions": {
    "meltingPoint": 0.0,
    "boilingPoint": 0.0,
    "triplePoint": {
      "temperature": 0.0,
      "pressure": 0.0,
      "note": "Approximation; depends on concentration"
    },
    "criticalPoint": {
      "temperature": 0.0,
      "pressure": 0.0,
      "note": "Nearly identical to pure solvent"
    }
  },
  
  "phases": {
    "liquid": "solution-name"
  },
  "states": ["liquid"],
  "note": "Additional notes",
  "lastUpdated": "YYYY-MM-DD"
}
```

---

## Template: Phase State File

**Location:** `src/data/substances/compounds/{type}/{id}/{phase}/state.json`

```json
{
  "compoundId": "parent-compound-id",
  "phase": "solid|liquid|gas",
  "phaseName": "ice|water|steam|etc",
  
  "density": {
    "value": 0.0,
    "unit": "kg/L",
    "temperature": 20,
    "pressure": 1.0,
    "note": "Conditions and notes"
  },
  
  "specificHeat": {
    "value": 0.0,
    "unit": "J/(g·°C)",
    "temperature": 20,
    "source": "measured"
  },
  
  "thermalConductivity": {
    "value": 0.0,
    "unit": "W/(m·K)",
    "temperature": 20
  },
  
  "latentHeatOfFusion": {
    "value": 0.0,
    "unit": "kJ/kg",
    "note": "Energy to melt solid → liquid"
  },
  
  "latentHeatOfVaporization": {
    "value": 0.0,
    "unit": "kJ/kg",
    "note": "Energy to boil liquid → gas"
  },
  
  "antoineCoefficients": {
    "A": 0.0,
    "B": 0.0,
    "C": 0.0,
    "TminC": 0,
    "TmaxC": 100,
    "formula": "log10(Pvap) = A - B/(C + T)",
    "unit": "Pressure in mmHg, Temperature in °C",
    "note": "Vapor pressure calculation"
  },
  
  "viscosity": {
    "value": 0.0,
    "unit": "Pa·s",
    "temperature": 20
  },
  
  "reference": "{parent-compound-path}/info.json"
}
```

---

## Example: Water (H₂O)

### info.json
```json
{
  "id": "h2o",
  "type": "compound",
  "name": "Water",
  "aliases": ["Oxidane", "Hydrogen Oxide"],
  "chemicalFormula": "H₂O",
  "explicitSmiles": "O",
  "molarMass": 18.015,
  "deltaHf": -285.83,
  "deltaGf": -237.13,
  
  "elements": [
    {
      "symbol": "H",
      "atomicNumber": 1,
      "count": 2,
      "reference": "periodic-table/001_H_nonmetal.json"
    },
    {
      "symbol": "O",
      "atomicNumber": 8,
      "count": 1,
      "reference": "periodic-table/008_O_nonmetal.json"
    }
  ],
  
  "phaseTransitions": {
    "meltingPoint": 0,
    "boilingPoint": 100,
    "triplePoint": {
      "temperature": 0.01,
      "pressure": 0.00603
    },
    "criticalPoint": {
      "temperature": 373.95,
      "pressure": 220.64,
      "density": 0.322
    }
  },
  
  "states": ["solid", "liquid", "gas"],
  "lastUpdated": "2026-01-27"
}
```

---

## Validation Checklist

Before committing a new substance file:

- [ ] `id` is unique and in kebab-case
- [ ] `type` is "compound" or "mixture"
- [ ] `chemicalFormula` uses Unicode subscripts (₂ not 2)
- [ ] All element references use correct format: `{number:03d}_{symbol}_{category}.json`
- [ ] Element references match actual periodic table filenames
- [ ] `molarMass` is accurate (sum of atomic masses × count)
- [ ] `lastUpdated` is in YYYY-MM-DD format
- [ ] `states` array matches available phase state files
- [ ] Phase state files exist for all listed states
- [ ] All units are clearly specified
- [ ] `reference` fields point to valid files

---

## Common Mistakes

### ❌ Wrong Element Reference Order
```json
"reference": "periodic-table/001_nonmetal_H.json"  // WRONG
```
✅ **Correct:**
```json
"reference": "periodic-table/001_H_nonmetal.json"
```

### ❌ Missing Unicode Subscripts
```json
"chemicalFormula": "C2H5OH"  // WRONG
```
✅ **Correct:**
```json
"chemicalFormula": "C₂H₅OH"
```

### ❌ Wrong Type for Mixtures
```json
"type": "compound"  // WRONG for saltwater
```
✅ **Correct:**
```json
"type": "mixture"
```

### ❌ Using Boolean Flags Instead of Null Values
```json
"canBoil": false  // WRONG - non-standard field
```
✅ **Correct:** Use `null` in info.json
```json
"boilingPoint": null,
"decompositionNote": "Decomposes before boiling"
```

### ❌ Missing Phase State Files
```json
"states": ["solid", "liquid", "gas"]
```
But only `liquid/state.json` exists. Must have `solid/state.json` and `gas/state.json` too.

---

## Tools & Resources

### Unicode Subscripts for Chemical Formulas
- ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉
- Example: H₂O, C₂H₅OH, C₁₂H₂₂O₁₁

### SMILES String Generator
- [PubChem](https://pubchem.ncbi.nlm.nih.gov/)
- [ChemSpider](http://www.chemspider.com/)

### Thermodynamic Data Sources
- NIST Chemistry WebBook: https://webbook.nist.gov/chemistry/
- IUPAC Periodic Table: https://iupac.org/what-we-do/periodic-table-of-elements/

---

## Questions?

See existing compound files for reference:
- Simple compound: `src/data/substances/compounds/pure/water-h2o/`
- Multiple phases: `src/data/substances/compounds/pure/acetic-acid-ch3cooh/`
- Solution: `src/data/substances/compounds/solutions/saltwater-3pct-nacl/`

---

**Last Updated:** 2026-01-29  
**Maintained By:** Boilingwater.app Development Team
