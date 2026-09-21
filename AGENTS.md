# BigBois Website & Personal Tech Directory (`bigbois.live`)

Central personal tech home portal, live infrastructure status page, and project directory for `Acidburn0x90`.

## Architecture & Hosting

* **Domain:** `bigbois.live` (Squarespace Domains).
* **Repository:** `https://github.com/Acidburn0x90/bigbois-website`
* **Hosting Platform:** GitHub Pages (serving static files from root `/` of `main` branch).
* **Domain Binding (`CNAME`):** Contains `bigbois.live`. **Do not delete or modify.**
* **Static Site Config:** Bypasses Jekyll via `.nojekyll` file at repository root.
* **DNS Endpoints:**
  * Apex (`@`) and `www`: GitHub Pages infrastructure.
  * `mc.bigbois.live`: Java Minecraft endpoint (SRV discovery).
  * `mcb.bigbois.live`: Bedrock Minecraft endpoint (Port: `19132`).

## Component Layout

1. **`index.html`**: Semantic, accessible shell containing the header, featured live infrastructure widget, and search/filter controls.
2. **`style.css`**: Modern Arch/Hyprland dark theme CSS stylesheet.
3. **`projects.js`**: Data store for all projects and directory items. Zero frontend knowledge needed to add or modify items.

## How to Add or Modify Projects (Zero Frontend Knowledge)

All directory items are managed inside `projects.js`. To add a new project, append a new object to the `PROJECTS` array:

```javascript
{
  id: "project-slug",
  title: "Project Title",
  category: "systems", // "infra" | "systems" | "security" | "simulations"
  categoryLabel: "Category Name",
  icon: "🚀",
  description: "High-signal description of the project.",
  tags: ["Tech1", "Tech2"],
  links: [
    { label: "GitHub Repo", url: "https://github.com/...", icon: "github" }
  ]
}
```

The application automatically renders the card, updates project counts, and enables search and category filtering.
