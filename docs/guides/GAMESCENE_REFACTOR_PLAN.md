# GameScene.jsx Refactor Plan - Extract ControlPanel

## Current State Analysis

**File:** `src/components/GameScene.jsx`  
**Size:** 1552 lines  
**Main responsibilities:** Physics, dragging, rendering, status display, controls, location/altitude UI

---

## Control Panel UI Logic Identification

### Lines ~1420-1750 (330+ lines) - Status Panel Rendering
This is the main control panel that floats in the game scene:

```jsx
<div className="status-panel">
  <div className="status-content">
    // 1. Display items (Ambient temp, Substance, Liquid mass, Boiling point, etc.)
    <div className="status-item">
    // 2. Timer controls (with start/stop/reset buttons)
    <div className="timer-controls">
    // 3. Expected boil time estimate
    <div className="status-item"> Est. Time...
    // 4. Fluid selector dropdown
    <div className="fluid-selector">
    // 5. Speed controls (basic and advanced modes)
    <button className="action-button speed-button">
    <div className="speed-controls-advanced">
    // 6. Heating/cooling/boiling status text
    <p className="status-text">
    // 7. Empty pot hint
    <p className="hint-text">
    // 8. Altitude controls (input + location button)
    <div className="altitude-control">
  </div>
</div>
```

### Lines ~1750-1850+ (100+ lines) - Location Popup
Modal that appears for location/altitude selection:
```jsx
{showLocationPopup && isLocationPopupAllowed && (
  <div className="location-panel">
    // Location search input
    <input type="text" placeholder="Enter city...">
    // Location buttons
    <button onClick={handleSearchLocation}>
    <button onClick={handleFindMyLocation}>
    <button onClick={handleSetManualAltitude}>
  </div>
)}
```

---

## Required Props & Callbacks

### Props (Data flowing in):
```javascript
// Game state
waterInPot, liquidMass, temperature, isBoiling
residueMass, fluidName, boilingPoint, boilingPointSeaLevel
canBoil, isPotOverFlame, expectedBoilTime, formatTemperature

// UI state
timeSpeed, isTimerRunning, timeElapsed
activeExperiment, activeFluid, availableFluids
showSelectors, isAdvancedModeAvailable
altitude, location, locationName, hasSetLocation
userZipCode, manualAltitude, showLocationPopup
isLocationPopupAllowed, locationError, isLoadingLocation

// Config constants
burnerHeat, wattageSteps, maxHeatIndex
GAME_CONFIG (ROOM_TEMPERATURE)

// Advanced
editableAltitude
```

### Callbacks (Methods flowing out):
```javascript
// Burner/Heat controls
handleBurnerKnob, handleHeatUp, handleHeatDown

// Timer controls
handleTimerToggle, handleTimerReset

// Speed controls
handleSpeedUp, handleSpeedDouble, handleSpeedHalve

// Fluid selection
handleFluidChange

// Location/Altitude
handleSearchLocation, handleSetManualAltitude, handleFindMyLocation, handleResetLocation
onLocationChange

// State setters
setTimeSpeed, setIsTimerRunning, setTimeElapsed
setActiveFluid, setEditableAltitude
setUserZipCode, setManualAltitude, setShowLocationPopup
setLocationError, setLocationName, setIsLoadingLocation, setHasSetLocation
```

---

## Extraction Strategy

### Component: `ControlPanel.jsx` (new)
**Location:** `src/components/ControlPanel.jsx`  
**Responsibility:** Render status display, timers, controls, dropdowns, altitude/location UI

**Props:** ~20 items (game state, UI state, config)  
**Callbacks:** ~10 methods (heat, timer, speed, location, etc.)

### Component: `LocationPopup.jsx` (optional - can stay in GameScene for now)
**Responsibility:** Modal for location/altitude selection  
**Decision:** Extract if ControlPanel becomes >200 lines, otherwise keep in GameScene

---

## Refactoring Steps

### Phase 1: Create ControlPanel Component
1. Create `src/components/ControlPanel.jsx`
2. Move all status-panel JSX from GameScene to ControlPanel
3. Accept props and callbacks
4. Import necessary utilities (formatTime, etc.)

### Phase 2: Update GameScene
1. Replace inline JSX with `<ControlPanel {...props} />`
2. Keep all state and logic in GameScene (no state lifting needed yet)
3. Pass props via spread or explicit list
4. Keep location popup in GameScene for now (coupled with location logic)

### Phase 3: Testing & Cleanup
1. Verify game still works: dragging, heating, boiling, controls
2. Test all modes: basic mode, advanced mode, all experiments
3. Verify location popup still works
4. Check console for errors

### Phase 4 (Optional): Extract LocationPopup
If ControlPanel is still >250 lines after Phase 2:
1. Create `src/components/LocationPopup.jsx`
2. Move modal JSX from GameScene to LocationPopup
3. Pass location state and callbacks

---

## Files Affected

### Modified:
- `src/components/GameScene.jsx` - Remove ~330 lines of JSX, add 1 component call
- `src/components/ControlPanel.jsx` - NEW, ~400 lines
- `src/styles/GameScene.css` - No changes expected (classes stay the same)

### Unchanged:
- All logic files (physics.js, locationUtils.js, etc.)
- All state management (stays in GameScene)
- Imports and dependencies

---

## Success Criteria

✅ GameScene.jsx reduces to ~1150-1200 lines  
✅ ControlPanel.jsx is ~350-400 lines  
✅ Game functionality unchanged (dragging, heating, boiling all work)  
✅ All controls work (burner, timer, speed, fluid, location)  
✅ No console errors or warnings  
✅ Responsive to screen size changes  

---

## Rollback Plan

If issues arise:
- Revert to commit `f488c77` (pre-work checkpoint)
- No complexity added; pure extraction with no logic changes
