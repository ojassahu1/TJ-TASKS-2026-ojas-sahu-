/**
 * ====================================================================
 * MATRIX PORTFOLIO - CORE APPLICATION & UI COORDINATOR
 * ====================================================================
 * Coordinates the boot sequence, tab switches, dynamic telemetries,
 * interactive action buttons, Konami code detection, and UI state.
 */

class MatrixApp {
  constructor() {
    this.terminal = null;
    this.currentTab = "profile";
    this.terminalReturnTab = "profile";
    this.bootComplete = false;
    this.konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a"
    ];
    this.konamiProgress = 0;
    this.globalClickCount = 0;
    this.modalReturnFocus = null;
    this.fullscreenReturnFocus = null;
    this.bootInterval = null;
    this.bootFinishTimer = null;
    this.bootSkipHandler = null;
    this.os = null;
    this._escapeHandler = (event) => this.handleEscape(event);
  }

  init() {
    // Initialize CLI terminal instance
    this.terminal = new CommandTerminal("terminal-output", "terminal-cli-input");

    // Bind UI Events
    this.bindTabNavigation();
    this.bindActionButtons();
    this.bindWindowControls();
    this.bindModalControls();
    this.bindEscapeHandling();
    this.bindEasterEggs();
    this.bindLiveTelemetry();
    this.renderDynamicContent();
    this.os = typeof OjasOS === "function" ? new OjasOS(this) : null;

    // Start boot sequence
    this.runBootSequence();
  }

  // ================= BOOT SEQUENCE ================= //

  runBootSequence() {
    const bootOverlay = document.getElementById("boot-overlay");
    const bootLog = document.getElementById("boot-log");
    const skipBtn = document.getElementById("skip-boot-btn");

    if (!bootOverlay || !bootLog) {
      this.finishBoot();
      return;
    }

    if (localStorage.getItem("ojas_os_booted") === "true") {
      bootOverlay.style.display = "none";
      this.bootComplete = true;
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bootLog.textContent = "SYSTEM READY. WELCOME, OJAS.";
      this.finishBoot();
      return;
    }

    const messages = [
      "[SYSTEM_INIT] BIOS v4.09.26 Quantum Core...",
      "[SYSTEM_INIT] Scanning RAM: 64TB High-Bandwidth Memory OK",
      "[SYSTEM_INIT] Synchronizing Matrix Neural Link at 20.59° N, 78.96° E...",
      "[SYSTEM_INIT] Loading Kernel Modules: [DOM] [CANVAS] [AUDIO_SYNTH] [VIBE_OS]...",
      "[SYSTEM_INIT] Decrypting Operator Profile: OJAS SAHU...",
      "[SYSTEM_INIT] Access Clearance: LEVEL-7 OPERATOR [CONFIRMED]",
      "> ACCESS GRANTED."
    ];

    let index = 0;
    this.bootInterval = setInterval(() => {
      if (index < messages.length) {
        const line = document.createElement("div");
        line.className = index === messages.length - 1 ? "boot-line highlight" : "boot-line";
        line.textContent = messages[index];
        bootLog.appendChild(line);
        terminalAudio.playKeyClick();
        index++;
      } else {
        clearInterval(this.bootInterval);
        this.bootFinishTimer = setTimeout(() => this.finishBoot(), 400);
      }
    }, 210);

    // Skip button. ESC is handled by the app-wide overlay controller.
    if (skipBtn && this.bootSkipHandler) {
      skipBtn.removeEventListener("click", this.bootSkipHandler);
    }
    this.bootSkipHandler = () => {
      clearInterval(this.bootInterval);
      clearTimeout(this.bootFinishTimer);
      this.finishBoot();
    };

    if (skipBtn) {
      skipBtn.addEventListener("click", this.bootSkipHandler);
      skipBtn.focus();
    }
  }

  finishBoot() {
    if (this.bootComplete) return;
    clearInterval(this.bootInterval);
    clearTimeout(this.bootFinishTimer);
    this.bootInterval = null;
    this.bootFinishTimer = null;
    this.bootComplete = true;
    localStorage.setItem("ojas_os_booted", "true");

    const bootOverlay = document.getElementById("boot-overlay");
    if (bootOverlay) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        bootOverlay.style.display = "none";
      } else {
        bootOverlay.style.opacity = "0";
        setTimeout(() => {
          bootOverlay.style.display = "none";
        }, 500);
      }
    }

    terminalAudio.playAccessGranted();

    document.querySelector(".nav-tab-btn[aria-selected='true']")?.focus();
  }

  restartBoot() {
    const bootOverlay = document.getElementById("boot-overlay");
    const bootLog = document.getElementById("boot-log");
    if (!bootOverlay || !bootLog) return;
    clearInterval(this.bootInterval);
    clearTimeout(this.bootFinishTimer);
    bootLog.innerHTML = "";
    bootOverlay.style.display = "flex";
    bootOverlay.style.opacity = "1";
    this.bootComplete = false;
    this.runBootSequence();
  }

  // ================= DYNAMIC CONTENT RENDERING ================= //

  renderDynamicContent() {
    this.renderProfileCard();
    this.renderSkillsPanel();
    this.renderProjectsPanel();
    this.renderDiagnosticsPanel();
    this.renderContactPanel();
  }

  renderProfileCard() {
    const id = PROFILE_DATA.identity;
    const nameEl = document.getElementById("profile-name");
    const roleEl = document.getElementById("profile-role");
    const taglineEl = document.getElementById("profile-tagline");
    const statusEl = document.getElementById("profile-status");
    const locationEl = document.getElementById("profile-location");
    const bioEl = document.getElementById("profile-bio");

    if (nameEl) nameEl.textContent = id.name.toUpperCase();
    if (roleEl) roleEl.textContent = `${id.role} | Builder`;
    if (taglineEl) taglineEl.textContent = `"${id.tagline}"`;
    if (statusEl) statusEl.textContent = id.status;
    if (locationEl) locationEl.textContent = id.location;
    if (bioEl) bioEl.textContent = id.bio;

    // Render developer interests tags
    const interestsContainer = document.getElementById("profile-interests");
    if (interestsContainer) {
      interestsContainer.innerHTML = PROFILE_DATA.interests
        .map((item) => `<span class="hacker-tag"><span class="tag-bullet">></span> ${item}</span>`)
        .join(" ");
    }
  }

  renderSkillsPanel() {
    const container = document.getElementById("skills-container");
    if (!container) return;

    let html = "";
    PROFILE_DATA.skills.forEach((category) => {
      html += `
<div class="skill-category-box">
  <div class="category-header">
    <span class="text-accent font-bold">> ${category.category.toUpperCase()}</span>
    <span class="text-dim text-xs">[STATUS: MOUNTED]</span>
  </div>
  <div class="category-grid">
    ${category.items
      .map(
        (s) => `
      <div class="skill-item-card">
        <div class="skill-item-title">
          <span class="skill-check">[OK]</span>
          <span class="skill-name font-bold">${s.name}</span>
          <span class="skill-badge">${s.status}</span>
        </div>
        <div class="skill-bar-wrapper">
          <div class="skill-bar-fill" style="width: ${s.level}%;"></div>
        </div>
        <div class="skill-meta">
          <span class="skill-desc">${s.desc}</span>
          <span class="skill-pct">${s.level}%</span>
        </div>
      </div>
    `
      )
      .join("")}
  </div>
</div>`;
    });

    container.innerHTML = html;
  }

  renderProjectsPanel() {
    const container = document.getElementById("projects-container");
    if (!container) return;

    let html = "";
    PROFILE_DATA.projects.forEach((p, idx) => {
      html += `
<div class="project-terminal-card" data-project-id="${p.id}">
  <div class="project-header">
    <span class="project-num">PROJECT_0${idx + 1}</span>
    <span class="project-badge badge">[${p.status}]</span>
  </div>
  <hr class="project-divider">
  <h3 class="project-title">${p.name}</h3>
  <div class="project-cat text-dim">> ${p.category} // ${p.date}</div>
  <p class="project-desc">${p.description}</p>
  
  <div class="project-highlights">
    ${p.highlights.map(h => `<div class="highlight-item"><span class="text-accent">•</span> ${h}</div>`).join("")}
  </div>

  <div class="project-tags">
    ${p.techStack.map(t => `<span class="tech-tag">${t}</span>`).join("")}
  </div>

  <div class="project-actions">
    ${p.links.demo !== "#" ? `<a href="${p.links.demo}" target="_blank" rel="noopener" class="btn-terminal-link" aria-label="Live Demo for ${p.name}">[ RUN DEMO ]</a>` : ""}
    <a href="${p.links.github}" target="_blank" rel="noopener" class="btn-terminal-link" aria-label="GitHub for ${p.name}">[ REPO // GITHUB ]</a>
    <button class="project-inspect-btn" type="button" data-project-id="${p.id}">[ INSPECT MODULE ]</button>
  </div>
</div>`;
    });

    container.innerHTML = html;
    container.querySelectorAll(".project-inspect-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const project = PROFILE_DATA.projects.find((item) => item.id === button.dataset.projectId);
        if (!project) return;
        matrixEngine?.triggerOverdrive?.(1200);
        this.showModal(
          `PROJECT MODULE // ${project.name.toUpperCase()}`,
          `ACCESSING PROJECT DATABASE…\nPROJECT FOUND.\n\nSTATUS: ${project.status}\nCATEGORY: ${project.category}\n\n${project.description}\n\nTECH: ${project.techStack.join(" · ")}`
        );
      });
    });
  }

  renderDiagnosticsPanel() {
    const container = document.getElementById("diagnostics-container");
    if (!container) return;

    const d = PROFILE_DATA.diagnostics;
    container.innerHTML = `
<div class="diag-grid">
  <div class="diag-card">
    <div class="diag-label">NEURAL CPU / BRAIN CAPACITY</div>
    <div class="diag-value text-glow">${d.brain}</div>
    <div class="diag-bar"><div class="diag-fill" style="width: 12%"></div></div>
  </div>
  <div class="diag-card">
    <div class="diag-label">SYSTEM RAM LOAD</div>
    <div class="diag-value text-bright">${d.ram}</div>
    <div class="diag-bar"><div class="diag-fill" style="width: 98%"></div></div>
  </div>
  <div class="diag-card">
    <div class="diag-label">COFFEE RESERVE LEVEL</div>
    <div class="diag-value text-accent">${d.coffeeLevel}</div>
    <div class="diag-bar"><div class="diag-fill danger" style="width: 8%"></div></div>
  </div>
  <div class="diag-card">
    <div class="diag-label">BUG REPOSITORY INDEX</div>
    <div class="diag-value text-glow">${d.bugs}</div>
    <div class="diag-bar"><div class="diag-fill" style="width: 100%"></div></div>
  </div>
  <div class="diag-card">
    <div class="diag-label">KEYSTROKE VELOCITY</div>
    <div class="diag-value">${d.keyboardWPM}</div>
  </div>
  <div class="diag-card">
    <div class="diag-label">GIT CYCLE COMMITS</div>
    <div class="diag-value">${d.gitCommits}</div>
  </div>
  <div class="diag-card">
    <div class="diag-label">QUANTUM FIREWALL</div>
    <div class="diag-value">${d.threatLevel}</div>
  </div>
  <div class="diag-card">
    <div class="diag-label">CORE TEMPERATURE</div>
    <div class="diag-value">${d.coreTemperature}</div>
  </div>
</div>`;
  }

  renderContactPanel() {
    const c = PROFILE_DATA.contact;
    const emailEl = document.getElementById("contact-email");
    const githubEl = document.getElementById("contact-github");
    const linkedinEl = document.getElementById("contact-linkedin");
    const portfolioEl = document.getElementById("contact-portfolio");

    if (emailEl) {
      emailEl.href = c.email;
      emailEl.textContent = c.email.replace("mailto:", "");
    }
    if (githubEl) {
      githubEl.href = c.github;
      const githubUrl = new URL(c.github);
      githubEl.textContent = `${githubUrl.host}${githubUrl.pathname}`;
    }
    if (linkedinEl) {
      linkedinEl.href = c.linkedin;
      const linkedinUrl = new URL(c.linkedin);
      linkedinEl.textContent = `${linkedinUrl.host}${linkedinUrl.pathname}`;
    }
    if (portfolioEl) {
      portfolioEl.href = c.portfolio;
      portfolioEl.textContent = c.portfolio;
    }
  }

  // ================= TAB NAVIGATION ================= //

  bindTabNavigation() {
    const tabButtons = document.querySelectorAll(".nav-tab-btn");
    const tabPanes = document.querySelectorAll(".terminal-pane");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        this.switchTab(targetTab);
        terminalAudio.playKeyClick();
      });

      btn.addEventListener("keydown", (event) => {
        const currentIndex = Array.from(tabButtons).indexOf(btn);
        let nextIndex = currentIndex;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (currentIndex + 1) % tabButtons.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabButtons.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        const nextTab = tabButtons[nextIndex];
        this.switchTab(nextTab.getAttribute("data-tab"));
        nextTab.focus();
      });
    });
  }

  switchTab(targetTab) {
    if (!targetTab) return;
    if (targetTab === "terminal" && this.currentTab !== "terminal") {
      this.terminalReturnTab = this.currentTab;
    }
    this.currentTab = targetTab;

    // Update active tab buttons
    document.querySelectorAll(".nav-tab-btn").forEach((btn) => {
      if (btn.getAttribute("data-tab") === targetTab) {
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      }
    });

    // Update active panes
    document.querySelectorAll(".terminal-pane").forEach((pane) => {
      if (pane.id === `pane-${targetTab}`) {
        pane.classList.add("active");
      } else {
        pane.classList.remove("active");
      }
    });

    if (typeof calcInstance !== "undefined" && calcInstance) {
      calcInstance.setActive(targetTab === "calculator");
    }

    // If switching to terminal tab, autofocus input
    if (targetTab === "terminal") {
      const input = document.getElementById("terminal-cli-input");
      if (input) setTimeout(() => input.focus(), 50);
    }

    // Lazy-init calculator on first visit
    if (targetTab === "calculator" && typeof initCalcIfNeeded === "function") {
      setTimeout(() => initCalcIfNeeded(), 30);
    }

    this.terminal?.setContext?.(targetTab);
    this.os?.setActiveModule?.(targetTab);
  }

  // ================= INTERACTIVE ACTION BUTTONS ================= //

  bindActionButtons() {
    // 1. ACCESS PROFILE
    const btnAccessProfile = document.getElementById("btn-access-profile");
    if (btnAccessProfile) {
      btnAccessProfile.addEventListener("click", () => {
        terminalAudio.playAccessGranted();
        this.switchTab("profile");
        this.showModal(
          "ACCESS GRANTED",
          `ACCESS GRANTED.

Unfortunately, there is nothing here
that can fix your code at 3 AM.`
        );
      });
    }

    // 2. VIEW PROJECTS
    const btnViewProjects = document.getElementById("btn-view-projects");
    if (btnViewProjects) {
      btnViewProjects.addEventListener("click", () => {
        terminalAudio.playKeyClick();
        this.switchTab("projects");
      });
    }

    // 3. RUN DIAGNOSTIC
    const btnRunDiagnostic = document.getElementById("btn-run-diagnostic");
    if (btnRunDiagnostic) {
      btnRunDiagnostic.addEventListener("click", () => {
        terminalAudio.playDataStream();
        this.switchTab("diagnostics");
        this.terminal.cmdDiagnostic();
      });
    }

    // 4. ENTER THE MATRIX
    const btnEnterMatrix = document.getElementById("btn-enter-matrix");
    if (btnEnterMatrix) {
      btnEnterMatrix.addEventListener("click", () => {
        this.terminal.cmdMatrix();
      });
    }

    // 5. HACK THE SYSTEM
    const btnHackSystem = document.getElementById("btn-hack-system");
    if (btnHackSystem) {
      btnHackSystem.addEventListener("click", () => {
        this.switchTab("terminal");
        this.terminal.cmdHack();
      });
    }

    // 6. RANDOM DEV QUOTE
    const btnRandomQuote = document.getElementById("btn-random-quote");
    if (btnRandomQuote) {
      btnRandomQuote.addEventListener("click", () => {
        terminalAudio.playAccessGranted();
        const quotes = PROFILE_DATA.quotes;
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        this.showModal("RANDOM DEV QUOTE", `"${q.text}"\n\n— ${q.author}`);
      });
    }

    // 7. PRODUCTIVITY / CLICK BUTTON
    const btnProductivity = document.getElementById("btn-productivity");
    if (btnProductivity) {
      btnProductivity.addEventListener("click", () => {
        terminalAudio.playKeyClick();
        this.showModal(
          "SYSTEM MESSAGE",
          `SYSTEM MESSAGE:
"Congratulations. You clicked a button.
Your productivity has increased by 0.0001%."`
        );
      });
    }

    // Red Pill & Blue Pill triggers
    const btnRedPill = document.getElementById("btn-red-pill");
    if (btnRedPill) {
      btnRedPill.addEventListener("click", () => {
        terminalAudio.playEasterEgg("red-pill");
        if (matrixEngine) matrixEngine.triggerOverdrive(10000);
        this.showModal(
          "THE RED PILL: WELCOME TO THE DESERT OF THE REAL",
          `You chose the Red Pill.
Your compiler now succeeds on the first try.
Memory leaks vanish before they occur.
You see the Matrix for what it truly is: pure asynchronous JavaScript.`
        );
      });
    }

    const btnBluePill = document.getElementById("btn-blue-pill");
    if (btnBluePill) {
      btnBluePill.addEventListener("click", () => {
        terminalAudio.playEasterEgg("blue-pill");
        this.showModal(
          "THE BLUE PILL: IGNORANCE IS BLISS",
          `You chose the Blue Pill.
You wake up in your bed.
There are 48 unread Slack notifications.
Your npm install has 12 critical vulnerabilities.
Back to reality!`
        );
      });
    }
  }

  // ================= OVERLAY & ESCAPE CONTROLLER ================= //

  bindEscapeHandling() {
    // Capture phase gives the active overlay first refusal before the
    // calculator's document-level shortcut handler can clear its display.
    window.addEventListener("keydown", this._escapeHandler, true);
  }

  handleEscape(event) {
    if (event.key !== "Escape") return;

    const bootOverlay = document.getElementById("boot-overlay");
    const modal = document.getElementById("matrix-modal");
    const windowFrame = document.getElementById("terminal-main-window");
    let closed = false;

    // Close the topmost active layer only. This preserves the expected
    // sequence when a modal sits above another expandable UI state.
    if (!this.bootComplete && bootOverlay?.style.display !== "none") {
      this.finishBoot();
      closed = true;
    } else if (window.ojasOS?.handleEscape?.()) {
      closed = true;
    } else if (modal?.classList.contains("open")) {
      this.closeModal();
      closed = true;
    } else if (typeof calcInstance !== "undefined" && calcInstance?.handleEscape?.()) {
      closed = true;
    } else if (windowFrame?.classList.contains("fullscreen-mode")) {
      this.exitFullscreenMode();
      closed = true;
    } else if (this.currentTab === "terminal") {
      const returnTabButton = Array.from(document.querySelectorAll(".nav-tab-btn"))
        .find((button) => button.getAttribute("data-tab") === this.terminalReturnTab);
      this.switchTab(returnTabButton?.getAttribute("data-tab") || "profile");
      returnTabButton?.focus();
      closed = true;
    }

    if (closed) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  bindModalControls() {
    const modal = document.getElementById("matrix-modal");
    const closeBtn = document.getElementById("modal-close-btn");
    const bootOverlay = document.getElementById("boot-overlay");

    closeBtn?.addEventListener("click", () => this.closeModal());
    modal?.addEventListener("keydown", (event) => this.trapFocus(event, modal));
    bootOverlay?.addEventListener("keydown", (event) => this.trapFocus(event, bootOverlay));
    modal?.addEventListener("click", (event) => {
      if (event.target === modal) this.closeModal();
    });
  }

  trapFocus(event, container) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(container.querySelectorAll(
      "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
    )).filter((element) => element.getClientRects().length > 0);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  }

  // ================= MODAL DIALOG CONTROLLER ================= //

  showModal(title, text) {
    const modal = document.getElementById("matrix-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");

    if (!modal || !modalTitle || !modalBody) return;

    const activeElement = document.activeElement;
    this.modalReturnFocus = activeElement instanceof HTMLElement ? activeElement : null;
    modalTitle.textContent = title;
    modalBody.textContent = text;
    modal.classList.add("open");
    document.getElementById("modal-close-btn")?.focus();
  }

  closeModal() {
    const modal = document.getElementById("matrix-modal");
    if (!modal?.classList.contains("open")) return false;

    modal.classList.remove("open");
    terminalAudio.playKeyClick();

    const returnFocus = this.modalReturnFocus;
    this.modalReturnFocus = null;
    if (returnFocus?.isConnected && typeof returnFocus.focus === "function") {
      returnFocus.focus();
    }
    return true;
  }

  // ================= WINDOW & SYSTEM CONTROLS ================= //

  bindWindowControls() {
    // Audio Toggle
    const audioBtn = document.getElementById("audio-toggle-btn");
    if (audioBtn) {
      audioBtn.textContent = terminalAudio.enabled ? "AUDIO: ON" : "AUDIO: OFF";
      audioBtn.setAttribute("aria-pressed", String(terminalAudio.enabled));
      audioBtn.addEventListener("click", () => {
        terminalAudio.toggle();
      });
    }

    // CRT Scanline Toggle
    const crtBtn = document.getElementById("crt-toggle-btn");
    const crtOverlay = document.getElementById("crt-overlay");
    if (crtBtn && crtOverlay) {
      const isEnabled = !crtOverlay.classList.contains("disabled");
      crtBtn.textContent = isEnabled ? "CRT: ON" : "CRT: OFF";
      crtBtn.setAttribute("aria-pressed", String(isEnabled));
      crtBtn.addEventListener("click", () => {
        crtOverlay.classList.toggle("disabled");
        const isDisabled = crtOverlay.classList.contains("disabled");
        crtBtn.textContent = isDisabled ? "CRT: OFF" : "CRT: ON";
        crtBtn.setAttribute("aria-pressed", String(!isDisabled));
        terminalAudio.playKeyClick();
      });
    }

    // Theme Switcher Selector
    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) {
      themeSelect.addEventListener("change", (e) => {
        const theme = e.target.value;
        this.os?.setTheme(theme, true);
        terminalAudio.playAccessGranted();
      });
    }

    // Window Minimize/Expand simulation
    const winExpandBtn = document.getElementById("win-btn-expand");
    const winContainer = document.getElementById("terminal-main-window");
    if (winExpandBtn && winContainer) {
      winExpandBtn.addEventListener("click", () => {
        if (winContainer.classList.contains("fullscreen-mode")) {
          this.exitFullscreenMode();
        } else {
          this.fullscreenReturnFocus = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : winExpandBtn;
          winContainer.classList.add("fullscreen-mode");
          terminalAudio.playKeyClick();
        }
      });
    }
  }

  exitFullscreenMode() {
    const winContainer = document.getElementById("terminal-main-window");
    if (!winContainer?.classList.contains("fullscreen-mode")) return false;

    winContainer.classList.remove("fullscreen-mode");
    terminalAudio.playKeyClick();

    const returnFocus = this.fullscreenReturnFocus || document.getElementById("win-btn-expand");
    this.fullscreenReturnFocus = null;
    if (returnFocus?.isConnected && typeof returnFocus.focus === "function") {
      returnFocus.focus();
    }
    return true;
  }

  // ================= EASTER EGGS ================= //

  bindEasterEggs() {
    // 1. Konami Code Listener
    window.addEventListener("keydown", (e) => {
      if (e.key === this.konamiCode[this.konamiProgress]) {
        this.konamiProgress++;
        if (this.konamiProgress === this.konamiCode.length) {
          this.triggerKonamiOverride();
          this.konamiProgress = 0;
        }
      } else {
        this.konamiProgress = 0;
      }
    });

    // 2. Global Interaction Counter
    window.addEventListener("click", () => {
      this.globalClickCount++;
      if (this.globalClickCount === 25) {
        terminalAudio.playEasterEgg("click-hunt");
        this.showModal(
          "CLASSIFIED TRANSMISSION",
          `THE SYSTEM HAS BEEN WATCHING YOU.

Just kidding.

It's JavaScript.`
        );
      }
    });
  }

  triggerKonamiOverride() {
    terminalAudio.playEasterEgg("konami");
    if (matrixEngine) matrixEngine.triggerOverdrive(12000);

    const container = document.getElementById("terminal-wrapper");
    if (container) {
      container.classList.add("god-mode");
      setTimeout(() => container.classList.remove("god-mode"), 10000);
    }

    this.showModal(
      "GOD MODE UNLOCKED: NEO PROTOCOL",
      `▲ ▲ ▼ ▼ ◄ ► ◄ ► B A

WAKE UP, NEO...
You have successfully unlocked Operator Root Clearance.
All system defenses have been bypassed.
Try typing 'matrix' or 'hack' in the terminal!`
    );
  }

  // ================= LIVE TELEMETRY CLOCK & STATS ================= //

  bindLiveTelemetry() {
    const timeEl = document.getElementById("telemetry-time");
    const uptimeEl = document.getElementById("telemetry-uptime");
    const startTime = Date.now();

    const updateClock = () => {
      const now = new Date();
      if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString("en-GB") + " IST";
      }

      if (uptimeEl) {
        const diffSeconds = Math.floor((Date.now() - startTime) / 1000);
        const mins = String(Math.floor(diffSeconds / 60)).padStart(2, "0");
        const secs = String(diffSeconds % 60).padStart(2, "0");
        uptimeEl.textContent = `00:${mins}:${secs}`;
      }
    };

    updateClock();
    setInterval(updateClock, 1000);
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new MatrixApp();
  app.init();
});

