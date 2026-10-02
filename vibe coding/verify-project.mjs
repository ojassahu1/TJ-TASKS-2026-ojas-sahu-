import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

function loadPlaywright() {
  const localRequire = createRequire(import.meta.url);
  try {
    return localRequire('playwright');
  } catch {
    const defaultGlobalRoot = process.platform === 'win32'
      ? join(process.env.APPDATA || '', 'npm', 'node_modules')
      : execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
    const globalRoot = process.env.PLAYWRIGHT_GLOBAL_ROOT || defaultGlobalRoot;
    return createRequire(join(globalRoot, '__verify_project__.cjs'))('playwright');
  }
}

const { chromium } = loadPlaywright();
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000/index.html';
const APP_DIR = dirname(fileURLToPath(import.meta.url));
const results = [];
const consoleErrors = [];
const consoleWarnings = [];
const pageErrors = [];
const failedRequests = [];
const localOrigin = new URL(BASE_URL).origin;

let browser;
let context;
let page;

function pass(name, details = '') {
  results.push({ name, status: 'PASS', details });
  console.log(`\x1b[32mPASS\x1b[0m ${name}${details ? ` — ${details}` : ''}`);
}

function fail(name, error) {
  const message = error instanceof Error ? error.message : String(error);
  results.push({ name, status: 'FAIL', error: message });
  console.error(`\x1b[31mFAIL\x1b[0m ${name} — ${message}`);
}

