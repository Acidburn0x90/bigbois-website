/**
 * =============================================================================
 * BIGBOIS HUB - PROJECTS & SERVICES DIRECTORY DATA
 * =============================================================================
 * 
 * ZERO FRONT-END KNOWLEDGE NEEDED TO EDIT!
 * 
 * To add a new project, service, or directory link:
 * 1. Copy any block between the curly braces { ... },
 * 2. Paste it at the top or bottom of the `PROJECTS` list below.
 * 3. Update the fields (title, description, tags, url).
 * 4. Save and commit. The website will automatically render the new card,
 *    update the filters, and enable search!
 * 
 * Categories available:
 *   - "infra"        -> Infrastructure & Servers
 *   - "systems"      -> Systems & Games
 *   - "security"     -> Security & Tools
 *   - "simulations"  -> Math, Science & Simulations
 * =============================================================================
 */

const PROJECTS = [
  {
    id: "minecraft-crossplay",
    title: "BigBois Minecraft Server",
    category: "infra",
    categoryLabel: "Infrastructure",
    icon: "⛏️",
    description: "Dedicated 24/7 Paper 1.21.x crossplay server with GeyserMC & Floodgate for seamless Java and Bedrock co-play. Hosted on Arch Linux.",
    tags: ["Paper 1.21", "GeyserMC", "Crossplay", "Arch Linux"],
    links: [
      { label: "Live Status", url: "#status-section", icon: "server" },
      { label: "GitHub Repo", url: "https://github.com/Acidburn0x90/bigbois-website", icon: "github" }
    ]
  },
  {
    id: "echos-of-sylvaris",
    title: "Echos of Sylvaris (MUD)",
    category: "systems",
    categoryLabel: "Systems & Games",
    icon: "⚔️",
    description: "Custom Multi-User Dungeon text MMORPG engine featuring low-level TCP socket networking, concurrent player loops, and persistent world state.",
    tags: ["Java", "Networking", "MMORPG", "Concurrency"],
    links: [
      { label: "GitHub Repo", url: "https://github.com/Acidburn0x90/Echos-Of-Sylvaris", icon: "github" }
    ]
  },
  {
    id: "game-of-life",
    title: "Game of Life",
    category: "simulations",
    categoryLabel: "Simulations",
    icon: "🧬",
    description: "Conway's Game of Life cellular automata simulator with customizable grid topologies, birth/survival rule sets, and pattern visualizers.",
    tags: ["Java", "Algorithms", "Cellular Automata", "Graphics"],
    links: [
      { label: "GitHub Repo", url: "https://github.com/Acidburn0x90/GameOfLife", icon: "github" }
    ]
  },
  {
    id: "chaoslite",
    title: "ChaosLite Security Suite",
    category: "security",
    categoryLabel: "Security & Tools",
    icon: "🛡️",
    description: "Autonomous agentic red-teaming and security reconnaissance framework with multi-agent orchestration, infrastructure mapping, and reporting.",
    tags: ["Python", "Security", "Agents", "Automation"],
    links: [
      { label: "Profile", url: "https://github.com/Acidburn0x90", icon: "external" }
    ]
  },
  {
    id: "cas-engine",
    title: "Computer Algebra System",
    category: "simulations",
    categoryLabel: "Math & Science",
    icon: "📐",
    description: "Symbolic mathematics engine built in Java for AST expression parsing, symbolic algebraic simplification, differentiation, and equation solving.",
    tags: ["Java", "Mathematics", "AST", "Compilers"],
    links: [
      { label: "GitHub Repo", url: "https://github.com/Acidburn0x90/CAS", icon: "github" }
    ]
  },
  {
    id: "autodiff-dual-numbers",
    title: "Auto-Diff with Dual Numbers",
    category: "simulations",
    categoryLabel: "Math & Science",
    icon: "📈",
    description: "Forward-mode automatic differentiation leveraging dual number hypercomplex algebra for exact analytical derivatives without symbolic overhead.",
    tags: ["Algorithms", "Math", "AutoDiff"],
    links: [
      { label: "GitHub Repo", url: "https://github.com/Acidburn0x90/Automatic-Differentiation-with-Dual-Numbers", icon: "github" }
    ]
  },
  {
    id: "network-mapping",
    title: "Network Topology & Mapping",
    category: "security",
    categoryLabel: "Security & Tools",
    icon: "🌐",
    description: "Automated subnet discovery, host port profiling, and dynamic network topology graph generation via Nmap and Graphviz.",
    tags: ["Python", "Nmap", "Graphviz", "Networking"],
    links: [
      { label: "Profile", url: "https://github.com/Acidburn0x90", icon: "external" }
    ]
  },
  {
    id: "physics-sim",
    title: "Physics & Orbital Simulators",
    category: "simulations",
    categoryLabel: "Simulations",
    icon: "🪐",
    description: "Interactive numerical physics simulations including gravitational n-body orbital mechanics, Lorenz chaotic strange attractors, and kinematics.",
    tags: ["Python", "SciPy", "Physics", "Dynamics"],
    links: [
      { label: "Profile", url: "https://github.com/Acidburn0x90", icon: "external" }
    ]
  },
  {
    id: "flipper-irdb",
    title: "Flipper Zero IR Database",
    category: "security",
    categoryLabel: "Security & Tools",
    icon: "📻",
    description: "Curated collection and analysis of infrared signal captures and remote profiles for hardware security testing and home automation.",
    tags: ["Embedded", "Hardware", "IR", "Flipper Zero"],
    links: [
      { label: "GitHub Repo", url: "https://github.com/Acidburn0x90/Flipper-IRDB", icon: "github" }
    ]
  },
  {
    id: "slime-rancher-mods",
    title: "Slime Rancher Modding",
    category: "systems",
    categoryLabel: "Systems & Games",
    icon: "🧪",
    description: "C# .NET runtime game modification, bytecode patching, and reverse engineering for custom slime behaviors and game mechanics.",
    tags: ["C#", ".NET", "Game Modding", "Reverse Eng"],
    links: [
      { label: "Profile", url: "https://github.com/Acidburn0x90", icon: "external" }
    ]
  }
];

// Export to window object for browser access
if (typeof window !== 'undefined') {
  window.PROJECTS = PROJECTS;
}
