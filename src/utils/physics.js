import { ATMOSPHERE, UNIVERSAL, GAME_CONFIG } from '../constants/physics'

/**
 * Solve Antoine equation for boiling point at given pressure
 * 
 * Antoine equation: log10(Pvap) = A - B/(C + T)
 * Solved for T: T = B/(A - log10(Pvap)) - C
 * 
 * PHYSICS: The Antoine equation is an empirical formula that predicts the vapor pressure
 * of a liquid as a function of temperature. When vapor pressure equals atmospheric pressure,
 * the liquid boils. This equation is accurate to ±0.5°C across typical pressure ranges.
 * 
 * NOTE ON TminC/TmaxC: These define the EMPIRICALLY VERIFIED range, not hard limits.
 * The Antoine equation produces a smooth, continuous curve. Outside the verified range,
 * the math still works but accuracy degrades gradually:
 *   - 0.5°C outside: negligible error
 *   - 10°C outside: ~0.1-0.5°C error  
 *   - 50°C outside: ~1-5°C error
 *   - Near critical point: Antoine breaks down
 * 
 * We do NOT clamp to TminC/TmaxC. Instead, we return metadata about whether the result
 * is within the verified range so the UI can warn users when extrapolating.
 * 
 * @param {number} pressurePa - Atmospheric pressure in Pascals
 * @param {object} antoineCoeffs - { A, B, C, TminC, TmaxC } from substance JSON
 * @returns {object} { temperature: °C, isExtrapolated: bool, verifiedRange: {min, max} }
 *                   or null if coefficients are missing/invalid
 */
function solveAntoineEquation(pressurePa, antoineCoeffs) {
  if (!antoineCoeffs) return null
  
  const { A, B, C, TminC, TmaxC } = antoineCoeffs
  if (!A || !B || !C) return null
  
  // Convert pressure from Pa to mmHg (Antoine coefficients use mmHg)
  // 1 Pa = 1/133.322 mmHg
  // 1 mmHg = 133.322 Pa (exactly)
  const pressureMmHg = pressurePa / 133.322
  
  // Rearrange Antoine equation: log10(Pvap) = A - B/(C + T)
  // → A - log10(Pvap) = B/(C + T)
  // → (C + T) = B / (A - log10(Pvap))
  // → T = B / (A - log10(Pvap)) - C
  
  const logP = Math.log10(pressureMmHg)
  const denominator = A - logP
  
  // Prevent division by zero
  if (Math.abs(denominator) < 1e-10) return null
  
  const boilingPoint = (B / denominator) - C
  
  // Check if result is within empirically verified range (for UI warning, NOT clamping)
  const hasMinBound = Number.isFinite(TminC)
  const hasMaxBound = Number.isFinite(TmaxC)
  const belowMin = hasMinBound && boilingPoint < TminC
  const aboveMax = hasMaxBound && boilingPoint > TmaxC
  const isExtrapolated = belowMin || aboveMax
  
  return {
    temperature: boilingPoint,
    isExtrapolated,
    verifiedRange: {
      min: hasMinBound ? TminC : null,
      max: hasMaxBound ? TmaxC : null
    }
  }
}

/**
 * Calculate boiling point based on altitude
 * Now accepts fluid properties for different substances
 * 
 * PHYSICS BACKGROUND:
 * Liquids boil when their vapor pressure equals atmospheric pressure. As altitude increases,
 * atmospheric pressure decreases, so liquids boil at lower temperatures.
 * Real-world example: At Denver (1600m), water boils at ~95°C instead of 100°C.
 * At Mount Everest (8848m), water boils at ~68°C.
 * 
 * ALGORITHM:
 * 1. Calculate atmospheric pressure at given altitude (barometric formula)
 * 2. Use Antoine equation (if available) to find temperature where vapor pressure equals atmospheric pressure
 * 3. Apply mixture elevation (boilingPointElevation) for solutions
 * 4. Fall back to linear approximation if Antoine coefficients not available
 * 
 * Accuracy:
 * - Antoine equation: ±0.5°C (empirical, substance-specific)
 * - Linear model: ±2°C (approximation, works for Earth altitudes)
 * 
 * @param {number} altitude - Altitude in meters above sea level (0 = sea level, 5000 = Denver)
 * @param {object} fluidProps - Fluid properties object containing:
 *   - boilingPointSeaLevel: °C at sea level
 *   - antoineCoefficients: {A, B, C, TminC, TmaxC} for accurate calculation
 *   - boilingPointElevation: °C elevation for mixtures/solutions (optional)
 *   - altitudeLapseRate: °C/meter fallback rate
 * @returns {object} { temperature: °C, isExtrapolated: bool, verifiedRange: {min, max} }
 *                   or null if insufficient data
 */
