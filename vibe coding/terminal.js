/**
 * ====================================================================
 * MATRIX COMMAND TERMINAL & SHELL ENGINE
 * ====================================================================
 * Manages interactive command input, execution history, auto-completion,
 * formatted ASCII outputs, sound cues, and humorous developer responses.
 */

class CommandTerminal {
  constructor(containerId = "terminal-output", inputId = "terminal-cli-input") {
    this.outputContainer = document.getElementById(containerId);
    this.inputElement = document.getElementById(inputId);
    this.commandHistory = [];
    this.historyIndex = -1;
    this.clickCount = 0;
    this.isExecuting = false;
    this.context = "identity";

    // Available commands for auto-complete and dispatch
    this.commands = [
      "help",
      "about",
      "skills",
      "projects",
      "project",
      "contact",
      "matrix",
      "cyber",
      "terminal",
      "minimal",
      "void",
      "calculator",
      "diagnostics",
      "status",
      "scan",
      "mode",
      "sudo",
      "whoami",
      "github",
      "neofetch",
      "clear",
      "coffee",
      "hack",
      "diagnostic",
      "quote",
      "theme",
      "ls",
      "cat",
      "date",
      "audio"
    ];

    this.init();
  }

  init() {
    if (!this.inputElement) return;

    // Bind terminal input events
    this.inputElement.addEventListener("keydown", (e) => this.handleKeyDown(e));
    this.inputElement.addEventListener("input", () => {
      terminalAudio.playKeyClick();
    });

    // Keep focus inside terminal when clicking inside terminal frame
    const terminalWindow = document.getElementById("terminal-main-window");
    if (terminalWindow) {
      terminalWindow.addEventListener("click", (e) => {
        this.clickCount++;
        this.checkClickEasterEgg();

        // Focus input unless user selected text or clicked an interactive button/link
        if (!["BUTTON", "A", "INPUT"].includes(e.target.tagName)) {
          this.inputElement.focus();
        }
      });
    }

    // Display initial boot banner in terminal output
    this.printWelcomeBanner();
  }

  setContext(module) {
    this.context = module || "identity";
    const prompt = document.getElementById("terminal-prompt-label");
    if (prompt) prompt.textContent = `${this.context}@ojas-os:~$`;
  }

  getPrompt() {
    return `${this.context}@ojas-os:~$`;
  }