async function test(name, fn) {
  try {
    await fn();
    pass(name);
  } catch (error) {
    fail(name, error);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function resetPage() {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('body').waitFor({ state: 'attached' });

  const skipButton = page.locator('#skip-boot-btn');
  if (await skipButton.isVisible().catch(() => false)) {
    await skipButton.click();
  }

  await page.waitForFunction(() => {
    const overlay = document.querySelector('#boot-overlay');
    return !overlay || getComputedStyle(overlay).display === 'none';
  }, null, { timeout: 6000 });
}

async function runTerminalCommand(command) {
  await page.locator('#tab-terminal').click();
  const input = page.locator('#terminal-cli-input');
  await input.fill(command);
  await input.press('Enter');
}

async function closeModalWithEscape() {
  const modal = page.locator('#matrix-modal');
  if (await modal.evaluate(element => element.classList.contains('open'))) {
    await page.keyboard.press('Escape');
    await page.waitForFunction(() =>
      !document.querySelector('#matrix-modal')?.classList.contains('open')
    );
  }
}

async function main() {
  console.log('\n========================================');
  console.log('PROJECT END-TO-END VERIFICATION');
  console.log('========================================\n');

  browser = await chromium.launch({ headless: true });
  context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  page = await context.newPage();

  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
    if (message.type() === 'warning') consoleWarnings.push(message.text());
  });
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('requestfailed', request => {
    failedRequests.push({
      url: request.url(),
      method: request.method(),
      failure: request.failure()?.errorText || 'unknown'
    });
  });

  await test('Application starts and boot skip stops timers', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    assert((await page.title()).includes('OJAS.OS'), 'Unexpected document title');
    assert(await page.locator('#terminal-main-window').count() === 1, 'Main workspace not found');
    assert(await page.locator('.terminal-pane').count() === 7, 'Expected seven workspace panes');
    assert(await page.locator('form').count() === 0, 'Unexpected form found in static application');

    const skipButton = page.locator('#skip-boot-btn');
    if (await skipButton.isVisible().catch(() => false)) {
      await skipButton.click();
    }
    await page.waitForFunction(() =>
      getComputedStyle(document.querySelector('#boot-overlay')).display === 'none'
    );

    const boot = await page.evaluate(() => ({
      complete: window.ojasOS.app.bootComplete,
      interval: window.ojasOS.app.bootInterval,
      timeout: window.ojasOS.app.bootFinishTimer,
      lineCount: document.querySelectorAll('#boot-log .boot-line').length
    }));
    await page.waitForTimeout(1400);
    const laterLineCount = await page.locator('#boot-log .boot-line').count();
    assert(boot.complete, 'Boot did not complete after dismissal');
    assert(boot.interval === null && boot.timeout === null, 'Boot timers were not cleared');
    assert(laterLineCount === boot.lineCount, 'Boot lines continued after dismissal');
  });

  await test('Command palette: mode terminal then real Projects click', async () => {
    await resetPage();
    await page.locator('#open-command-palette').click();
    await page.locator('#ojas-command-input').fill('mode terminal');

    const results = await page.locator('#ojas-command-results [data-command]')
      .evaluateAll(items => items.map(item => item.dataset.command));
    assert(results.includes('terminal-mode'), 'mode terminal returned no matching command');

    await page.keyboard.press('Enter');
    await page.waitForFunction(() =>
      !document.querySelector('#ojas-command-palette').classList.contains('open')
    );

    const palette = await page.locator('#ojas-command-palette').evaluate(element => ({
      open: element.classList.contains('open'),
      ariaHidden: element.getAttribute('aria-hidden')
    }));
    assert(!palette.open, 'Palette remained open after command execution');
    assert(palette.ariaHidden === 'true', `Expected aria-hidden=true, got ${palette.ariaHidden}`);

    await page.locator('#tab-projects').click();
    assert(await page.locator('#tab-projects').getAttribute('aria-selected') === 'true',
      'Projects tab did not become active after the real click');
    assert(await page.locator('#pane-projects').evaluate(element => element.classList.contains('active')),
      'Projects pane did not become active');
  });

  await test('Command palette closes with Escape and keyboard search works', async () => {
    await resetPage();
    await page.keyboard.press('/');
    assert(await page.locator('#ojas-command-palette').evaluate(element => element.classList.contains('open')),
      'Slash shortcut did not open the palette');
    await page.locator('#ojas-command-input').fill('project');
    assert(await page.locator('#ojas-command-results [data-command]').count() > 0,
      'Palette returned no project results');
    await page.keyboard.press('Escape');
    assert(!(await page.locator('#ojas-command-palette').evaluate(element => element.classList.contains('open'))),
      'Escape did not close the palette');
  });

  await test('All navigation tabs and keyboard navigation', async () => {
    await resetPage();
    const modules = ['profile', 'skills', 'projects', 'terminal', 'diagnostics', 'contact', 'calculator'];
    for (const module of modules) {
      const tab = page.locator(`#tab-${module}`);
      await tab.click();
      assert(await tab.getAttribute('aria-selected') === 'true', `${module} tab was not selected`);
      assert(await page.locator(`#pane-${module}`).evaluate(element => element.classList.contains('active')),
        `${module} pane was not activated`);
    }

    await page.locator('#tab-profile').focus();
    await page.keyboard.press('ArrowRight');
    assert(await page.locator('#tab-skills').getAttribute('aria-selected') === 'true',
      'ArrowRight did not advance the selected tab');
    assert(new URL(page.url()).pathname.endsWith('/index.html'), 'Tab navigation changed the static route');
  });

  await test('All modes apply distinct layouts and persist', async () => {
    await resetPage();
    const modes = ['matrix', 'cyber', 'terminal', 'minimal', 'void'];
    const visualStates = {};

    for (const mode of modes) {
      await page.locator('#os-mode-select').selectOption(mode);
      await page.waitForTimeout(350);
      const state = await page.evaluate(() => ({
        mode: document.body.dataset.mode,
        selected: document.querySelector('#os-mode-select').value,
        workspace: getComputedStyle(document.querySelector('#terminal-main-window')).display,
        nav: getComputedStyle(document.querySelector('.terminal-tabs')).flexDirection,
        actions: getComputedStyle(document.querySelector('.quick-action-bar')).display,
        frameShadow: getComputedStyle(document.querySelector('#terminal-main-window')).boxShadow,
        frameBackground: getComputedStyle(document.querySelector('#terminal-main-window')).backgroundColor
      }));
      assert(state.mode === mode && state.selected === mode, `Mode state mismatch for ${mode}`);
      visualStates[mode] = state;
    }

    assert(visualStates.terminal.workspace === 'grid' && visualStates.terminal.nav === 'column',
      'Terminal mode did not activate the sidebar layout');
    assert(visualStates.cyber.actions === 'grid', 'Cyber mode did not activate the action grid');
    assert(visualStates.minimal.frameShadow === 'none', 'Minimal mode retained the frame glow');
    assert(visualStates.void.frameBackground !== visualStates.matrix.frameBackground,
      'Void mode did not change the workspace surface');

    await page.locator('#os-mode-select').selectOption('terminal');
    await page.reload();
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#boot-overlay')).display === 'none');
    const restored = await page.evaluate(() => ({
      mode: document.body.dataset.mode,
      selected: document.querySelector('#os-mode-select').value,
      stored: localStorage.getItem('ojas_os_mode')
    }));
    assert(restored.mode === 'terminal' && restored.selected === 'terminal' && restored.stored === 'terminal',
      'Mode did not persist through reload');
  });

  await test('All themes and mode/theme independence', async () => {
    await resetPage();
    const themes = ['matrix-green', 'cyber-amber', 'ghost-cyan', 'blood-red'];
    for (const theme of themes) {
      await page.locator('#theme-select').selectOption(theme);
      const state = await page.evaluate(() => ({
        selected: document.querySelector('#theme-select').value,
        classes: [...document.body.classList],
        stored: localStorage.getItem('ojas_os_theme')
      }));
      assert(state.selected === theme && state.classes.includes(theme) && state.stored === theme,
        `Theme state mismatch for ${theme}`);
    }

    await page.locator('#os-mode-select').selectOption('terminal');
    await page.locator('#theme-select').selectOption('ghost-cyan');
    await page.locator('#os-mode-select').selectOption('matrix');
    assert(await page.evaluate(() => document.body.dataset.mode === 'matrix' && document.body.classList.contains('ghost-cyan')),
      'Changing mode unexpectedly changed the palette');
    await page.locator('#theme-select').selectOption('blood-red');
    assert(await page.evaluate(() => document.body.dataset.mode === 'matrix' && document.body.classList.contains('blood-red')),
      'Changing palette unexpectedly changed the mode');
  });

  await test('Audio ON/OFF unlock, gain, persistence and cue gating', async () => {
    await resetPage();
    const button = page.locator('#audio-toggle-btn');
    if (await button.getAttribute('aria-pressed') !== 'true') await button.click();

    const enabled = await page.evaluate(() => ({
      enabled: terminalAudio.enabled,
      state: terminalAudio.ctx?.state,
      gain: terminalAudio.masterGain?.gain.value,
      stored: localStorage.getItem('matrix_terminal_audio'),
      pressed: document.querySelector('#audio-toggle-btn').getAttribute('aria-pressed')
    }));
    assert(enabled.enabled && enabled.state === 'running', 'Audio context did not unlock on click');
    assert(Math.abs(enabled.gain - 0.24) < 0.001, `Unexpected ON gain: ${enabled.gain}`);
    assert(enabled.stored === 'true' && enabled.pressed === 'true', 'Audio ON state did not synchronize');

    const cues = await page.evaluate(() => {
      const audio = terminalAudio;
      const context = audio.ctx;
      const hadOwnMethod = Object.prototype.hasOwnProperty.call(context, 'createOscillator');
      const previousMethod = context.createOscillator;
      const createOscillator = context.createOscillator.bind(context);
      const frequencies = [];
      context.createOscillator = (...args) => {
        const oscillator = createOscillator(...args);
        const setFrequency = oscillator.frequency.setValueAtTime.bind(oscillator.frequency);
        oscillator.frequency.setValueAtTime = (value, time) => {
          frequencies.push(value);
          return setFrequency(value, time);
        };
        return oscillator;
      };

      const names = [
        'konami', 'click-hunt', 'terminal-click', 'terminal-secret', 'calculator',
        'coffee', 'hire-me', 'red-pill', 'blue-pill', 'self-destruct',
        'self-destruct-impact'
      ];
      const notes = Object.fromEntries(names.map(name => {
        const start = frequencies.length;
        audio.playEasterEgg(name);
        return [name, frequencies.slice(start)];
      }));
      if (hadOwnMethod) context.createOscillator = previousMethod;
      else delete context.createOscillator;
      return {
        allHaveNotes: Object.values(notes).every(sequence => sequence.length > 0),
        allUnique: new Set(Object.values(notes).map(sequence => JSON.stringify(sequence))).size === names.length,
        sameContext: audio.ctx === context,
        notes
      };
    });
    assert(cues.allHaveNotes && cues.allUnique && cues.sameContext,
      'Easter-egg cues were missing, duplicated, or created another context');

    await button.click();
    const disabled = await page.evaluate(() => ({
      enabled: terminalAudio.enabled,
      gain: terminalAudio.masterGain?.gain.value,
      stored: localStorage.getItem('matrix_terminal_audio'),
      pressed: document.querySelector('#audio-toggle-btn').getAttribute('aria-pressed')
    }));
    assert(!disabled.enabled && disabled.gain === 0, 'Audio output did not mute');
    assert(disabled.stored === 'false' && disabled.pressed === 'false', 'Audio OFF state did not synchronize');

    const mutedOscillators = await page.evaluate(() => {
      const audio = terminalAudio;
      const audioContext = audio.ctx;
      const hadOwnMethod = Object.prototype.hasOwnProperty.call(audioContext, 'createOscillator');
      const previousMethod = audioContext.createOscillator;
      const createOscillator = audioContext.createOscillator.bind(audioContext);
      let created = 0;
      audioContext.createOscillator = (...args) => {
        created += 1;
        return createOscillator(...args);
      };
      audio.playEasterEgg('calculator');
      if (hadOwnMethod) audioContext.createOscillator = previousMethod;
      else delete audioContext.createOscillator;
      return created;
    });
    assert(mutedOscillators === 0, 'An Easter-egg cue created audio oscillators while muted');
  });

  await test('CRT toggle state and Minimal-mode override', async () => {
    await resetPage();
    await page.locator('#os-mode-select').selectOption('minimal');
    await page.locator('#crt-toggle-btn').click();
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#crt-overlay')).opacity === '0');
    const off = await page.evaluate(() => ({
      disabled: document.querySelector('#crt-overlay').classList.contains('disabled'),
      pressed: document.querySelector('#crt-toggle-btn').getAttribute('aria-pressed'),
      opacity: getComputedStyle(document.querySelector('#crt-overlay')).opacity
    }));
    assert(off.disabled && off.pressed === 'false' && off.opacity === '0', 'CRT OFF failed in Minimal mode');
    await page.locator('#crt-toggle-btn').click();
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('#crt-overlay')).opacity) > 0.7);
    const on = await page.evaluate(() => ({
      disabled: document.querySelector('#crt-overlay').classList.contains('disabled'),
      pressed: document.querySelector('#crt-toggle-btn').getAttribute('aria-pressed'),
      opacity: getComputedStyle(document.querySelector('#crt-overlay')).opacity
    }));
    assert(!on.disabled && on.pressed === 'true' && Number(on.opacity) > 0, 'CRT did not re-enable in Minimal mode');
  });

  await test('Profile links, contact links and Dispatch Directly content', async () => {
    await resetPage();
    await page.locator('#tab-projects').click();
    const projects = await page.locator('#projects-container a[aria-label^="GitHub"]')
      .evaluateAll(anchors => anchors.map(anchor => ({ href: anchor.href, target: anchor.target, rel: anchor.rel })));
    const expectedGithub = 'https://github.com/ojassahu1?tab=overview&from=2026-09-01&to=2026-09-30';
    assert(projects.length === 4, `Expected four project GitHub links, found ${projects.length}`);
    assert(projects.every(link => link.href === expectedGithub && link.target === '_blank' && link.rel.includes('noopener')),
      'A project GitHub link has an incorrect destination or target attributes');

    await page.locator('#tab-contact').click();
    const contact = await page.evaluate(() => ({
      email: document.querySelector('#contact-email').href,
      github: document.querySelector('#contact-github').href,
      linkedin: document.querySelector('#contact-linkedin').href,
      dispatch: document.querySelector('#pane-contact .btn-terminal-link').href,
      text: document.querySelector('#pane-contact').textContent.toLowerCase()
    }));
    assert(contact.email === 'mailto:ojassahu002@gmail.com', `Wrong email destination: ${contact.email}`);
    assert(contact.github === expectedGithub, `Wrong GitHub destination: ${contact.github}`);
    assert(contact.linkedin === 'https://www.linkedin.com/in/ojas-sahu-5b2940219',
      `Wrong LinkedIn destination: ${contact.linkedin}`);
    assert(contact.dispatch.startsWith('mailto:ojassahu002@gmail.com?subject='),
      `Wrong Dispatch Directly destination: ${contact.dispatch}`);
    for (const term of ['collaboration', 'technical', 'work opportunities', 'general inquiries']) {
      assert(contact.text.includes(term), `Dispatch content is missing: ${term}`);
    }
  });

  await test('Project inspection and quick-action modals', async () => {
    await resetPage();
    await page.locator('#btn-access-profile').click();
    assert(await page.locator('#matrix-modal').evaluate(element => element.classList.contains('open')),
      'Access Profile did not open its modal');
    await closeModalWithEscape();

    await page.locator('#btn-view-projects').click();
    assert(await page.locator('#tab-projects').getAttribute('aria-selected') === 'true',
      'View Projects did not navigate');
    await page.locator('.project-inspect-btn').first().click();
    assert(await page.locator('#matrix-modal').evaluate(element => element.classList.contains('open')),
      'Project inspection did not open its modal');
    await closeModalWithEscape();

    for (const selector of ['#btn-red-pill', '#btn-blue-pill']) {
      await page.locator(selector).click();
      assert(await page.locator('#matrix-modal').evaluate(element => element.classList.contains('open')),
        `${selector} did not open its modal`);
      await closeModalWithEscape();
      await page.locator('#tab-projects').click();
    }
  });

  await test('Terminal commands and Easter-egg output', async () => {
    await resetPage();
    await runTerminalCommand('coffee');
    await runTerminalCommand('cat secret_flag.dat');
    await runTerminalCommand('sudo hire-me');
    await runTerminalCommand('cat toString');
    await runTerminalCommand('theme cyan');
    await runTerminalCommand('mode terminal');
    await runTerminalCommand('audio on');
    const state = await page.evaluate(() => ({
      output: document.querySelector('#terminal-output').textContent,
      links: [...document.querySelectorAll('#terminal-output a[href^="mailto:"]')].map(anchor => anchor.href),
      mode: document.body.dataset.mode,
      theme: document.body.classList.contains('ghost-cyan'),
      audio: terminalAudio.enabled
    }));
    assert(state.output.includes('Freshly brewed Ethiopian Dark Roast'), 'Coffee command output missing');
    assert(state.output.includes('FLAG{NEO_FOLLOWS_THE_WHITE_RABBIT_2026}'), 'Secret file output missing');
    assert(state.output.includes('cat: toString: No such file or directory'), 'Inherited file name was not rejected');
    assert(state.links.some(link => link.startsWith('mailto:ojassahu002@gmail.com')), 'sudo hire-me recipient is wrong');
    assert(state.mode === 'terminal' && state.theme && state.audio, 'CLI mode/theme/audio state did not apply');

    await runTerminalCommand('audio off');
    assert(!(await page.evaluate(() => terminalAudio.enabled)), 'CLI audio off failed');

    const terminal = page.locator('#terminal-main-window');
    const currentCount = await page.evaluate(() => window.ojasOS.app.terminal.clickCount);
    for (let index = currentCount; index < 12; index += 1) {
      await page.locator('#terminal-output').click();
    }
    assert((await page.locator('#terminal-output').textContent()).includes('[CLASSIFIED PROTOCOL TRIGGERED]'),
      'Terminal repeated-click Easter egg did not trigger');
  });

  await test('Global-click and Konami Easter eggs', async () => {
    await resetPage();
    const clickTarget = page.locator('.sys-node-tag');
    for (let index = 0; index < 25; index += 1) await clickTarget.click();
    assert(await page.locator('#matrix-modal').evaluate(element => element.classList.contains('open')),
      'Global 25-click Easter egg did not open its modal');
    await closeModalWithEscape();

    for (const key of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']) {
      await page.keyboard.press(key);
    }
    const konami = await page.evaluate(() => ({
      modal: document.querySelector('#matrix-modal').classList.contains('open'),
      godMode: document.querySelector('#terminal-wrapper').classList.contains('god-mode')
    }));
    assert(konami.modal && konami.godMode, 'Konami Easter egg did not activate');
    await closeModalWithEscape();
  });

  await test('Calculator input, Easter egg and self-destruct recovery', async () => {
    await resetPage();
    await page.locator('#tab-calculator').click();
    for (const selector of [
      '[data-action="digit"][data-digit="9"]',
      '[data-action="op"][data-op="+"]',
      '[data-action="digit"][data-digit="1"]',
      '[data-action="digit"][data-digit="0"]',
      '[data-action="equals"]'
    ]) await page.locator(selector).click();
    await page.waitForFunction(() =>
      document.querySelector('#calc-result-line').textContent.includes('Nice try')
    );
    assert((await page.locator('#calc-result-line').textContent()).includes('Nice try'),
      '9+10 Easter egg message did not appear');

    await page.locator('[data-action="clear"]').click();
    await page.locator('[data-action="digit"][data-digit="1"]').click();
    await page.locator('[data-action="op"][data-op="÷"]').click();
    await page.locator('[data-action="digit"][data-digit="0"]').click();
    await page.locator('[data-action="equals"]').click();
    assert(await page.locator('#calc-destruct-overlay').evaluate(element => element.classList.contains('active')),
      'Division by zero did not start the calculator simulation');
    await page.keyboard.press('Escape');
    assert(!(await page.locator('#calc-destruct-overlay').evaluate(element => element.classList.contains('active'))),
      'Escape did not cancel the calculator simulation');
  });

  await test('Calculator postfix operations and keyboard-accessible history', async () => {
    await resetPage();
    await page.locator('#tab-calculator').click();
    const results = {};
    for (const action of ['squared', 'factorial', 'percent', 'negate']) {
      await page.locator('[data-action="clear"]').click();
      await page.locator('[data-action="digit"][data-digit="5"]').click();
      await page.locator('[data-action="equals"]').click();
      await page.locator(`[data-action="${action}"]`).click();
      await page.locator('[data-action="equals"]').click();
      results[action] = await page.locator('#calc-result-line').textContent();
      assert(!(await page.evaluate(() => calcInstance.isError)), `${action} left the calculator in an error state`);
    }
    assert(results.squared === '25' && results.factorial === '120' && results.percent === '0.05' && results.negate === '-5',
      `Unexpected postfix results: ${JSON.stringify(results)}`);

    const historyButton = page.locator('.calc-history-entry').first();
    assert(await historyButton.evaluate(element => element.tagName === 'BUTTON'), 'History entry is not a native button');
    await historyButton.focus();
    await page.keyboard.press('Enter');
    assert(await page.evaluate(() => document.activeElement.classList.contains('calc-history-entry')),
      'History entry could not be activated by keyboard');
  });

  await test('Hack sequence cannot duplicate and completes', async () => {
    await resetPage();
    await page.locator('#btn-hack-system').click();
    await page.locator('#btn-hack-system').click();
    const starts = await page.locator('#terminal-output').evaluate(element =>
      [...element.querySelectorAll('*')].filter(node => node.textContent === '[*] INITIATING BRUTE FORCE ON MAINFRAME...').length
    );
    assert(starts === 1, `Expected one hack sequence, got ${starts}`);
    await page.waitForTimeout(3300);
    const completed = await page.evaluate(() => ({
      executing: window.ojasOS.app.terminal.isExecuting,
      loot: document.querySelector('#terminal-output').textContent.includes('LOOT ACQUIRED')
    }));
    assert(!completed.executing && completed.loot, 'Hack sequence did not finish cleanly');
  });

  await test('Responsive layouts at requested widths', async () => {
    await resetPage();
    for (const [width, height] of [[320, 800], [375, 812], [414, 896], [768, 1024], [1024, 768], [1280, 800], [1440, 900], [1920, 1080]]) {
      await page.setViewportSize({ width, height });
      const layout = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        modeVisible: getComputedStyle(document.querySelector('#os-mode-select')).display !== 'none'
      }));
      assert(layout.document <= layout.viewport, `Horizontal overflow at ${width}x${height}`);
      assert(layout.modeVisible, `Mode control is hidden at ${width}px`);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  await test('No stale profile or contact references in source', async () => {
    const sourceFiles = ['data.js', 'index.html', 'app.js', 'terminal.js', 'README.md'];
    const sources = await Promise.all(sourceFiles.map(async file => [
      file,
      await readFile(resolve(APP_DIR, file), 'utf8')
    ]));
    const stalePatterns = [
      ['previous GitHub URL', /github\.com\/ojassahu(?:\/|[?#\s"']|$)/i],
      ['previous email address', /ojas\.sahu\.dev@gmail\.com/i],
      ['previous LinkedIn profile', /linkedin\.com\/in\/ojassahu(?:[/?#\s"']|$)/i],
      ['previous handle', /ojas_sahu/i]
    ];
    for (const [file, source] of sources) {
      for (const [label, pattern] of stalePatterns) {
        assert(!pattern.test(source), `${label} remains in ${file}`);
      }
    }
  });

  await test('No failed same-origin requests', async () => {
    const localFailures = failedRequests.filter(request => {
      try { return new URL(request.url).origin === localOrigin; }
      catch { return false; }
    });
    assert(localFailures.length === 0, JSON.stringify(localFailures));
  });

  await test('No page errors', async () => {
    assert(pageErrors.length === 0, JSON.stringify(pageErrors));
  });

  await test('No console errors', async () => {
    assert(consoleErrors.length === 0, JSON.stringify(consoleErrors));
  });

  const passed = results.filter(result => result.status === 'PASS').length;
  const failed = results.filter(result => result.status === 'FAIL').length;
  const summary = {
    baseURL: BASE_URL,
    total: results.length,
    passed,
    failed,
    consoleErrors,
    consoleWarnings,
    pageErrors,
    failedRequests,
    results
  };

  console.log('\n========================================');
  console.log('FINAL VERIFICATION RESULT');
  console.log('========================================');
  console.log(`VERIFICATION_SUMMARY=${JSON.stringify(summary)}`);
  console.log(`\nPassed: ${passed}`);
  console.log(`Failed: ${failed}`);
  if (failed > 0) {
    console.error('\nVERIFICATION FAILED');
    process.exitCode = 1;
  } else {
    console.log('\nALL VERIFICATION TESTS PASSED');
  }
}

main()
  .catch(error => {
    console.error('\nFATAL VERIFICATION ERROR:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
  });