export function calculateBoilingPoint(altitude, fluidProps) {
  if (!fluidProps || !Number.isFinite(fluidProps.boilingPointSeaLevel)) {
    return null
  }

  // Safety check: treat null/undefined as sea level
  if (altitude === null || altitude === undefined || Number.isNaN(altitude)) altitude = 0
  
  // Calculate atmospheric pressure at altitude
  const atmosphericPressure = calculatePressure(altitude)
  
  // PRIORITY 1: Use Antoine equation if available (highly accurate, ±0.5°C)
  if (fluidProps.antoineCoefficients) {
    const antoineResult = solveAntoineEquation(atmosphericPressure, fluidProps.antoineCoefficients)
    if (antoineResult && Number.isFinite(antoineResult.temperature)) {
      // Calculate DYNAMIC boiling point elevation based on actual boiling temperature
      // This is critical: Kb depends on temperature, so elevation is different at altitude!
      const elevation = calculateBoilingPointElevation(antoineResult.temperature, fluidProps)
      const finalTemp = antoineResult.temperature + elevation
      return {
        temperature: finalTemp,
        isExtrapolated: antoineResult.isExtrapolated,
        verifiedRange: antoineResult.verifiedRange,
        baseBoilingPoint: antoineResult.temperature,
        elevation: elevation
      }
    }
  }
  
  // PRIORITY 2: Fall back to linear lapse rate approximation (±2°C)
  // Used for substances without Antoine coefficients
  // NOTE: This is a simplified model. The lapse rate constant is approximate.
  const lapseRate = Number.isFinite(fluidProps.altitudeLapseRate)
    ? fluidProps.altitudeLapseRate
    : ATMOSPHERE.TEMP_LAPSE_RATE
  const temperatureDrop = altitude * lapseRate
  
  // Start from fluid's standard boiling point and subtract elevation effect
  const baseBoilingPoint = fluidProps.boilingPointSeaLevel - temperatureDrop
  
  // Calculate dynamic elevation for this base temperature
  const elevation = calculateBoilingPointElevation(baseBoilingPoint, fluidProps)
  const boilingPoint = baseBoilingPoint + elevation

  // Fallback path has no verified range metadata (no Antoine data)
  return {
    temperature: boilingPoint,
    isExtrapolated: false,  // Can't determine without Antoine range
    verifiedRange: { min: null, max: null },
    baseBoilingPoint: baseBoilingPoint,
    elevation: elevation
  }
}

/**
 * Calculate atmospheric pressure at given altitude using ISA (International Standard Atmosphere)
 * 
 * PHYSICS BACKGROUND:
 * The ISA troposphere model accounts for temperature decreasing with altitude,
 * which causes pressure to drop faster than a simple isothermal model predicts.
 * 
 * In the troposphere (0-11km):
 *   T = T₀ - L × h  (temperature decreases linearly)
 *   P = P₀ × (T/T₀)^(g×M/(R×L))
 * 
 * Where:
 *   T₀ = 288.15 K (15°C at sea level)
 *   L = 0.0065 K/m (temperature lapse rate)
 *   P₀ = 101,325 Pa (sea level pressure)
 *   g = 9.80665 m/s² (standard gravity)
 *   M = 0.0289644 kg/mol (molar mass of dry air)
 *   R = 8.31447 J/(mol·K) (gas constant)
 * 
 * Real-world examples (ISA values):
 * - Sea level (0m): 101,325 Pa
 * - Denver (1,609m): 83,436 Pa → water boils at ~95°C
 * - La Paz (3,640m): 64,591 Pa → water boils at ~87°C
 * - Mount Everest (8,848m): 31,436 Pa → water boils at ~70°C
 * - 10,000m: 26,436 Pa → water boils at ~66°C
 * 
 * @param {number} altitude - Altitude in meters (0 = sea level)
 * @returns {number} Atmospheric pressure in Pascals
 */
