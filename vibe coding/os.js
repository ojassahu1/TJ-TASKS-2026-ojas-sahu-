/**
 * OJAS.OS — lightweight system layer for the existing terminal portfolio.
 * Keeps navigation, mode, command-palette, and notification state in one place.
 */

class OjasOS {
  constructor(app) {
    this.app = app;
    window.ojasOS = this;
    this.activeModule = 'profile';
    this.activeIndex = 0;
    this.returnFocus = null;
    this.modeKey = 'ojas_os_mode';
    this.visitKey = 'ojas_os_modules';
    this.toastTimer = null;
    this.modules = {
      profile: 'IDENTITY_CORE',
      skills: 'SKILL_NETWORK',
      projects: 'PROJECT_DATABASE',
      terminal: 'COMMAND_SHELL',
      diagnostics: 'SYSTEM_DIAGNOSTICS',
      contact: 'COMMS_UPLINK',
      calculator: 'QUANTUM_CALC_ENGINE'
    };
    this.commands = [
      { id: 'help', label: 'Show Available OJAS.OS Commands', meta: 'SYSTEM · help', action: () => this.notify('USE / OR CTRL+K TO SEARCH MODULES AND MODES', 'HELP') },
      { id: 'about', label: 'Read Developer Identity Summary', meta: 'SYSTEM · about', action: () => this.showNeofetch() },
      { id: 'profile', label: 'Open Identity Core', meta: 'MODULE · profile', action: () => this.openModule('profile') },
      { id: 'skills', label: 'Open Skill Network', meta: 'MODULE · skills', action: () => this.openModule('skills') },
      { id: 'projects', label: 'Open Project Database', meta: 'MODULE · projects', action: () => this.openModule('projects') },
      { id: 'calculator', label: 'Launch Quantum Calculator', meta: 'MODULE · calculator', action: () => this.openModule('calculator') },
      { id: 'terminal', label: 'Open Command Shell', meta: 'MODULE · terminal', action: () => this.openModule('terminal') },
      { id: 'diagnostics', label: 'Run System Diagnostics', meta: 'MODULE · diagnostics', action: () => this.openModule('diagnostics') },
      { id: 'contact', label: 'Open Communications Uplink', meta: 'MODULE · contact', action: () => this.openModule('contact') },
      { id: 'matrix', label: 'Switch to Matrix Mode', meta: 'ENVIRONMENT · matrix', action: () => this.setMode('matrix') },
      { id: 'cyber', label: 'Switch to Cyber Mode', meta: 'ENVIRONMENT · cyber', action: () => this.setMode('cyber') },
      { id: 'terminal-mode', label: 'Switch to Terminal Mode', meta: 'ENVIRONMENT · terminal', action: () => this.setMode('terminal') },
      { id: 'minimal', label: 'Switch to Minimal Mode', meta: 'ENVIRONMENT · minimal', action: () => this.setMode('minimal') },
      { id: 'void', label: 'Switch to Void Mode', meta: 'ENVIRONMENT · void', action: () => this.setMode('void') },
      { id: 'scan', label: 'Run Visual System Scan', meta: 'SYSTEM · scan', action: () => this.runScan() },
      { id: 'status', label: 'Read System Status', meta: 'SYSTEM · status', action: () => this.notify(`SYSTEM ONLINE · ${this.modules[this.activeModule]}`, 'STATUS') },
      { id: 'clear', label: 'Clear Command Shell Output', meta: 'SYSTEM · clear', action: () => { this.app.terminal?.cmdClear?.(); this.openModule('terminal'); } },
      { id: 'neofetch', label: 'Display OJAS.OS Identity', meta: 'SYSTEM · neofetch', action: () => this.showNeofetch() }
    ];
    this.cacheElements();
    this.bindEvents();
    this.setMode(localStorage.getItem(this.modeKey) || 'matrix', false);
    this.setActiveModule('profile', false);
  }

  cacheElements() {
    this.palette = document.getElementById('ojas-command-palette');
    this.input = document.getElementById('ojas-command-input');
    this.results = document.getElementById('ojas-command-results');
    this.modeSelect = document.getElementById('os-mode-select');
    this.moduleLabel = document.getElementById('os-active-module');
    this.toast = document.getElementById('ojas-notification');
  }

  bindEvents() {
    document.getElementById('open-command-palette')?.addEventListener('click', () => this.openPalette());
    document.getElementById('restart-ojas-os')?.addEventListener('click', () => this.restart());
    this.modeSelect?.addEventListener('change', (event) => this.setMode(event.target.value));
    this.input?.addEventListener('input', () => { this.activeIndex = 0; this.renderResults(); });
    this.palette?.addEventListener('keydown', (event) => this.handlePaletteKeydown(event));
    this.palette?.addEventListener('click', (event) => {
      if (event.target === this.palette) this.closePalette();
    });
    document.addEventListener('keydown', (event) => this.handleGlobalKeydown(event));
  }

