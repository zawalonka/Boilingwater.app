/**
 * FLUID LOADER UTILITY
 * 
 * Dynamically loads fluid property definitions from JSON files.
 * This allows easy extension to different fluids (water, ethanol, oils, etc.)
 * without modifying core game code.
 * 
 * To add a new fluid:
 * 1. Create a new JSON file in src/data/fluids/ (e.g., ethanol.json)
 * 2. Follow the same structure as water.json
 * 3. Import and use: const ethanol = await loadFluid('ethanol')
 */

/**
 * Load a fluid's properties from its JSON definition
 * 
 * @param {string} fluidId - The fluid identifier (e.g., 'water', 'ethanol')
 * @returns {Promise<Object>} Fluid properties object
 * @throws {Error} If fluid file not found or invalid JSON
 */
export async function loadFluid(fluidId) {
  try {
    // Dynamic import of the JSON file
    const fluidData = await import(`../data/fluids/${fluidId}.json`);
    
    // Validate required properties exist
    validateFluidData(fluidData.default || fluidData);
    
    return fluidData.default || fluidData;
  } catch (error) {
    console.error(`Failed to load fluid "${fluidId}":`, error);
    throw new Error(`Fluid "${fluidId}" not found or invalid. Check src/data/fluids/${fluidId}.json`);
  }
}

/**
 * Validate that a fluid definition contains all required properties
 * 
 * @param {Object} fluidData - The fluid data to validate
 * @throws {Error} If required properties are missing
 */
function validateFluidData(fluidData) {
  const required = [
    'id',
    'name',
    'properties.specificHeatLiquid',
    'properties.heatOfVaporization',
    'properties.density',
    'properties.boilingPoint',
    'coolingModel.heatTransferCoefficient'
  ];
  
  for (const path of required) {
    const value = getNestedProperty(fluidData, path);
    if (value === undefined || value === null) {
      throw new Error(`Missing required property: ${path}`);
    }
  }
}

/**
 * Get a nested property from an object using dot notation
 * 
 * @param {Object} obj - The object to traverse
 * @param {string} path - Dot-separated path (e.g., 'properties.density')
 * @returns {*} The value at the path, or undefined if not found
 */
function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Convert fluid JSON format to a simplified object for physics calculations
 * Extracts numeric values from the structured format
 * 
 * @param {Object} fluidData - Raw fluid data from JSON
 * @returns {Object} Simplified fluid properties for physics engine
 */
export function parseFluidProperties(fluidData) {
  const props = fluidData.properties;
  
  return {
    // Identification
    id: fluidData.id,
    name: fluidData.name,
    formula: fluidData.chemicalFormula,
    
    // Thermodynamic properties (extract numeric values)
    specificHeat: props.specificHeatLiquid.value,        // J/(g·°C)
    heatOfVaporization: props.heatOfVaporization.value,  // kJ/kg
    heatOfFusion: props.heatOfFusion?.value || 0,        // kJ/kg
    density: props.density.value,                         // kg/L
    
    // Phase transition temperatures
    boilingPointSeaLevel: props.boilingPoint.seaLevel,   // °C
    altitudeLapseRate: props.boilingPoint.altitudeLapseRate, // °C/m
    freezingPoint: props.freezingPoint?.value || 0,      // °C
    
    // Cooling model
    coolingCoefficient: fluidData.coolingModel.heatTransferCoefficient, // 1/s
    
    // Optional properties
    molecularMass: props.molecularMass?.value,
    thermalConductivity: props.thermalConductivity?.value,
    viscosity: props.viscosity?.value,
    
    // Visual properties (for rendering)
    visual: fluidData.visualProperties,
    
    // Metadata
    metadata: fluidData.metadata
  };
}

/**
 * List all available fluids in the fluids directory
 * 
 * @returns {Array<string>} Array of fluid IDs
 */
export function getAvailableFluids() {
  // In a real implementation, this would scan the directory
  // For now, we'll return a hardcoded list that can be expanded
  return ['water'];
  
  // Future: Add scanning logic or manifest file
  // return ['water', 'ethanol', 'saltwater', 'vegetable-oil', 'glycerin'];
}

/**
 * Default fluid (water) - used as fallback
 */
export const DEFAULT_FLUID = 'water';