export function calculatePressure(altitude) {
  // Safety check: treat null/undefined as sea level
  if (altitude === null || altitude === undefined || Number.isNaN(altitude)) altitude = 0
  
  // ISA troposphere constants (valid for 0-11km)
  const T0 = 288.15       // Sea level temperature (K)
  const L = 0.0065        // Temperature lapse rate (K/m)
  const P0 = ATMOSPHERE.STANDARD_PRESSURE  // 101325 Pa
  const g = 9.80665       // Standard gravity (m/s²)
  const M = 0.0289644     // Molar mass of dry air (kg/mol)
  const R = 8.31447       // Gas constant (J/(mol·K))
  
  // Temperature at altitude
  const T = T0 - L * altitude
  
  // Prevent negative temperatures (troposphere ends at ~11km anyway)
  if (T <= 0) {
    // Above troposphere - use stratosphere model or cap
    // For now, return minimum troposphere pressure (at 11km)
    const T11km = T0 - L * 11000  // ~216.65 K
    const exponent = (g * M) / (R * L)
    return P0 * Math.pow(T11km / T0, exponent)  // ~22,632 Pa
  }
  
  // ISA pressure formula: P = P₀ × (T/T₀)^(g×M/(R×L))
  const exponent = (g * M) / (R * L)  // ≈ 5.2559
  const pressure = P0 * Math.pow(T / T0, exponent)
  
  return pressure
}

/**
 * Calculate dynamic ebullioscopic constant (Kb) at a given boiling temperature
 * 
 * PHYSICS BACKGROUND:
 * The ebullioscopic constant Kb determines how much a solute raises the boiling point.
 * It's NOT a constant - it depends on the boiling temperature itself:
 * 
 *   Kb = (R × Tb² × Msolvent) / ΔHvap
 * 
 * Where:
 *   R = 8.314 J/(mol·K)
 *   Tb = boiling temperature in Kelvin
 *   Msolvent = molar mass of solvent in kg/mol (0.018015 for water)
 *   ΔHvap = enthalpy of vaporization in J/mol (40,660 for water at 100°C)
 * 
 * For water:
 *   At 100°C (373.15K): Kb ≈ 0.512 °C·kg/mol
 *   At 66°C (339.15K): Kb ≈ 0.423 °C·kg/mol
 *   At 50°C (323.15K): Kb ≈ 0.384 °C·kg/mol
 * 
 * @param {number} boilingTempC - Boiling temperature in Celsius
 * @param {number} solventMolarMass - Molar mass of solvent in g/mol (18.015 for water)
 * @param {number} heatOfVapKJ - Heat of vaporization in kJ/mol (40.66 for water)
 * @returns {number} Kb in °C·kg/mol
 */
function calculateDynamicKb(boilingTempC, solventMolarMass = 18.015, heatOfVapKJ = 40.66) {
  const R = 8.314                           // Gas constant (J/(mol·K))
  const Tb = boilingTempC + 273.15          // Convert to Kelvin
  const Msolvent = solventMolarMass / 1000  // Convert g/mol to kg/mol
  const deltaHvap = heatOfVapKJ * 1000      // Convert kJ/mol to J/mol
  
  // Kb = (R × Tb² × Msolvent) / ΔHvap
  const Kb = (R * Tb * Tb * Msolvent) / deltaHvap
  
  return Kb
}

/**
 * Calculate dynamic boiling point elevation for a solution
 * 
 * PHYSICS: ΔTb = i × Kb × m
 * Where Kb is calculated dynamically based on actual boiling temperature
 * 
 * @param {number} baseBoilingPointC - Base boiling point of pure solvent (°C)
 * @param {object} solutionProps - Solution properties with vanHoffFactor and molality
 * @returns {number} Boiling point elevation in °C
 */