  handleGlobalKeydown(event) {
    const isPaletteOpen = this.palette?.classList.contains('open');
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      if (this.isEditableTarget(event.target)) return;
      event.preventDefault();
      if (!isPaletteOpen) this.openPalette();
      return;
    }
    const calculatorActive = document.getElementById('pane-calculator')?.classList.contains('active');
    if (event.key === '/' && !calculatorActive && !this.isEditableTarget(event.target) && !isPaletteOpen) {
      event.preventDefault();
      this.openPalette();
    }
  }

  handlePaletteKeydown(event) {
    if (event.key === 'Tab') {
      const focusable = [...this.palette.querySelectorAll('input:not([disabled]), button:not([disabled])')]
        .filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !this.palette.contains(document.activeElement))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !this.palette.contains(document.activeElement))) {
        event.preventDefault();
        first?.focus();
      }
      return;
    }

    const filtered = this.getFilteredCommands();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = Math.min(this.activeIndex + 1, Math.max(filtered.length - 1, 0));
      this.renderResults();
      if (event.target !== this.input) this.input.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
      this.renderResults();
      if (event.target !== this.input) this.input.focus();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const command = filtered[this.activeIndex];
      if (command) this.execute(command);
    }
  }

  isEditableTarget(target) {
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
  }

  openPalette() {
    if (!this.palette) return;
    this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.palette.classList.add('open');
    this.palette.setAttribute('aria-hidden', 'false');
    this.input.value = '';
    this.activeIndex = 0;
    this.renderResults();
    this.input.focus();
  }

  closePalette() {
    if (!this.palette?.classList.contains('open')) return false;
    this.palette.classList.remove('open');
    this.palette.setAttribute('aria-hidden', 'true');
    const focusTarget = this.returnFocus;
    this.returnFocus = null;
    if (focusTarget?.isConnected) focusTarget.focus();
    return true;
  }

  handleEscape() {
    return this.closePalette();
  }

  getFilteredCommands() {
    const query = (this.input?.value || '').trim().toLowerCase();
    if (!query) return this.commands;
    return this.commands.filter((command) => `${command.id} ${command.label} ${command.meta}`.toLowerCase().includes(query));
  }

  renderResults() {
    if (!this.results) return;
    const commands = this.getFilteredCommands();
    this.activeIndex = Math.min(this.activeIndex, Math.max(commands.length - 1, 0));
    this.results.innerHTML = commands.length
      ? commands.map((command, index) => `
        <button class="ojas-command-result${index === this.activeIndex ? ' active' : ''}" role="option" aria-selected="${index === this.activeIndex}" data-command="${command.id}">
          <span>${command.label}</span><small>${command.meta}</small>
        </button>`).join('')
      : '<div class="ojas-command-empty">No module found. Try <strong>help</strong>, <strong>matrix</strong>, or <strong>projects</strong>.</div>';
    this.results.querySelectorAll('[data-command]').forEach((element) => {
      element.addEventListener('click', () => {
        const command = this.commands.find((item) => item.id === element.dataset.command);
        if (command) this.execute(command);
      });
    });
  }

  execute(command) {
    this.closePalette();
    command.action();
  }

  openModule(module) {
    this.app.switchTab(module);
    if (module === 'terminal') setTimeout(() => document.getElementById('terminal-cli-input')?.focus(), 40);
  }

  setActiveModule(module, announce = true) {
    this.activeModule = module;
    const label = this.modules[module] || String(module).toUpperCase();
    if (this.moduleLabel) this.moduleLabel.textContent = label;
    document.body.dataset.module = module;
    let storedModules = [];
    try {
      const parsedModules = JSON.parse(localStorage.getItem(this.visitKey) || '[]');
      if (Array.isArray(parsedModules)) {
        storedModules = parsedModules.filter((item) => typeof item === 'string' && Object.prototype.hasOwnProperty.call(this.modules, item));
      }
    } catch {
      localStorage.removeItem(this.visitKey);
    }
    const seen = new Set(storedModules);
    const isNew = !seen.has(module);
    seen.add(module);
    localStorage.setItem(this.visitKey, JSON.stringify([...seen]));
    if (announce) this.notify(`${label} READY`, 'MODULE');
    if (isNew && seen.size >= Object.keys(this.modules).length) this.notify('EXPLORER ACHIEVEMENT UNLOCKED', 'SYSTEM');
  }

  setMode(mode, announce = true) {
    const modes = { matrix: 'matrix-green', cyber: 'cyber-amber', terminal: 'ghost-cyan', minimal: 'ghost-cyan', void: 'blood-red' };
    const selected = modes[mode] ? mode : 'matrix';
    const theme = modes[selected];
    document.body.classList.remove('os-mode-matrix', 'os-mode-cyber', 'os-mode-terminal', 'os-mode-minimal', 'os-mode-void');
    document.body.classList.add(`os-mode-${selected}`);
    document.body.classList.remove('matrix-green', 'cyber-amber', 'ghost-cyan', 'blood-red');
    document.body.classList.add(theme);
    document.getElementById('theme-select').value = theme;
    if (this.modeSelect) this.modeSelect.value = selected;
    matrixEngine?.setTheme?.(theme);
    localStorage.setItem(this.modeKey, selected);
    if (announce) this.notify(`${selected.toUpperCase()} ENVIRONMENT ACTIVE`, 'MODE');
  }

  runScan() {
    document.body.classList.add('ojas-scan-active');
    matrixEngine?.triggerOverdrive?.(2800);
    this.notify('VISUAL SCAN SIMULATION ACTIVE', 'SYSTEM');
    setTimeout(() => document.body.classList.remove('ojas-scan-active'), 1000);
  }

  showNeofetch() {
    this.app.showModal('OJAS.OS // SYSTEM PROFILE', `USER: ${PROFILE_DATA.identity.name}\nROLE: ${PROFILE_DATA.identity.role}\nMODULE: ${this.modules[this.activeModule]}\nENVIRONMENT: ${localStorage.getItem(this.modeKey) || 'matrix'}\nSTATUS: ONLINE // PORTFOLIO CORE READY`);
  }

  notify(message, label = 'SYSTEM') {
    if (!this.toast) return;
    clearTimeout(this.toastTimer);
    this.toast.innerHTML = `<strong>${label}</strong><span>${message}</span>`;
    this.toast.classList.add('show');
    this.toastTimer = setTimeout(() => this.toast.classList.remove('show'), 2800);
  }

  restart() {
    localStorage.removeItem('ojas_os_booted');
    this.app.restartBoot();
  }
}
