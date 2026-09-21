# BigBois Website (`bigbois.live`)

Live status portal and player onboarding page for the **BigBois Minecraft Crossplay Server**.

## Architecture & Hosting

* **Domain Registrar:** Squarespace Domains (`bigbois.live`).
* **Repository:** `https://github.com/Acidburn0x90/bigbois-website`
* **Custom Domain File (`CNAME`):**
  - Contains `bigbois.live`.
  - **CRITICAL:** Do not delete, rename, or modify `CNAME`. GitHub Pages requires this file at the repository root to maintain SSL certificate binding and routing.
* **Hosting Platform:** GitHub Pages (serving static files from root `/` of `main` branch).
* **Static Site Engine:** Bypasses Jekyll via `.nojekyll` file at repository root.
* **DNS Overview:**
  - Apex (`@`) and `www`: Routed to GitHub Pages infrastructure.
  - `mc.bigbois.live`: Java Edition Minecraft endpoint (automatic SRV discovery).
  - `mcb.bigbois.live`: Bedrock Edition Minecraft endpoint (standard port: `19132`).

## Server & Crossplay Stack

* **Platform:** Paper Minecraft Server with GeyserMC + Floodgate (Java + Bedrock crossplay).
* **Java Connection:** `mc.bigbois.live` (standard client multiplayer entry).
* **Bedrock Connection:** `mcb.bigbois.live` (default port `19132`).

## Real-Time Telemetry

* **Primary Telemetry:** `https://api.mcstatus.io/v2/status/java/mc.bigbois.live` (queries server status, online players, version, and MOTD).
* **Fallback 1:** `https://api.mcstatus.io/v2/status/bedrock/mcb.bigbois.live:19132`
* **Fallback 2:** `https://api.mcsrvstat.us/3/mc.bigbois.live`

## Development Workflow

1. **Local Preview:** Run `python3 -m http.server 8000` from repo root and open `http://localhost:8000`.
2. **Git Hygiene:** Verify `git status` and `git diff` before staging. Use atomic conventional commits.