function calculateBoilingPointElevation(baseBoilingPointC, solutionProps) {
  if (!solutionProps) return 0
  
  const { vanHoffFactor, molality } = solutionProps
  
  // If we don't have dynamic parameters, fall back to static elevation
  if (!Number.isFinite(vanHoffFactor) || !Number.isFinite(molality)) {
    // Legacy fallback: use pre-computed boilingPointElevation if available
    return Number.isFinite(solutionProps.boilingPointElevation) 
      ? solutionProps.boilingPointElevation 
      : 0
  }
  
  // Calculate Kb at the actual boiling temperature
  // For now, assume water as solvent (most common case)
  // TODO: Get solvent molar mass and ΔHvap from solvent's JSON for other solvents
  const Kb = calculateDynamicKb(baseBoilingPointC)
  
  // ΔTb = i × Kb × m
  const elevation = vanHoffFactor * Kb * molality
  
  return elevation
}

/**
 * Calculate energy needed to heat a fluid from T₁ to T₂
 * Now accepts fluid properties for different substances
 * 
 * PHYSICS BACKGROUND:
 * The formula Q = mcΔT is the fundamental equation for sensible heat:
 * Where:
 *   Q = thermal energy (Joules)
 *   m = mass of fluid (kilograms)
 *   c = specific heat capacity (varies by substance: 4.186 for water, 2.44 for ethanol, etc.)
 *   ΔT = temperature change (°C)
 * 
 * Real-world example (water):
 * To heat 1 liter of water (1 kg) from 20°C to 100°C (ΔT = 80°C):
 * Q = 1 kg × 4,186 J/(kg·°C) × 80°C = 334,880 Joules
 * A 1000W electric kettle takes: 334,880 J ÷ 1000 W = 335 seconds ≈ 5.6 minutes
 * 
 * Note: This function assumes the fluid stays LIQUID (below boiling point).
 * Once fluid boils, additional energy goes to vaporization, not temperature increase.
 * 
 * @param {number} mass - Mass of fluid in kilograms
 * @param {number} tempStart - Starting temperature (°C)
 * @param {number} tempEnd - Ending temperature (°C)
 * @param {object} fluidProps - Fluid properties object containing specificHeat
 * @returns {number} Energy required in Joules
 */
export function calculateHeatingEnergy(mass, tempStart, tempEnd, fluidProps) {
  // Calculate temperature change
  const deltaT = tempEnd - tempStart
  
  // Convert mass from kg to grams for consistency with specific heat capacity units
  // (Specific heat is typically expressed as J/(g·°C))
  const massGrams = mass * 1000
  
  // Apply Q = mcΔT formula
  const energy = massGrams * fluidProps.specificHeat * deltaT
  
  return energy
}

/**
 * Calculate temperature change from applied heat energy
 * Now accepts fluid properties for extensibility to different substances
 * 
 * PHYSICS BACKGROUND:
 * When you apply heat to a liquid, one of two things happens:
 * 
 * 1. BELOW BOILING POINT (liquid phase):
 *    Temperature increases using Q = mcΔT rearranged to ΔT = Q/(mc)
 *    Example: 100,000 J of heat → water goes from 20°C to 44°C
 * 
 * 2. AT BOILING POINT (phase change):
 *    Temperature stays constant while energy converts liquid → vapor
 *    Energy requirement: Q_vaporization = m × L_v
 *    Where L_v = latent heat of vaporization (2,257 kJ/kg for water, 838 kJ/kg for ethanol)
 *    Example: At 100°C, 100,000 J converts ~0.044 kg of water to steam
 * 
 * This function handles the transition: it calculates how much energy
 * goes to raising temperature vs. how much goes to vaporization.
 * 
 * @param {number} mass - Mass of fluid in kilograms
 * @param {number} currentTemp - Current fluid temperature (°C)
 * @param {number} energyJoules - Heat energy applied in Joules
 * @param {number} boilingPoint - Boiling point at current altitude (°C)
 * @param {object} fluidProps - Fluid properties object containing specificHeat and heatOfVaporization
 * @returns {object} Object containing:
 *   - newTemp: temperature after energy application (°C)
 *   - energyToVaporization: energy remaining for phase change (J)
 *   - steamGenerated: mass of fluid converted to vapor (kg)
 */
