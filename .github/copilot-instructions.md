# GitHub Copilot Instructions

> **Primary Context File:** [`AI_CONTEXT.md`](../AI_CONTEXT.md)  
> Read the AI_CONTEXT.md file FIRST for complete project overview, architecture, and task-specific guidance.

---

## Quick Reference

### System & Environment
- **OS:** Windows (PowerShell only)
- **Use PowerShell cmdlets exclusively** - NO Linux commands
  - ✅ Use: `Select-Object -First 20`, `Get-Content`, `Get-ChildItem`
  - ❌ Don't use: `head`, `tail`, `cat`, `ls`, `find`

### Before Any Work
1. **Read:** [`AI_CONTEXT.md`](../AI_CONTEXT.md) - Complete navigation and architecture
2. **Check:** [`GOTCHAS.md`](../GOTCHAS.md) - Known issues that cost debugging time
3. **Review:** Task-specific docs linked in AI_CONTEXT.md

### Project Essentials
- **Tech:** React + Vite
- **Game Window:** Fixed 1280×800px (never scale)
- **Physics:** Real equations only (Newton's Law of Cooling, etc.)
- **Status:** Pre-Alpha

### Critical Rules
- ✅ Game scene is ALWAYS 1280×800px
- ✅ Theme backgrounds MUST be 1280×800
- ✅ Use real physics constants (no game physics)
- ✅ Theme name can be top-level OR in metadata (not just metadata.name)
- ✅ Read GOTCHAS.md before debugging theme issues

### File Locations
- **Components:** `src/components/` (GameScene.jsx is main gameplay)
- **Physics:** `src/utils/physics.js`
- **Theme System:** `src/utils/themeLoader.js`, `src/constants/themes.js`
- **Fluid Data:** `src/data/fluids/*.json`
- **Theme Assets:** `public/assets/themes/*/`

### Common Tasks
- **New Theme:** See [`docs/guides/THEME_QUICK_START.md`](../docs/guides/THEME_QUICK_START.md)
- **Physics Work:** See [`docs/architecture/WATER_STATES_ARCHITECTURE.md`](../docs/architecture/WATER_STATES_ARCHITECTURE.md)
- **Architecture:** See [`docs/architecture/CODEBASE_DOCUMENTATION.md`](../docs/architecture/CODEBASE_DOCUMENTATION.md)

### When You Find a Bug
Add it to [`GOTCHAS.md`](../GOTCHAS.md) with:
- Date and commit hash
- Why it was hard to spot
- Before/after code
- Key lesson learned

---

## 🚨 DEPLOYMENT WORKFLOW

**⚠️ ALWAYS PUSH TO DEV FIRST ⚠️**

1. Test locally
2. **Push to dev.boilingwater.app repo** (separate dev repository)
3. Test on dev site
4. Only then push to production

**Never skip dev testing!**

---

## Documentation Map

All detailed information is in **AI_CONTEXT.md** which provides:
- Document reading priority by task type
- Complete codebase structure
- Key architectural decisions
- Quick command reference
- Current development focus

**Don't skip AI_CONTEXT.md** - it will save significant time and tokens.

---

**Note:** This file is a lightweight pointer to the comprehensive AI_CONTEXT.md. For any substantial work, start there.
