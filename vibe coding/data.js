/**
 * ====================================================================
 * MATRIX DEVELOPER TERMINAL - PROFILE DATA CONFIGURATION
 * ====================================================================
 * Single source of truth for all personal information, portfolio content,
 * interactive commands, and system responses. Modify this file to update
 * your portfolio without touching the core UI engine.
 */

const PROFILE_DATA = {
  // Identity & Core Information
  identity: {
    name: "Ojas Sahu",
    handle: "ojas_sahu",
    role: "B.Tech CSE Student & Full-Stack Developer",
    education: "B.Tech in Computer Science & Engineering (Core)",
    institution: "Tech University // 2026 Batch",
    location: "India [Node: 20.5937° N, 78.9629° E]",
    status: "ONLINE // COMPILING FUTURE",
    tagline: "Building things that probably shouldn't work... but do.",
    bio: "First-year B.Tech CSE Core student obsessed with high-performance web systems, modern frontends, AI tooling, and interactive terminal interfaces. Passionate about turning complex logic into sleek, responsive digital experiences.",
    availability: "Available for Internships, Hackathons & Open Source Collaborations",
    systemUptime: "99.98% [Neural Link Stable]"
  },

  // Developer Focus & Interests
  interests: [
    "Full-Stack Web Engineering",
    "Futuristic / Creative Frontend UIs",
    "AI Integration & Autonomous Workflows",
    "Algorithms & Problem Solving",
    "Systems Programming & Linux / CLI Tooling"
  ],

  // Skills Breakdown with Hacker / Terminal Status
  skills: [
    { category: "Languages", items: [
      { name: "Java", level: 88, status: "COMPILED", desc: "Core OOP, Collections, Multithreading" },
      { name: "JavaScript (ESNext)", level: 92, status: "OPTIMIZED", desc: "Async/Await, DOM, Canvas, Modern Web APIs" },
      { name: "TypeScript", level: 80, status: "TYPED", desc: "Strict type systems, Interfaces, Generics" },
      { name: "Python", level: 82, status: "EXECUTED", desc: "Automation, Scripting, AI/ML APIs" },
      { name: "C / C++", level: 78, status: "LOADED", desc: "Memory models, Data Structures, Algorithms" }
    ]},
    { category: "Web & Frontend", items: [
      { name: "React.js", level: 86, status: "MOUNTED", desc: "Hooks, State Management, Component Architecture" },
      { name: "HTML5 / Canvas API", level: 96, status: "RENDERED", desc: "Semantic markup, Game loops, Particle systems" },
      { name: "CSS3 / Modern Layouts", level: 94, status: "STYLED", desc: "Flexbox, CSS Grid, Glassmorphism, Animations" },
      { name: "Tailwind CSS", level: 90, status: "COMPILED", desc: "Utility-first rapid prototyping & custom themes" }
    ]},
    { category: "Backend & Systems", items: [
      { name: "Node.js / Express", level: 84, status: "LISTENING", desc: "REST APIs, Middleware, WebSockets" },
      { name: "Git & GitHub", level: 90, status: "COMMITTED", desc: "Branching workflows, CI/CD actions, Open source" },
      { name: "REST APIs & JSON", level: 92, status: "CONNECTED", desc: "API design, Data pipelines, Fetch/Axios" },
      { name: "Linux / Bash Shell", level: 82, status: "ROOT", desc: "Shell scripting, Package management, CLI pipelines" }
    ]},
    { category: "AI & Emerging Tech", items: [
      { name: "Generative AI APIs", level: 86, status: "PROMPTED", desc: "Gemini API, OpenAI SDK, Function Calling" },
      { name: "Vibe Coding & Agentic AI", level: 94, status: "OVERCLOCKED", desc: "AI-assisted rapid software engineering" }
    ]}
  ],

  // Real & Futuristic Featured Projects
  projects: [
    {
      id: "proj_01",
      slug: "matrix-terminal",
      name: "CyberDeck Terminal Portfolio",
      category: "Interactive Web / Cyberpunk",
      status: "ACTIVE_NODE",
      date: "2026",
      tagline: "Futuristic Matrix-themed developer portfolio and interactive shell.",
      description: "A responsive, high-performance web terminal built with HTML5 Canvas digital rain, Web Audio API mechanical sound synthesis, full-featured CLI shell, and tactile hacker UX.",
      techStack: ["Vanilla JavaScript", "HTML5 Canvas", "Web Audio API", "CSS Grid/Flexbox"],
      highlights: [
        "Dynamic multi-opacity Matrix digital rain with speed variance",
        "Command terminal with history navigation & tab autocomplete",
        "Interactive easter eggs, diagnostic monitors & zero dependencies"
      ],
      links: {
        demo: "#",
        github: "https://github.com/ojassahu"
      }
    },
    {
      id: "proj_02",
      slug: "piko-assistant",
      name: "Piko: Context-Aware Dev Assistant",
      category: "AI & Developer Tools",
      status: "STABLE",
      date: "2026",
      tagline: "Lightweight context-aware agent for terminal workflows and local debugging.",
      description: "An AI-powered developer CLI companion that understands local project trees, summarizes stack traces, and suggests instant git commits and bug fixes using multimodal LLMs.",
      techStack: ["Node.js", "Gemini API", "Bash", "CLI Tooling"],
      highlights: [
        "Sub-second error diagnosis with contextual stack inspection",
        "Natural language to shell command generation with dry-run safety",
        "Configurable persona presets for code reviews and refactoring"
      ],
      links: {
        demo: "#",
        github: "https://github.com/ojassahu"
      }
    },
    {
      id: "proj_03",
      slug: "pulse-gym-portal",
      name: "TitanFit / Modern Fitness Platform",
      category: "Full-Stack Web Application",
      status: "DEPLOYED",
      date: "2026",
      tagline: "Responsive athletic training hub with dynamic program filters and booking modals.",
      description: "A dark-themed, mobile-first responsive gym portal featuring interactive pricing toggles, lightbox image gallery, live workout program filters, and animated membership stats.",
      techStack: ["HTML5", "CSS3 Modern Grid", "JavaScript ES6", "Vercel"],
      highlights: [
        "Bespoke dark cyberpunk/athletic visual identity",
        "100% responsive fluid layout without horizontal clipping",
        "Interactive booking dialog and dynamic membership calculations"
      ],
      links: {
        demo: "https://tj-task-2026-ojas-sahu.vercel.app/",
        github: "https://github.com/ojassahu"
      }
    },
    {
      id: "proj_04",
      slug: "neural-canvas",
      name: "NeuralFlow: Algorithmic Visualizer",
      category: "Creative Coding & Visuals",
      status: "IN_DEVELOPMENT",
      date: "2026",
      tagline: "Interactive 2D physics and graph traversal particle simulator.",
      description: "Real-time interactive particle network and pathfinding visualization engine exploring Dijkstra, A*, and BFS algorithms with real-time obstacle editing and velocity damping.",
      techStack: ["JavaScript Canvas", "Algorithms", "Vector Math", "CSS Custom Props"],
      highlights: [
        "60 FPS smooth rendering on mobile and desktop viewports",
        "Real-time weight manipulation and graph generation",
        "Interactive sound fx and trace recording"
      ],
      links: {
        demo: "#",
        github: "https://github.com/ojassahu"
      }
    }
  ],

  // System Diagnostics Telemetry
  diagnostics: {
    brain: "12% [Running on caffeine reserves]",
    ram: "98.4% [Somehow completely full of tabs]",
    coffeeLevel: "CRITICAL [Replenishment required immediately]",
    bugs: "∞ [Squashing 3 creates 7 more in another dimension]",
    keyboardWPM: "88 WPM [Mechanical Blue Switches]",
    gitCommits: "340+ this cycle",
    coreTemperature: "38°C [Cooling Fans Running]",
    threatLevel: "ZERO [Firewall secure against Agent Smith]"
  },

  // Contact Links & Handles
  contact: {
    github: "https://github.com/ojassahu",
    linkedin: "https://linkedin.com/in/ojassahu",
    email: "mailto:ojas.sahu.dev@gmail.com",
    portfolio: "https://tj-task-2026-ojas-sahu.vercel.app/",
    terminalChannel: "IRC #ojas-matrix // Port 1337"
  },

  // Developer Quotes Generator
  quotes: [
    { text: "There are two ways to write error-free programs; only the third works.", author: "Alan J. Perlis" },
    { text: "It works on my machine... which is why we are shipping my machine to production.", author: "Anonymous DevOps" },
    { text: "Building things that probably shouldn't work... but do.", author: "Ojas Sahu" },
    { text: "The Matrix cannot tell you who you are. You must write the code yourself.", author: "Morpheus (Adapted)" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { text: "Experience is what you get when you didn't get what you wanted... usually a Segmentation Fault.", author: "Hacker's Almanac" },
    { text: "There is no spoon. Just a dangling pointer.", author: "Neo" }
  ],

  // Virtual Filesystem for `ls` and `cat` commands
  virtualFiles: {
    "about.txt": `=== OPERATOR PROFILE: OJAS SAHU ===
Role: B.Tech CSE Student & Full-Stack Developer
Location: India
Mission: Crafting exceptional digital software and next-gen developer tools.
Philosophy: Clean code, fast loads, and unapologetically bold aesthetics.`,
    
    "skills.json": `{
  "primary": ["Java", "JavaScript", "React", "HTML5", "CSS3"],
  "systems": ["Node.js", "Git", "Linux", "REST APIs"],
  "interests": ["Agentic AI", "Algorithms", "UI/UX Architecture"]
}`,

    "projects.md": `# Featured Deployments
1. CyberDeck Terminal Portfolio - Futuristic Matrix Interface
2. Piko - Context-Aware Dev Assistant (AI + CLI)
3. TitanFit - Modern High-Energy Athletics Platform
4. NeuralFlow - Interactive Algorithmic Visualizer`,

    "hire_ojas.exe": `[EXECUTABLE BINARY DETECTED]
Output: Candidate Ojas Sahu is highly motivated, learns fast, and ships clean code.
Action: Send an email to ojas.sahu.dev@gmail.com to initiate protocol!`,

    "secret_flag.dat": `FLAG{NEO_FOLLOWS_THE_WHITE_RABBIT_2026}
Congratulations, Operator. You found the hidden filesystem artifact.
Try typing 'matrix' or 'hack' for more classified protocols.`
  }
};

// Freeze object to avoid accidental runtime mutation
if (typeof Object.freeze === 'function') {
  Object.freeze(PROFILE_DATA);
}