export function applyHeatEnergy(mass, currentTemp, energyJoules, boilingPoint, fluidProps) {
  if (!Number.isFinite(fluidProps?.specificHeat) || mass <= 0) {
    return {
      newTemp: currentTemp,
      energyToVaporization: 0,
      steamGenerated: 0
    }
  }

  const massGrams = mass * 1000
  
  // CASE 1: Apply energy as sensible heat (temperature increase)
  // ΔT = Q / (mc)
  const tempIncrease = energyJoules / (massGrams * fluidProps.specificHeat)
  const potentialNewTemp = currentTemp + tempIncrease

  const canBoil = Number.isFinite(boilingPoint) && Number.isFinite(fluidProps?.heatOfVaporization) && fluidProps.heatOfVaporization > 0
  
  // If heating doesn't reach boiling point, we're done—just update temperature
  if (!canBoil || potentialNewTemp < boilingPoint) {
    return {
      newTemp: potentialNewTemp,
      energyToVaporization: 0,
      steamGenerated: 0
    }
  }
  
  // CASE 2: We reach or exceed boiling point
  // Step A: Calculate energy needed to reach boiling point
  const energyToBoiling = calculateHeatingEnergy(mass, currentTemp, boilingPoint, fluidProps)
  
  // Step B: Calculate remaining energy after reaching boiling point
  const remainingEnergy = energyJoules - energyToBoiling
  
  // Step C: Convert remaining energy into vapor
  // m_vapor = Q / L_v, where L_v = latent heat of vaporization
  // heatOfVaporization is in kJ/kg, so multiply by 1000 to get J/kg
  const steamGenerated = remainingEnergy / (fluidProps.heatOfVaporization * 1000)
  
  return {
    newTemp: boilingPoint,           // Temperature stays at boiling point
    energyToVaporization: remainingEnergy,
    steamGenerated: Math.max(0, steamGenerated) // Never negative
  }
}

/**
 * Convert Celsius to Fahrenheit
 * Formula: °F = (°C × 9/5) + 32
 * Example: 100°C = 212°F
 * 
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
export function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32
}

/**
 * Convert Fahrenheit to Celsius
 * Formula: °C = (°F - 32) × 5/9
 * Example: 212°F = 100°C
 * 
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * @returns {number} Temperature in Celsius
 */
export function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9
}

/**
 * Format temperature with specified decimal precision
 * Used for display in UI (e.g., "87.3°C" instead of "87.23456789°C")
 * 
 * @param {number} temp - Temperature value to format
 * @param {number} precision - Number of decimal places (default: 1)
 * @returns {string} Formatted temperature string (e.g., "87.3" for precision=1)
 */
export function formatTemperature(temp, precision = 1) {
  return temp.toFixed(precision)
}

/**
 * Simulate one discrete time step of the fluid heating/boiling process
 * Now with Newton's Law of Cooling and fluid property support
 * 
 * GAME SIMULATION LOOP:
 * The game calls this function every 100ms (TIME_STEP from constants).
 * Each call represents 0.1 seconds of real time, during which:
 * 1. Heat energy is applied (heatInputWatts × deltaTime = Joules)
 * 2. Fluid temperature increases or fluid vaporizes
 * 3. Fluid mass decreases as vapor escapes
 * 4. Natural cooling occurs when heat input is negative or zero (Newton's Law)
 * 
 * NEWTON'S LAW OF COOLING:
 * When a hot object cools, the rate of temperature change is proportional
 * to the temperature difference between the object and its surroundings:
 * 
 *   dT/dt = -k(T - T_ambient)
 * 
 * Where:
 *   k = heat transfer coefficient (depends on fluid, container, air movement)
 *   T = current temperature
 *   T_ambient = room temperature (typically 20°C)
 * 
 * This creates exponential decay: hot fluids cool quickly at first, then
 * progressively slower as they approach room temperature.
 * 
 * Example: Water at 100°C with k=0.0015/s in a metal pot:
 *   - At 100°C: cooling rate = -0.0015 × (100-20) = -0.12°C/s (fast)
 *   - At 60°C: cooling rate = -0.0015 × (60-20) = -0.06°C/s (medium)
 *   - At 30°C: cooling rate = -0.0015 × (30-20) = -0.015°C/s (slow)
 * 
 * EXAMPLE WALKTHROUGH (water):
 * Starting state: 1 kg of water at 20°C, altitude 0m (sea level)
 * Stove provides: 2000W heat input, simulation step: 0.1 seconds
 * 
 * Step 1: Calculate boiling point = 100°C (at sea level for water)
 * Step 2: Energy applied = 2000W × 0.1s = 200 Joules
 * Step 3: Call applyHeatEnergy(1.0, 20, 200, 100, waterProps)
 *         ΔT = 200 / (1000g × 4.186 J/(g·°C)) = 0.048°C
 *         New temperature = 20.048°C (still far from boiling)
 * Step 4: Return updated state with new temperature
 * 
 * After many iterations (~ 335 iterations at 100ms each = 33.5 seconds):
 * Water reaches 100°C, then remaining energy converts to steam
 * 
 * @param {object} state - Current simulation state containing:
 *   - waterMass: mass of fluid remaining (kg)
 *   - temperature: current fluid temperature (°C)
 *   - altitude: altitude above sea level (meters)
 * @param {number} heatInputWatts - Power input from stove (Watts = Joules/second)
 *                                  Use 0 or negative for natural cooling only
 * @param {number} deltaTime - Time step duration (seconds, typically 0.1)
 * @param {object} fluidProps - Fluid properties (specificHeat, heatOfVaporization, coolingCoefficient, etc.)
 * @returns {object} Updated state with:
 *   - temperature: new fluid temperature (°C)
 *   - waterMass: remaining fluid after vaporization (kg)
 *   - energyToVaporization: energy used for phase change (J)
 *   - steamGenerated: mass of fluid converted to vapor (kg)
 *   - allEvaporated: boolean flag if fluid mass drops to zero
 */
