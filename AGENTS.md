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

1. **`index.html`**: Semantic, accessible shell containing the header, featured live infrastructure widget, and search/filter controls (plus hidden `Shift+V` shortcut to `vault/index.html`).
2. **`style.css`**: Modern Arch/Hyprland dark theme CSS stylesheet.
3. **`projects.js`**: Data store for all projects and directory items. Zero frontend knowledge needed to add or modify items.
4. **`vault/` (`index.html`, `vault.css`, `crypto.js`, `vault.js`, `vault.enc.json`)**: Unlisted (`robots.txt` disallowed + `noindex`), zero-knowledge client-side encrypted private atlas and architecture flow viewer (`scrypt` `N=32768,r=8,p=1` + `PBKDF2-HMAC-SHA256` `600,000` -> `HKDF-SHA256` -> `AES-256-GCM`). Rebuild ciphertext anytime via `~/.local/bin/vault-build`; plaintext never touches this repository.

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

## Living UI Design Standard (`DESIGN.md`)

The user's default design style is the **Charcoal Monotone Skeletal UI**. Full design tokens, component patterns, and typography rules are documented in [`DESIGN.md`](DESIGN.md) and globally synced in `~/.agents/rules/ui_design_system.md`. Any future visual modifications must adhere to and update these living specifications.

## Security & Path Hygiene Guidelines

* **Explicit Target Links (Zero Local Directory Browsing):** Never use bare directory paths (`../`, `./dir/`) in web frontends or links. Always target concrete filenames (`../index.html`, `./dir/index.html`) so browsers do not trigger filesystem directory indexing (`Index of /home/...`) and recursive parent folder navigation under local `file://` schemes. Never emit bare directory `file:///` URLs in documentation or assistant responses.
* **Strict DOM Input Sanitization:** Never interpolate user inputs or query parameters directly into `.innerHTML` without 5-character HTML entity escaping (`&`, `<`, `>`, `"`, `'`).
* **Reverse Tabnabbing Prevention:** All external links opening in a new tab (`target="_blank"`) must include `rel="noopener noreferrer"`.
* **Zero PII or Institutional Leaks:** Never hardcode real-world educational institutions, work domains, or user-identifying network suffixes into mock outputs or fixtures; strictly enforce standard RFC mock values (`lab.csci250.internal`, `example.com`, `192.0.2.0/24`).