  handleKeyDown(e) {
    if (this.isExecuting) {
      e.preventDefault();
      return;
    }

    // Handle Enter (Execute Command)
    if (e.key === "Enter") {
      e.preventDefault();
      const rawInput = this.inputElement.value.trim();
      if (!rawInput) return;

      terminalAudio.playEnter();
      this.commandHistory.push(rawInput);
      this.historyIndex = this.commandHistory.length;
      this.inputElement.value = "";

      this.executeCommand(rawInput);
      return;
    }

    // Handle Arrow Up (History Previous)
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (this.commandHistory.length === 0) return;
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.inputElement.value = this.commandHistory[this.historyIndex];
      }
      return;
    }

    // Handle Arrow Down (History Next)
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.inputElement.value = this.commandHistory[this.historyIndex];
      } else {
        this.historyIndex = this.commandHistory.length;
        this.inputElement.value = "";
      }
      return;
    }

    // Handle Tab (Auto-complete)
    if (e.key === "Tab") {
      e.preventDefault();
      const current = this.inputElement.value.trim().toLowerCase();
      if (!current) return;

      const matches = this.commands.filter((cmd) => cmd.startsWith(current));
      if (matches.length === 1) {
        this.inputElement.value = matches[0];
        terminalAudio.playKeyClick();
      } else if (matches.length > 1) {
        this.printLine(`> Available: ${matches.join("  ")}`, "text-dim");
      }
      return;
    }
  }

  executeCommand(commandLine) {
    const parts = commandLine.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Print command line prompt
    this.printLine(`${this.getPrompt()} ${commandLine}`, "text-prompt");

    switch (cmd) {
      case "help":
        this.cmdHelp();
        break;
      case "about":
        this.cmdAbout();
        this.openModule("profile");
        break;
      case "skills":
        this.cmdSkills();
        this.openModule("skills");
        break;
      case "projects":
      case "project":
        this.cmdProjects(args);
        if (cmd === "projects" && args.length === 0) this.openModule("projects");
        break;
      case "contact":
        this.cmdContact();
        this.openModule("contact");
        break;
      case "matrix":
        this.cmdMatrix();
        break;
      case "cyber":
      case "terminal":
      case "minimal":
      case "void":
        this.cmdMode(cmd);
        break;
      case "mode":
        this.cmdMode(args[0]);
        break;
      case "calculator":
      case "diagnostics":
        this.openModule(cmd === "diagnostics" ? "diagnostics" : cmd);
        break;
      case "status":
        this.cmdStatus();
        break;
      case "scan":
        this.cmdScan();
        break;
      case "sudo":
        this.cmdSudo(args.join(" "));
        break;
      case "whoami":
        this.cmdWhoami();
        break;
      case "github":
        this.cmdGithub();
        break;
      case "neofetch":
        if (window.ojasOS?.showNeofetch) window.ojasOS.showNeofetch();
        else this.cmdAbout();
        break;
      case "clear":
      case "cls":
        this.cmdClear();
        break;
      case "coffee":
        this.cmdCoffee();
        break;
      case "hack":
        this.cmdHack();
        break;
      case "diagnostic":
      case "diag":
        this.cmdDiagnostic();
        break;
      case "quote":
        this.cmdQuote();
        break;
      case "theme":
        this.cmdTheme(args[0]);
        break;
      case "ls":
        this.cmdLs();
        break;
      case "cat":
        this.cmdCat(args[0]);
        break;
      case "date":
        this.cmdDate();
        break;
      case "audio":
        this.cmdAudio(args[0]);
        break;
      case "exit":
        this.cmdExit();
        break;
      default:
        this.cmdUnknown(commandLine);
        break;
    }

    this.scrollToBottom();
  }

  // ================= COMMAND HANDLERS ================= //

  cmdHelp() {
    const helpText = `
┌─────────────────────────────────────────────────────────────────┐
│                    MATRIX COMMAND DIRECTORY                     │
├─────────────────────────────────────────────────────────────────┤
│ CORE SYSTEM:                                                    │
│   about        - View developer profile, background & bio       │
│   skills       - Inspect technical skill matrix & status tags   │
│   projects     - List projects; use --search &lt;term&gt; to filter │
│   calculator   - Open the scientific calculator module         │
│   diagnostics  - Open simulated profile telemetry               │
│   status       - Show active module and environment              │
│   scan         - Run the visual system integrity scan             │
│   contact      - Display uplink channels, GitHub, and email     │
│   whoami       - Query active operator identity                 │
│   github       - Open the developer's GitHub profile            │
│   neofetch     - Display the OJAS.OS system profile              │
│                                                                 │
│ INTERACTIVE HACKS & SIMULATIONS:                                │
│   matrix       - Activate Matrix mode and rain overdrive         │
│   cyber        - Switch to Cyber environment                     │
│   minimal      - Switch to Minimal environment                   │
│   void         - Switch to Void environment                      │
│   mode &lt;name&gt; - Select matrix, cyber, terminal, minimal, void │
│   hack         - Execute Hollywood-style mainframe attack       │
│   coffee       - Brew emergency developer espresso [ASCII art]  │
│   diagnostic   - Show simulated profile telemetry                │
│   quote        - Generate wise words from the coding universe   │
│   sudo <cmd>   - Attempt root access escalation                 │
│                                                                 │
│ UTILITIES:                                                      │
│   ls           - List virtual filesystem artifacts              │
│   cat <file>   - Read virtual files (e.g., cat secret_flag.dat) │
│   theme <name> - Switch theme (green, amber, cyan, red)         │
│   audio <on|off> - Toggle tactile retro sound effects           │
│   date         - Show matrix spacetime coordinates              │
│   clear        - Flush terminal buffer                          │
└─────────────────────────────────────────────────────────────────┘
<span class="text-dim">Tip: Use [TAB] for autocomplete, [UP/DOWN] for history.</span>`;
    this.printRaw(helpText);
  }

  cmdAbout() {
    const id = PROFILE_DATA.identity;
    const aboutHTML = `
<div class="terminal-block">
  <span class="text-bright font-bold">[OPERATOR IDENTIFICATION: ${id.name.toUpperCase()}]</span>
  <br>Role:        ${id.role}
  <br>Education:   ${id.education}
  <br>Status:      <span class="text-glow">${id.status}</span>
  <br>Location:    ${id.location}
  <br>Tagline:     <span class="text-bright">"${id.tagline}"</span>
  <br><br>
  <span class="text-dim">BIO DATA:</span>
  <br>${id.bio}
  <br><br>
  <span class="text-dim">AVAILABILITY:</span>
  <br>${id.availability}
</div>`;
    this.printRaw(aboutHTML);
  }

  cmdSkills() {
    let out = `<div class="terminal-block"><span class="text-bright font-bold">=== LOADED MODULES & CAPABILITY MATRIX ===</span><br><br>`;
    PROFILE_DATA.skills.forEach((group) => {
      out += `<span class="text-accent underline font-bold">${group.category.toUpperCase()}</span><br>`;
      group.items.forEach((skill) => {
        const barLength = 12;
        const filled = Math.round((skill.level / 100) * barLength);
        const bar = "█".repeat(filled) + "░".repeat(barLength - filled);
        out += `<span class="text-bright">[OK]</span> <span class="font-bold">${skill.name.padEnd(18)}</span> <span class="text-dim">[${bar}]</span> <span class="text-accent font-bold">${skill.level}%</span> <span class="badge">[${skill.status}]</span> <span class="text-dim">${skill.desc}</span><br>`;
      });
      out += `<br>`;
    });
    out += `</div>`;
    this.printRaw(out);
  }

  cmdProjects(args) {
    const option = args?.[0]?.toLowerCase();
    if (option === "--search" || option === "search") {
      const query = args.slice(1).join(" ").trim().toLowerCase();
      if (!query) {
        this.printLine("Usage: projects --search <name | technology | category>", "text-dim");
        return;
      }
      const matches = PROFILE_DATA.projects.filter((project) => {
        const searchable = [project.name, project.category, project.description, ...project.techStack].join(" ").toLowerCase();
        return searchable.includes(query);
      });
      if (!matches.length) {
        this.printLine(`No projects matched "${args.slice(1).join(" ")}".`, "text-dim");
        return;
      }
      this.printLine(`PROJECT SEARCH // ${matches.length} MATCH${matches.length === 1 ? "" : "ES"}`, "text-bright font-bold");
      matches.forEach((project) => this.printLine(`${project.name} · ${project.category} · ${project.techStack.join(", ")}`, "text-glow"));
      return;
    }

    if (option === "--list" || option === "list") args = [];

    if (args && args.length > 0) {
      const query = args[0].toLowerCase();
      const proj = PROFILE_DATA.projects.find(
        (p, idx) => p.slug.includes(query) || (idx + 1).toString() === query || p.name.toLowerCase().includes(query)
      );
      if (proj) {
        let out = `
<div class="terminal-block project-card">
  <span class="text-bright font-bold">${proj.name.toUpperCase()}</span> [${proj.status}]
  <br>Category:    ${proj.category} (${proj.date})
  <br>Tagline:     ${proj.tagline}
  <br>Description: ${proj.description}
  <br><br>
  <span class="text-dim">TECH STACK:</span> ${proj.techStack.join(" • ")}
  <br><br>
  <span class="text-dim">HIGHLIGHTS:</span>
  ${proj.highlights.map(h => `<br> • ${h}`).join("")}
  <br><br>
  ${proj.links.demo !== "#" ? `<a href="${proj.links.demo}" target="_blank" rel="noopener" class="terminal-link">[LAUNCH LIVE DEMO]</a>  ` : ""}
  <a href="${proj.links.github}" target="_blank" rel="noopener" class="terminal-link">[VIEW GITHUB REPO]</a>
</div>`;
        this.printRaw(out);
        return;
      }
    }

    let out = `<div class="terminal-block"><span class="text-bright font-bold">=== PRODUCTION REPOSITORIES & DEPLOYMENTS ===</span><br><span class="text-dim">Type 'projects &lt;id&gt;' (e.g., 'projects 1') for full blueprint specs.</span><br><br>`;

    PROFILE_DATA.projects.forEach((proj, idx) => {
      out += `
<div class="terminal-project-entry">
  <span class="text-accent font-bold">PROJECT_0${idx + 1}</span>
  <br>─────────────────────────────────────────────────────
  <br>NAME:     <span class="text-bright font-bold">${proj.name}</span>
  <br>TYPE:     ${proj.category}
  <br>STATUS:   <span class="badge">[${proj.status}]</span>
  <br>TECH:     ${proj.techStack.join(", ")}
  <br>INFO:     ${proj.tagline}
  <br><span class="text-dim">> LINKS:</span> ${proj.links.demo !== "#" ? `<a href="${proj.links.demo}" target="_blank" rel="noopener" class="terminal-link">[LIVE DEMO]</a> ` : ""}<a href="${proj.links.github}" target="_blank" rel="noopener" class="terminal-link">[GITHUB]</a>
</div><br>`;
    });

    out += `</div>`;
    this.printRaw(out);
  }

  cmdContact() {
    const c = PROFILE_DATA.contact;
    const html = `
<div class="terminal-block">
  <span class="text-bright font-bold">=== QUANTUM UPLINK & TRANSMISSION CHANNELS ===</span>
  <br><br>
  <span class="text-dim">[EMAIL]</span>    <a href="${c.email}" class="terminal-link">${c.email.replace('mailto:', '')}</a>
  <br><span class="text-dim">[GITHUB]</span>   <a href="${c.github}" target="_blank" rel="noopener" class="terminal-link">${c.github}</a>
  <br><span class="text-dim">[LINKEDIN]</span> <a href="${c.linkedin}" target="_blank" rel="noopener" class="terminal-link">${c.linkedin}</a>
  <br><span class="text-dim">[PORTFOLIO]</span><a href="${c.portfolio}" target="_blank" rel="noopener" class="terminal-link">${c.portfolio}</a>
  <br><span class="text-dim">[NODE]</span>     ${c.terminalChannel}
  <br><br>
  <span class="text-glow">Status: Ready for incoming handshake transmissions.</span>
</div>`;
    this.printRaw(html);
  }

  cmdMatrix() {
    window.ojasOS?.setMode?.("matrix");
    terminalAudio.playMatrixWarp();
    if (matrixEngine) {
      matrixEngine.triggerOverdrive(8000);
    }
    this.triggerScreenDistortion();

    const text = `
<div class="text-glow font-bold">
[ALERT] MATRIX STREAM OVERDRIVE ENGAGED!
Speed boosted by 300%. Character decay threshold randomized.
"You take the red pill, you stay in Wonderland, and I show you how deep the rabbit hole goes."
</div>`;
    this.printRaw(text);
  }

  cmdMode(mode) {
    const selected = String(mode || "").toLowerCase();
    const supportedModes = ["matrix", "cyber", "terminal", "minimal", "void"];
    if (!supportedModes.includes(selected)) {
      this.printLine(`Usage: mode <${supportedModes.join(" | ")}>`, "text-dim");
      return;
    }
    if (selected === "matrix") {
      this.cmdMatrix();
      return;
    }
    window.ojasOS?.setMode?.(selected);
    this.printLine(`${selected.toUpperCase()} ENVIRONMENT ACTIVE.`, "text-glow");
  }

  openModule(module) {
    if (window.ojasOS?.openModule) {
      window.ojasOS.openModule(module);
      this.printLine(`${module.toUpperCase()} MODULE OPENED.`, "text-glow");
      return;
    }
    this.printLine(`Module unavailable: ${module}`, "text-dim");
  }

  cmdStatus() {
    const mode = localStorage.getItem("ojas_os_mode") || "matrix";
    const module = window.ojasOS?.modules?.[window.ojasOS?.activeModule] || "IDENTITY_CORE";
    this.printLine(`SYSTEM: ONLINE · MODE: ${mode.toUpperCase()} · MODULE: ${module}`, "text-glow");
  }

  cmdScan() {
    if (window.ojasOS?.runScan) {
      window.ojasOS.runScan();
      this.printLine("VISUAL SCAN EFFECT COMPLETE · SIMULATION ONLY", "text-glow");
      return;
    }
    this.printLine("System scan unavailable.", "text-dim");
  }

  cmdSudo(args) {
    terminalAudio.playError();
    if (args && args.toLowerCase().includes("hire-me")) {
      const response = `
<div class="terminal-block">
  <span class="text-bright font-bold">Nice try.</span>
  <br><br>
  Root access requires:
  <br>1. Skills
  <br>2. Projects
  <br>3. Coffee
  <br>4. Surviving production bugs
  <br><br>
  <span class="text-glow font-bold">[CHECKING APPLICANT TELEMETRY...]</span>
  <br>Skills:   <span class="text-bright">[VERIFIED: Java, JS, React, AI, Systems]</span>
  <br>Projects: <span class="text-bright">[VERIFIED: Deployed & Active]</span>
  <br>Work Ethic: <span class="text-bright">[VERIFIED: 100% Passion & Curiosity]</span>
  <br><br>
  <span class="text-accent font-bold">ACCESS OVERRIDE GRANTED!</span>
  <br>Click to dispatch interview offer: <a href="mailto:ojas.sahu.dev@gmail.com?subject=Interview%20Offer%20//%20Fresher%20Interview%202026" class="terminal-link font-bold">[SEND UPLINK INVITATION]</a>
</div>`;
      this.printRaw(response);
      terminalAudio.playAccessGranted();
      return;
    }

    const output = `
<div class="text-dim">
guest is not in the sudoers file.
This incident will be reported to Agent Smith.
</div>`;
    this.printRaw(output);
  }

  cmdWhoami() {
    const text = `
<div class="terminal-block">
  <span class="text-bright font-bold">Ojas Sahu</span>
  <br>Developer
  <br>Human... probably.
  <br><span class="text-dim">Coordinates: India (20.59° N, 78.96° E)</span>
  <br><span class="text-glow">Access Clearance: OPERATOR / LEVEL-7</span>
</div>`;
    this.printRaw(text);
  }

  cmdGithub() {
    const url = PROFILE_DATA.contact.github;
    this.printRaw(`<a class="terminal-link" href="${url}" target="_blank" rel="noopener">[OPEN GITHUB PROFILE] ${url}</a>`);
  }

  cmdClear() {
    if (this.outputContainer) {
      this.outputContainer.innerHTML = "";
    }
  }

  cmdCoffee() {
    terminalAudio.playDataStream();
    const asciiCoffee = `
<pre class="ascii-art">
      (  (
       )  )
    .--------.
    |        |]
    \\        /
     \`------'
</pre>
<div class="terminal-block">
  <span class="text-bright font-bold">STATUS: Freshly brewed Ethiopian Dark Roast [C8H10N4O2]</span>
  <br>Temperature: 85°C (Optimal)
  <br>Developer Caffeine Level: 100%
  <br>Code Output Capacity: +400%
  <br><span class="text-dim">"Programmer: A machine that turns caffeine into code."</span>
</div>`;
    this.printRaw(asciiCoffee);
  }

  cmdHack() {
    this.isExecuting = true;
    terminalAudio.playDataStream();

    this.printLine("[*] INITIATING BRUTE FORCE ON MAINFRAME...", "text-bright");

    const steps = [
      "[*] Bypassing quantum firewall layers 1 through 7...",
      "[*] Injecting malicious CSS into target server...",
      "[*] Cracking SHA-512 RSA security matrices... [████████░░] 80%",
      "[*] Overriding system kernel privileges...",
      "[!] ACCESS GRANTED. MAINFRAME PWNED!"
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        this.printLine(steps[currentStep], currentStep === steps.length - 1 ? "text-glow font-bold" : "text-dim");
        terminalAudio.playKeyClick();
        this.scrollToBottom();
        currentStep++;
      } else {
        clearInterval(interval);
        this.isExecuting = false;
        terminalAudio.playAccessGranted();
        this.printRaw(`
<div class="terminal-block">
  <span class="text-accent font-bold">LOOT ACQUIRED:</span>
  <br> • cat_memes_2026.tar.gz (1.2 GB)
  <br> • production_database_fixed_at_3am.sql (404 MB)
  <br> • secret_interview_shortlist.csv [ojas_sahu added to top]
  <br><br>
  <span class="text-dim">Welcome to the Matrix, Operator.</span>
</div>`);
        this.scrollToBottom();
      }
    }, 450);
  }

  cmdDiagnostic() {
    terminalAudio.playDataStream();
    const d = PROFILE_DATA.diagnostics;
    const report = `
<div class="terminal-block">
  <span class="text-bright font-bold">SIMULATED PROFILE TELEMETRY // NOT LIVE DEVICE METRICS</span>
  <br><br>
  Brain:       <span class="text-glow">${d.brain}</span>
  <br>RAM:         <span class="text-bright">${d.ram}</span>
  <br>Coffee:      <span class="text-accent font-bold">${d.coffeeLevel}</span>
  <br>Bugs:        <span class="text-glow font-bold">${d.bugs}</span>
  <br>Keyboard:    ${d.keyboardWPM}
  <br>Git Commits: ${d.gitCommits}
  <br>Core Temp:   ${d.coreTemperature}
  <br>Threat:      ${d.threatLevel}
</div>`;
    this.printRaw(report);
  }

  cmdQuote() {
    terminalAudio.playAccessGranted();
    const quotes = PROFILE_DATA.quotes;
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    const html = `
<div class="terminal-block">
  <span class="text-bright">"${q.text}"</span>
  <br><span class="text-dim">— ${q.author}</span>
</div>`;
    this.printRaw(html);
  }

  cmdTheme(themeName) {
    if (!themeName) {
      this.printLine("Usage: theme <green | amber | cyan | red>", "text-dim");
      return;
    }
    const themeMap = {
      green: "matrix-green",
      amber: "cyber-amber",
      cyan: "ghost-cyan",
      red: "blood-red"
    };

    const target = themeMap[themeName.toLowerCase()];
    if (target) {
      const modeByTheme = {
        "matrix-green": "matrix",
        "cyber-amber": "cyber",
        "ghost-cyan": "terminal",
        "blood-red": "void"
      };
      if (window.ojasOS?.setMode) {
        window.ojasOS.setMode(modeByTheme[target]);
        this.printLine(`Theme switched to: ${themeName.toUpperCase()}`, "text-glow");
        return;
      }
      document.body.classList.remove("matrix-green", "cyber-amber", "ghost-cyan", "blood-red");
      document.body.classList.add(target);
      if (matrixEngine) matrixEngine.setTheme(target);
      terminalAudio.playAccessGranted();
      this.printLine(`Theme switched to: ${themeName.toUpperCase()}`, "text-glow");
    } else {
      terminalAudio.playError();
      this.printLine(`Unknown theme '${themeName}'. Available: green, amber, cyan, red`, "text-dim");
    }
  }

  cmdLs() {
    const files = Object.keys(PROFILE_DATA.virtualFiles);
    let output = `<div class="terminal-block"><span class="text-dim">Directory: /matrix/root/ojas_sahu</span><br>`;
    files.forEach((f) => {
      const isExe = f.endsWith(".exe");
      output += `<span class="${isExe ? "text-accent font-bold" : "text-bright"}">${f}</span>  `;
    });
    output += `<br><span class="text-dim">Use 'cat &lt;filename&gt;' to read file contents.</span></div>`;
    this.printRaw(output);
  }

  cmdCat(fileName) {
    if (!fileName) {
      this.printLine("Usage: cat <filename>", "text-dim");
      return;
    }
    const content = PROFILE_DATA.virtualFiles[fileName];
    if (content) {
      terminalAudio.playKeyClick();
      this.printRaw(`<div class="terminal-block"><pre class="code-pre">${this.escapeHTML(content)}</pre></div>`);
    } else {
      terminalAudio.playError();
      this.printLine(`cat: ${fileName}: No such file or directory. Try 'ls'`, "text-dim");
    }
  }

  cmdDate() {
    const now = new Date();
    const utc = now.toUTCString();
    const matrixTime = (Date.now() / 1000).toFixed(0);
    this.printRaw(`
<div class="terminal-block">
  Earth UTC:    ${utc}
  <br>Matrix Epoch: ${matrixTime} [TICK]
  <br>Cycle Status: NOMINAL
</div>`);
  }

  cmdAudio(state) {
    if (state === "on") {
      terminalAudio.enabled = true;
      localStorage.setItem("matrix_terminal_audio", "true");
      terminalAudio.playAccessGranted();
      this.printLine("Audio synthesizer ONLINE.", "text-glow");
    } else if (state === "off") {
      terminalAudio.enabled = false;
      localStorage.setItem("matrix_terminal_audio", "false");
      this.printLine("Audio synthesizer MUTED.", "text-dim");
    } else {
      const current = terminalAudio.toggle();
      this.printLine(`Audio synthesizer is now: ${current ? "ONLINE" : "MUTED"}`, "text-glow");
    }
    // Update header toggle button state
    const btn = document.getElementById("audio-toggle-btn");
    if (btn) btn.textContent = terminalAudio.enabled ? "AUDIO: ON" : "AUDIO: OFF";
  }

  cmdExit() {
    this.printLine("There is no escape from the Matrix. Try closing the tab... if you dare.", "text-glow");
  }

  cmdUnknown(raw) {
    terminalAudio.playError();
    const safeRaw = this.escapeHTML(raw);
    const funnyErrors = [
      `ERROR 404:
Motivation package not found.

Try installing coffee instead.`,
      `SYNTAX_ERROR: Command '${safeRaw}' not found in Matrix neural registers.
Type 'help' for authorized protocols.`,
      `KERNEL PANIC: Thought process crashed at address 0xDEADBEEF.
Have you tried turning your brain off and on again?`
    ];

    const err = funnyErrors[Math.floor(Math.random() * funnyErrors.length)];
    this.printRaw(`<div class="terminal-error"><pre class="code-pre">${err}</pre></div>`);
  }

  // ================= UTILITY METHODS ================= //

  printLine(text, className = "") {
    if (!this.outputContainer) return;
    const div = document.createElement("div");
    if (className) div.className = className;
    div.textContent = text;
    this.outputContainer.appendChild(div);
  }

  printRaw(html) {
    if (!this.outputContainer) return;
    const div = document.createElement("div");
    div.innerHTML = html;
    this.outputContainer.appendChild(div);
  }

  printWelcomeBanner() {
    const banner = `
<pre class="ascii-banner">
███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗
██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
</pre>
<div class="text-bright font-bold">SYSTEM://OJAS-SAHU/NEURAL_SHELL [v2.6.0]</div>
<div class="text-dim">Interactive Matrix Developer Terminal • All protocols ready.</div>
<div class="text-dim">Type <span class="text-bright font-bold">'help'</span> to inspect available commands or click quick action buttons.</div>
<hr class="terminal-divider">`;
    this.printRaw(banner);
  }

  triggerScreenDistortion() {
    const container = document.getElementById("terminal-wrapper");
    if (container) {
      container.classList.add("glitch-active");
      setTimeout(() => container.classList.remove("glitch-active"), 1200);
    }
  }

  checkClickEasterEgg() {
    if (this.clickCount === 12) {
      terminalAudio.playMatrixWarp();
      this.printRaw(`
<div class="terminal-block text-glow font-bold">
[CLASSIFIED PROTOCOL TRIGGERED]
<br>THE SYSTEM HAS BEEN WATCHING YOU.
<br><br>
Just kidding.
<br><br>
It's JavaScript.
</div>`);
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    if (this.outputContainer) {
      this.outputContainer.scrollTop = this.outputContainer.scrollHeight;
    }
  }

  escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

