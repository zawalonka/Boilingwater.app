# Codebase Gotchas

> **Purpose:** Document non-obvious issues, edge cases, and "gotchas" that cost significant time/tokens to debug. This file helps AI agents and developers understand the codebase's quirks quickly.

---

## Theme System

### Theme Validation: Name Field Location
**Date Fixed:** 2026-01-25  
**Commit:** `96f1e72`  
**Tokens to Debug:** High  

**Issue:**  
Theme switching was failing because the validator required themes to have `metadata.name`, but themes can legitimately have the `name` field at the **top level** instead.

**What happened:**
- Themes were failing validation with "metadata.name is required"
- The validator was too strict, assuming a specific structure
- This wasn't obvious from reading the theme JSON files since some had top-level `name`

**The Fix:**
Changed validation in `src/utils/themeLoader.js` from:
```javascript
// ❌ Too strict
if (!themeData.metadata.name) {
  throw new Error(`metadata.name is required`)
}
```

To:
```javascript
// ✅ Flexible
if (!themeData.name && (!themeData.metadata || !themeData.metadata.name)) {
  throw new Error(`Theme must have a 'name' field`)
}
```

**Key Lesson:**  
When validating JSON structures, allow flexible field locations unless there's a strong architectural reason not to. Themes can have `name` at root OR in `metadata.name`.

**Files to check:**
- [`src/utils/themeLoader.js`](src/utils/themeLoader.js) - Validation logic
- Theme JSON files in `public/assets/themes/`

---

## How to Use This File

**When adding a gotcha:**
1. Include the date and commit hash
2. Explain WHY it was hard to spot
3. Show the before/after code if relevant
4. Link to related files
5. Note the "key lesson" for future reference

**Categories to track:**
- Validation logic that's too strict/loose
- Race conditions or timing issues
- Non-obvious dependencies between components
- Edge cases in physics calculations
- Theme/styling quirks
- State management gotchas
