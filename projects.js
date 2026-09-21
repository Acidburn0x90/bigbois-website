/**
 * BIGBOIS HUB - DIRECTORY DATA (CHARCOAL MONOTONE)
 * To add a project, append a new object to PROJECTS below.
 */

const PROJECTS = [
  {
    id: "minecraft-crossplay",
    title: "BigBois Minecraft Server",
    category: "infra",
    categoryLabel: "Homelab",
    icon: "⛏️",
    description: "Paper 1.21.x crossplay server running on an old Arch laptop via Crafty and GeyserMC.",
    tags: ["Paper", "Geyser", "Arch Linux"],
    links: [
      { label: "Status", url: "#server-widget" },
      { label: "Repo", url: "https://github.com/Acidburn0x90/bigbois-website" }
    ]
  },
  {
    id: "echos-of-sylvaris",
    title: "Echos of Sylvaris",
    category: "systems",
    categoryLabel: "Games",
    icon: "⚔️",
    description: "Toy text MMORPG engine built in Java exploring raw TCP sockets and telnet concurrency.",
    tags: ["Java", "Sockets", "MUD"],
    links: [
      { label: "Repo", url: "https://github.com/Acidburn0x90/Echos-Of-Sylvaris" }
    ]
  },
  {
    id: "game-of-life",
    title: "Game of Life",
    category: "simulations",
    categoryLabel: "Simulation",
    icon: "🧬",
    description: "Conway's cellular automata engine in Java with custom grid step loops and patterns.",
    tags: ["Java", "Cellular Automata"],
    links: [
      { label: "Repo", url: "https://github.com/Acidburn0x90/GameOfLife" }
    ]
  },
  {
    id: "chaoslite",
    title: "ChaosLite Recon",
    category: "security",
    categoryLabel: "Security",
    icon: "🛡️",
    description: "Personal red-team toolchain chaining automated Nmap scans with local LLM agent loops.",
    tags: ["Python", "Nmap", "Security"],
    links: [
      { label: "Profile", url: "https://github.com/Acidburn0x90" }
    ]
  },
  {
    id: "cas-engine",
    title: "Computer Algebra System",
    category: "simulations",
    categoryLabel: "Math",
    icon: "📐",
    description: "Experimental AST expression tree-walker in Java testing symbolic differentiation.",
    tags: ["Java", "Math", "AST"],
    links: [
      { label: "Repo", url: "https://github.com/Acidburn0x90/CAS" }
    ]
  },
  {
    id: "autodiff-dual-numbers",
    title: "Dual Numbers Auto-Diff",
    category: "simulations",
    categoryLabel: "Math",
    icon: "📈",
    description: "Forward-mode automatic differentiation implemented via dual number arithmetic.",
    tags: ["Algorithms", "Math", "Dual Numbers"],
    links: [
      { label: "Repo", url: "https://github.com/Acidburn0x90/Automatic-Differentiation-with-Dual-Numbers" }
    ]
  },
  {
    id: "network-mapping",
    title: "Network Topology Mapper",
    category: "security",
    categoryLabel: "Tools",
    icon: "🌐",
    description: "Subnet port scanner and automated network topology visualizer built with Graphviz.",
    tags: ["Python", "Nmap", "Graphviz"],
    links: [
      { label: "Profile", url: "https://github.com/Acidburn0x90" }
    ]
  },
  {
    id: "physics-sim",
    title: "Physics & Orbital Sim",
    category: "simulations",
    categoryLabel: "Physics",
    icon: "🪐",
    description: "Numerical simulations for chaotic Lorenz attractors and 2D orbits using SciPy.",
    tags: ["Python", "SciPy", "Physics"],
    links: [
      { label: "Profile", url: "https://github.com/Acidburn0x90" }
    ]
  },
  {
    id: "flipper-irdb",
    title: "Flipper Zero IR DB",
    category: "security",
    categoryLabel: "Hardware",
    icon: "📻",
    description: "Curated collection and forks of IR remote captures for hardware testing.",
    tags: ["Flipper Zero", "IR", "Hardware"],
    links: [
      { label: "Repo", url: "https://github.com/Acidburn0x90/Flipper-IRDB" }
    ]
  },
  {
    id: "slime-rancher-mods",
    title: "Slime Rancher Mods",
    category: "systems",
    categoryLabel: "Modding",
    icon: "🧪",
    description: "Unity reverse engineering experiments in C# modifying game behaviors with Harmony.",
    tags: ["C#", ".NET", "Harmony"],
    links: [
      { label: "Profile", url: "https://github.com/Acidburn0x90" }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.PROJECTS = PROJECTS;
}