export function simulateTimeStep(state, heatInputWatts, deltaTime, fluidProps) {
  const { waterMass, temperature, altitude } = state
  const residueMass = Number.isFinite(state.residueMass) ? state.residueMass : 0
  const evaporableMass = Math.max(0, waterMass - residueMass)
  
  // Safety check: if fluid is completely gone, mark it and return early
  if (waterMass <= 0 || evaporableMass <= 0) {
    return { ...state, allEvaporated: evaporableMass <= 0 }
  }

  if (!fluidProps) {
    return { ...state }
  }
  
  // Calculate what the boiling point is at this altitude
  const boilingPointResult = calculateBoilingPoint(altitude, fluidProps)
  const boilingPoint = boilingPointResult?.temperature ?? null
  const canBoil = Boolean(fluidProps.canBoil) && Number.isFinite(boilingPoint)
  
  // HEATING PHASE: Apply heat energy from burner
  let currentTemp = temperature
  let result = { newTemp: currentTemp, energyToVaporization: 0, steamGenerated: 0 }
  
  if (heatInputWatts > 0) {
    // Convert heat power to energy: E = P × t
    const energyApplied = heatInputWatts * deltaTime
    
    // Apply all the energy to the fluid and get back new state
    result = applyHeatEnergy(waterMass, currentTemp, energyApplied, boilingPoint, fluidProps)
    currentTemp = result.newTemp
  }
  
  // COOLING PHASE: Apply Newton's Law of Cooling
  // Only cool if temperature is above ambient (and not actively boiling)
  const AMBIENT_TEMP = GAME_CONFIG.ROOM_TEMPERATURE || 20  // Room temperature in Celsius
  
  if (currentTemp > AMBIENT_TEMP && heatInputWatts <= 0) {
    // Newton's Law: dT/dt = -k(T - T_ambient)
    // Discrete approximation: ΔT = -k × (T - T_ambient) × Δt
    const tempDifference = currentTemp - AMBIENT_TEMP
    const coolingRate = fluidProps.coolingCoefficient * tempDifference * deltaTime
    currentTemp = currentTemp - coolingRate
    
    // Never cool below ambient temperature
    currentTemp = Math.max(currentTemp, AMBIENT_TEMP)
  }
  
  // Return updated game state with all new values
  const steamGenerated = canBoil
    ? Math.min(result.steamGenerated, evaporableMass)
    : 0
  const nextWaterMass = Math.max(waterMass - steamGenerated, residueMass)

  return {
    ...state,
    temperature: currentTemp,
    waterMass: nextWaterMass,
    energyToVaporization: result.energyToVaporization,
    steamGenerated: steamGenerated,
    isBoiling: canBoil && currentTemp >= boilingPoint && steamGenerated > 0,
    // Pass through extrapolation metadata for UI warning
    isExtrapolated: boilingPointResult?.isExtrapolated ?? false,
    verifiedRange: boilingPointResult?.verifiedRange ?? { min: null, max: null }
  }
}
