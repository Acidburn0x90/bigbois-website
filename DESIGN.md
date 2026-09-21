# BigBois Website Design System & Living Specification

This is a living specification document defining the **Arch Linux Tiling WM / Waybar Skeletal UI** design system for `bigbois.live` and related user interfaces. It must be updated whenever UI decisions, components, or layout structures evolve.

---

## 1. Design Principles

1. **Linux Tiling WM Aesthetic (Hyprland / Waybar):**
   - Strictly avoid macOS window decorations (no traffic light colored dots).
   - Use Waybar-inspired status bars with workspace pills (`1:sys`, `2:dev`), host identifier, and right-aligned system module chips.
   - Window frames resemble tiling terminals/Neovim buffers (`systemd // mc-server.service`, `nvim // directory.json`).
2. **Keyboard-Driven Interaction:**
   - Full in-browser keyboard navigation:
     - `/` : Focus and select search field.
     - `Escape` : Clear filter and unfocus.
     - `1` or `s` : Jump to Server panel.
     - `2` or `p` : Jump to Projects directory.
     - `c` : Copy Java Edition endpoint.
     - `b` : Copy Bedrock Edition endpoint.
     - `g` : Open GitHub profile in new tab.
3. **Anti-Text-Wall:** Content is constrained to compact, scannable skeletal frames. Descriptions are strictly single punchy sentences (12–15 words).
4. **Charcoal Monotone Harmony:**
   - Deep charcoal base with wireframe borders and subtle halo focus outlines.
   - High contrast monochrome typography with muted green/red status indicators only.
5. **Humble & Authentic Tone:**
   - Clear amateur/hobbyist notice clarifying that projects are learning sandboxes and forks.

---

## 2. Color Tokens

| Token | Hex Value | Role |
| :--- | :--- | :--- |
| `--bg` | `#0b0b0d` | Deep background canvas |
| `--surface` | `#131316` | Waybar and window base container |
| `--surface-tile` | `#16161a` | Tiled metric cells and cards |
| `--surface-tile-hover` | `#1c1c21` | Active/hovered element state |
| `--surface-input` | `#0f0f12` | Form search field & chip backdrops |
| `--border` | `#26262b` | Default wireframe border |
| `--border-focus` | `#4a4a55` | Focused window halo outline |
| `--border-subtle` | `#1c1c20` | Internal cell and card dividers |
| `--text-primary` | `#f4f4f5` | Headlines, active values, button text |
| `--text-secondary` | `#a1a1aa` | Item descriptions and summaries |
| `--text-muted` | `#71717a` | Workspace pills, tags, inactive tabs |
| `--text-dim` | `#52525b` | Captions, labels, shortcuts |
| `--status-green` | `#22c55e` | Live online indicator |
| `--status-red` | `#ef4444` | Offline/unreachable indicator |

---

## 3. Typography Scale

* **Pixel Accent Font:** `'Silkscreen'`, monospace (Google Fonts)
  * Usage: Workspace numbers, keyboard shortcuts (`<kbd>`), section tags, badges.
* **Primary Monospace Font:** `'JetBrains Mono'`, monospace (Google Fonts)
  * Usage: Main text, descriptions, telemetry numbers, search input, code.

---

## 4. Component Patterns

* **Waybar Header:** Fixed or sticky-ready top bar with workspace pills and status modules.
* **Tiling Window Frame:** Crisp border with a titlebar (`tile-bar`) and content body (`tile-body`). Subtle halo glow on hover or focus.
* **Metric Row:** 4-cell or 2-cell grid for compact system telemetry.
* **Tiled Project Cards:** 2-column modular grid on desktop, responsive 1-column on mobile.
* **Bottom Keybinds Strip:** Waybar-style bottom hint bar listing active shortcut keys.

---

## 5. Living Evolution Directives
* Whenever new UI components or interactive patterns are added to the codebase, update this document and the global rule at `~/.agents/rules/ui_design_system.md` immediately.
