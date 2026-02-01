# Wiki Copilot Instructions

**Scope:** Apply only within the /wiki subtree. This wiki is separate from gameplay code.

## Core Rules
- Do NOT modify gameplay runtime files (src/, public/assets/, etc.) unless explicitly asked.
- Wiki reads game data for documentation only; no behavior changes in the game.
- Prefer additive changes in /wiki only.
- Keep outputs static-site friendly (GitHub Pages).
- Use incremental generation where possible and include a force-rebuild option.

## Structure
- /wiki/src: generator scripts and templates
- /wiki/docs: wiki-specific documentation
- /wiki/dist: build output (generated)

## Content Guidelines
- Always cross-link parents/children (elements, compounds, solutions, phases).
- Show formulas and processes with readable explanations and code blocks.
- Include levels/experiments pages sourced from current constants.
