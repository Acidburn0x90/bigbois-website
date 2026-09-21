/**
 * =============================================================================
 * BIGBOIS HUB - PROJECTS & LAB DIRECTORY
 * =============================================================================
 * 
 * ZERO FRONT-END KNOWLEDGE NEEDED TO EDIT!
 * 
 * To add a new project, experiment, or server link:
 * 1. Copy any block between the curly braces { ... },
 * 2. Paste it in the PROJECTS list below.
 * 3. Update title, description, tags, and link url.
 * 4. Commit and push. The website will automatically update!
 * 
 * Categories available:
 *   - "infra"        -> Servers & Homelab
 *   - "systems"      -> Code & Game Tinkering
 *   - "security"     -> Security & Tools
 *   - "simulations"  -> Math & Physics Experiments
 * =============================================================================
 */

const PROJECTS = [
  {
    id: "minecraft-crossplay",
    title: "BigBois Minecraft Server",
    category: "infra",
    categoryLabel: "Homelab",
    icon: "⛏️",
    description: "Self-hosted Paper crossplay server for friends. Running on a dedicated Arch Linux laptop using Crafty Controller, GeyserMC, and Floodgate for Java/Bedrock co-play.",
    tags: ["Paper 1.21", "Geyser", "Arch Linux", "Homelab"],
    links: [
      { label: "status", url: "#status-section" },
      { label: "github", url: "https://github.com/Acidburn0x90/bigbois-website" }
    ]
  },
  {
    id: "echos-of-sylvaris",
    title: "Echos of Sylvaris (MUD)",
    category: "systems",
    categoryLabel: "Games",
    icon: "⚔️",
    description: "Toy text-based MMORPG (MUD) in Java. Built to learn raw TCP socket networking, telnet protocol handling, concurrency, and persistent entity states.",
    tags: ["Java", "Sockets", "MUD", "Learning"],
    links: [
      { label: "github", url: "https://github.com/Acidburn0x90/Echos-Of-Sylvaris" }
    ]
  },
  {
    id: "game-of-life",
    title: "Game of Life",
    category: "simulations",
    categoryLabel: "Experiments",
    icon: "🧬",
    description: "Classic Conway's Game of Life cellular automata simulator. Written in Java to practice grid state buffers, step loops, and pattern visualization.",
    tags: ["Java", "Algorithms", "Simulation"],
    links: [
      { label: "github", url: "https://github.com/Acidburn0x90/GameOfLife" }
    ]
  },
  {
    id: "chaoslite",
    title: "ChaosLite Recon Suite",
    category: "security",
    categoryLabel: "Security",
    icon: "🛡️",
    description: "Personal red-team toolchain and recon framework. Experiments in orchestrating nmap scanning, bash tools, and local LLM task routing.",
    tags: ["Python", "Nmap", "Security", "Automation"],
    links: [
      { label: "profile", url: "https://github.com/Acidburn0x90" }
    ]
  },
  {
    id: "cas-engine",
    title: "Computer Algebra System",
    category: "simulations",
    categoryLabel: "Math",
    icon: "📐",
    description: "Amateur symbolic math parser in Java. Toy AST tree-walker built to test symbolic expression differentiation and basic algebra simplification.",
    tags: ["Java", "Math", "AST", "Parser"],
    links: [
      { label: "github", url: "https://github.com/Acidburn0x90/CAS" }
    ]
  },
  {
    id: "autodiff-dual-numbers",
    title: "Auto-Diff with Dual Numbers",
    category: "simulations",
    categoryLabel: "Math",
    icon: "📈",
    description: "Forward-mode automatic differentiation implemented via dual number arithmetic. A small math exploration into computing exact derivatives without symbolic expansion.",
    tags: ["Algorithms", "Math", "Dual Numbers"],
    links: [
      { label: "github", url: "https://github.com/Acidburn0x90/Automatic-Differentiation-with-Dual-Numbers" }
    ]
  },
  {
    id: "network-mapping",
    title: "Network Topology Mapper",
    category: "security",
    categoryLabel: "Tools",
    icon: "🌐",
    description: "Python scripts that run automated subnet sweeps via nmap, profile live listening hosts, and output network topology graphs using Graphviz.",
    tags: ["Python", "Nmap", "Graphviz", "Network"],
    links: [
      { label: "profile", url: "https://github.com/Acidburn0x90" }
    ]
  },
  {
    id: "physics-sim",
    title: "Physics & Orbit Simulators",
    category: "simulations",
    categoryLabel: "Experiments",
    icon: "🪐",
    description: "Python numerical scripts for plotting chaotic systems (Lorenz strange attractors) and basic 2D gravitational n-body orbits with SciPy/Matplotlib.",
    tags: ["Python", "SciPy", "Physics", "Plots"],
    links: [
      { label: "profile", url: "https://github.com/Acidburn0x90" }
    ]
  },
  {
    id: "flipper-irdb",
    title: "Flipper Zero IR Database",
    category: "security",
    categoryLabel: "Hardware",
    icon: "📻",
    description: "Curated collection and forks of IR signal dictionaries and remotes for hardware testing on the Flipper Zero.",
    tags: ["Flipper Zero", "IR", "Hardware", "Fork"],
    links: [
      { label: "github", url: "https://github.com/Acidburn0x90/Flipper-IRDB" }
    ]
  },
  {
    id: "slime-rancher-mods",
    title: "Slime Rancher Modding",
    category: "systems",
    categoryLabel: "Modding",
    icon: "🧪",
    description: "Experiments in C#/.NET game modding and Unity reverse engineering. Messing with IL patching and custom slime behaviors for fun.",
    tags: ["C#", ".NET", "Unity", "Modding"],
    links: [
      { label: "profile", url: "https://github.com/Acidburn0x90" }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.PROJECTS = PROJECTS;
}
