/**
 * Unit Conversion & Formatting Utilities
 * Handles temperature unit conversion (Celsius ↔ Fahrenheit)
 * and other measurement units
 */

/**
 * Detect default temperature unit from browser locale
 * Countries using Fahrenheit: USA, some Caribbean islands
 * Everything else: Celsius
 * 
 * @returns {string} 'C' or 'F'
 */
export const getDefaultTemperatureUnit = () => {
  // Get browser language
  const locale = navigator.language || navigator.userLanguage || 'en-US'
  
  // USA uses Fahrenheit
  if (locale.startsWith('en-US')) {
    return 'F'
  }
  
  // Everything else: Celsius (default for science/education)
  return 'C'
}

/**
 * Convert Celsius to Fahrenheit
 * Formula: °F = (°C × 9/5) + 32
 * 
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9 / 5) + 32
}

/**
 * Convert Fahrenheit to Celsius
 * Formula: °C = (°F - 32) × 5/9
 * 
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * @returns {number} Temperature in Celsius
 */
export const fahrenheitToCelsius = (fahrenheit) => {
  return (fahrenheit - 32) * 5 / 9
}

/**
 * Format temperature for display with appropriate unit
 * 
 * @param {number} celsius - Temperature in Celsius
 * @param {string} unit - 'C' for Celsius, 'F' for Fahrenheit
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted temperature like "98.5°C" or "209.3°F"
 */
export const formatTemperature = (celsius, unit = 'C', decimals = 1) => {
  let temperature = celsius
  
  if (unit === 'F') {
    temperature = celsiusToFahrenheit(celsius)
  }
  
  // Round to specified decimals
  const rounded = Math.round(temperature * Math.pow(10, decimals)) / Math.pow(10, decimals)
  
  return `${rounded.toFixed(decimals)}°${unit}`
}

/**
 * Format temperature range (min to max)
 * 
 * @param {number} minCelsius - Min temperature in Celsius
 * @param {number} maxCelsius - Max temperature in Celsius
 * @param {string} unit - 'C' or 'F'
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} Formatted range like "20.0°C → 100.0°C"
 */
export const formatTemperatureRange = (minCelsius, maxCelsius, unit = 'C', decimals = 1) => {
  const minFormatted = formatTemperature(minCelsius, unit, decimals)
  const maxFormatted = formatTemperature(maxCelsius, unit, decimals)
  return `${minFormatted} → ${maxFormatted}`
}

/**
 * Get temperature label with symbol (used in UI)
 * 
 * @param {string} unit - 'C' or 'F'
 * @returns {string} Label like "Celsius (°C)" or "Fahrenheit (°F)"
 */
export const getTemperatureLabel = (unit) => {
  if (unit === 'F') {
    return 'Fahrenheit (°F)'
  }
  return 'Celsius (°C)'
}

/**
 * Altitude/Distance units conversion
 * Converts between meters and feet
 */

/**
 * Convert meters to feet
 * 1 meter = 3.28084 feet
 * 
 * @param {number} meters - Distance in meters
 * @returns {number} Distance in feet
 */
export const metersToFeet = (meters) => {
  return meters * 3.28084
}

/**
 * Convert feet to meters
 * 1 foot = 0.3048 meters
 * 
 * @param {number} feet - Distance in feet
 * @returns {number} Distance in meters
 */
export const feetToMeters = (feet) => {
  return feet * 0.3048
}

/**
 * Format altitude/elevation for display
 * 
 * @param {number} meters - Altitude in meters
 * @param {string} unit - 'metric' (meters) or 'imperial' (feet)
 * @returns {string} Formatted altitude like "1,500 m" or "4,921 ft"
 */
export const formatAltitude = (meters, unit = 'metric') => {
  if (unit === 'imperial') {
    const feet = metersToFeet(meters)
    return `${Math.round(feet).toLocaleString()} ft`
  }
  return `${Math.round(meters).toLocaleString()} m`
}

/**
 * Mass/Weight units conversion
 * Converts between kilograms and pounds
 */

/**
 * Convert kilograms to pounds
 * 1 kg = 2.20462 lbs
 * 
 * @param {number} kg - Mass in kilograms
 * @returns {number} Mass in pounds
 */
export const kilogramsToPounds = (kg) => {
  return kg * 2.20462
}

/**
 * Convert pounds to kilograms
 * 1 lb = 0.453592 kg
 * 
 * @param {number} pounds - Mass in pounds
 * @returns {number} Mass in kilograms
 */
export const poundsToKilograms = (pounds) => {
  return pounds * 0.453592
}

/**
 * Format mass/weight for display
 * 
 * @param {number} kg - Mass in kilograms
 * @param {string} unit - 'metric' (kg/g) or 'imperial' (lbs)
 * @returns {string} Formatted mass like "0.5 kg", "500 g", or "1.1 lbs"
 */
export const formatMass = (kg, unit = 'metric') => {
  if (unit === 'imperial') {
    const lbs = kilogramsToPounds(kg)
    return `${lbs.toFixed(2)} lbs`
  }
  
  // For metric, use grams if < 1 kg, otherwise kg
  if (kg < 1) {
    return `${Math.round(kg * 1000)} g`
  }
  return `${kg.toFixed(2)} kg`
}

/**
 * Create a unit preference object that persists across session
 * Used to remember user's preferred units
 */
export const createUnitPreferences = () => {
  return {
    temperature: getDefaultTemperatureUnit(),
    distance: navigator.language?.startsWith('en-US') ? 'imperial' : 'metric',
    mass: navigator.language?.startsWith('en-US') ? 'imperial' : 'metric'
  }
}

/**
 * Save unit preferences to localStorage
 * 
 * @param {object} preferences - Unit preference object
 */
export const saveUnitPreferences = (preferences) => {
  localStorage.setItem('boilingwater-units', JSON.stringify(preferences))
}

/**
 * Load unit preferences from localStorage
 * Falls back to defaults if not found
 * 
 * @returns {object} Unit preference object
 */
export const loadUnitPreferences = () => {
  try {
    const saved = localStorage.getItem('boilingwater-units')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading unit preferences:', error)
  }
  
  return createUnitPreferences()
}
