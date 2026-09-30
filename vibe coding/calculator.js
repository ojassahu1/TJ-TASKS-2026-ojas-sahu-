/**
 * ====================================================================
 * OVER-ENGINEERED 3D SCIENTIFIC CALCULATOR — UI CONTROLLER
 * ====================================================================
 * Integrates natively into the Matrix Terminal project.
 * Reuses: CSS variables, themes, terminalAudio, matrixEngine, style conventions.
 *
 * Features:
 *  - CSS perspective 3D tilt following mouse/pointer
 *  - Floating keyframe animation
 *  - Button press depth animation
 *  - Calculation history panel
 *  - Sarcastic error overlays (matches terminal aesthetic)
 *  - Self-destruct sequence on divide-by-zero
 *  - 9+10=21 easter egg
 *  - Keyboard input
 *  - Degree / Radian toggle
 *  - prefers-reduced-motion safe
 */

class ScientificCalculator {
  constructor(containerId = 'calc-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // State
    this.expression = '';    // what the user has built up
    this.displayExpr = '';   // shown in the sub-display
    this.lastResult = null;
    this.isError = false;
    this.isSelfDestructing = false;
    this.angleMode = 'deg';  // 'deg' | 'rad'
    this.history = [];       // last N calculations
    this.justEvaluated = false; // true right after pressing =

    // Animation
    this.tiltX = 0;
    this.tiltY = 0;
    this.targetTiltX = 0;
    this.targetTiltY = 0;
    this.rafId = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.render();
    this.bindEvents();
    this.startTiltLoop();
  }

  // ================================================================
  // RENDER — builds the full calculator DOM inside the pane
  // ================================================================
  render() {
    this.container.innerHTML = `
<div class="calc-outer-wrapper" id="calc-outer-wrapper">

  <!-- ── 3D floating card ── -->
  <div class="calc-scene" id="calc-scene" role="application" aria-label="3D Scientific Calculator">
    <div class="calc-card" id="calc-card">

      <!-- Header label -->
      <div class="calc-header-bar">
        <span class="calc-brand">QUANTUM CALC <span class="calc-ver text-dim">v9.∞</span></span>
        <div class="calc-mode-group">
          <button class="calc-mode-btn active" id="calc-mode-deg" data-mode="deg" aria-pressed="true">DEG</button>
          <button class="calc-mode-btn" id="calc-mode-rad" data-mode="rad" aria-pressed="false">RAD</button>
        </div>
      </div>

      <!-- Display -->
      <div class="calc-display" id="calc-display" aria-live="polite" aria-label="Calculator display">
        <div class="calc-expr-line" id="calc-expr-line">&nbsp;</div>
        <div class="calc-result-line" id="calc-result-line">0</div>
      </div>

      <!-- Error overlay -->
      <div class="calc-error-overlay" id="calc-error-overlay" aria-live="assertive" aria-atomic="true">
        <div class="calc-error-icon">⚠</div>
        <div class="calc-error-msg" id="calc-error-msg"></div>
        <button class="calc-error-dismiss" id="calc-error-dismiss">[DISMISS]</button>
      </div>

      <!-- Self-destruct overlay -->
      <div class="calc-destruct-overlay" id="calc-destruct-overlay" aria-live="assertive">
        <div class="calc-destruct-title">⚠ SELF-DESTRUCT INITIATED ⚠</div>
        <div class="calc-destruct-count" id="calc-destruct-count">3</div>
        <div class="calc-destruct-sub" id="calc-destruct-sub">Bro, you just tore a hole in the spacetime continuum.</div>
        <div class="calc-destruct-progress">
          <div class="calc-destruct-fill" id="calc-destruct-fill"></div>
        </div>
      </div>

      <!-- Keypad -->
      <div class="calc-keypad" id="calc-keypad">

        <!-- Row 0: Scientific top row -->
        <button class="calc-btn sci wide-2" data-action="clear" aria-label="All Clear">AC</button>
        <button class="calc-btn sci" data-action="backspace" aria-label="Backspace">⌫</button>
        <button class="calc-btn sci" data-action="percent" aria-label="Percent">%</button>
        <button class="calc-btn sci" data-action="factorial" aria-label="Factorial">n!</button>

        <!-- Row 1: Trig -->
        <button class="calc-btn sci" data-action="func" data-fn="sin">sin</button>
        <button class="calc-btn sci" data-action="func" data-fn="cos">cos</button>
        <button class="calc-btn sci" data-action="func" data-fn="tan">tan</button>
        <button class="calc-btn sci" data-action="func" data-fn="log">log</button>

        <!-- Row 2: More sci -->
        <button class="calc-btn sci" data-action="func" data-fn="ln">ln</button>
        <button class="calc-btn sci" data-action="func" data-fn="sqrt">√</button>
        <button class="calc-btn sci" data-action="squared">x²</button>
        <button class="calc-btn sci" data-action="power">xʸ</button>

        <!-- Row 3: Constants -->
        <button class="calc-btn sci const" data-action="const" data-val="π">π</button>
        <button class="calc-btn sci const" data-action="const" data-val="e">e</button>
        <button class="calc-btn sci" data-action="paren-open">(</button>
        <button class="calc-btn sci" data-action="paren-close">)</button>

        <!-- Divider -->
        <div class="calc-keypad-divider"></div>

        <!-- Row 4: 7 8 9 ÷ -->
        <button class="calc-btn num" data-action="digit" data-digit="7">7</button>
        <button class="calc-btn num" data-action="digit" data-digit="8">8</button>
        <button class="calc-btn num" data-action="digit" data-digit="9">9</button>
        <button class="calc-btn op"  data-action="op"    data-op="÷">÷</button>

        <!-- Row 5: 4 5 6 × -->
        <button class="calc-btn num" data-action="digit" data-digit="4">4</button>
        <button class="calc-btn num" data-action="digit" data-digit="5">5</button>
        <button class="calc-btn num" data-action="digit" data-digit="6">6</button>
        <button class="calc-btn op"  data-action="op"    data-op="×">×</button>

        <!-- Row 6: 1 2 3 − -->
        <button class="calc-btn num" data-action="digit" data-digit="1">1</button>
        <button class="calc-btn num" data-action="digit" data-digit="2">2</button>
        <button class="calc-btn num" data-action="digit" data-digit="3">3</button>
        <button class="calc-btn op"  data-action="op"    data-op="-">−</button>

        <!-- Row 7: 0 . ± + = -->
        <button class="calc-btn num" data-action="digit"   data-digit="0">0</button>
        <button class="calc-btn num" data-action="decimal">.</button>
        <button class="calc-btn sci" data-action="negate">±</button>
        <button class="calc-btn op"  data-action="op"      data-op="+">+</button>
        <button class="calc-btn eq"  data-action="equals"  aria-label="Equals">=</button>

      </div><!-- /keypad -->

      <!-- History drawer -->
      <div class="calc-history-panel" id="calc-history-panel">
        <div class="calc-history-label">
          <span class="text-dim">> CALC HISTORY</span>
          <button class="calc-history-clear-btn" id="calc-history-clear" aria-label="Clear history">[FLUSH]</button>
        </div>
        <div class="calc-history-list" id="calc-history-list">
          <div class="calc-history-empty text-dim">No computations logged yet.</div>
        </div>
      </div>

    </div><!-- /calc-card -->
  </div><!-- /calc-scene -->

</div><!-- /calc-outer-wrapper -->`;

    // Cache DOM refs after render
    this.scene     = document.getElementById('calc-scene');
    this.card      = document.getElementById('calc-card');
    this.exprLine  = document.getElementById('calc-expr-line');
    this.resultLine= document.getElementById('calc-result-line');
    this.errorOverlay   = document.getElementById('calc-error-overlay');
    this.errorMsg        = document.getElementById('calc-error-msg');
    this.destructOverlay = document.getElementById('calc-destruct-overlay');
    this.destructCount   = document.getElementById('calc-destruct-count');
    this.destructFill    = document.getElementById('calc-destruct-fill');
    this.historyList     = document.getElementById('calc-history-list');
  }

  // ================================================================
  // EVENT BINDING
  // ================================================================
  bindEvents() {
    if (!this.container) return;

    // ── Keypad button clicks ───────────────────────────────────────
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      if (this.isSelfDestructing) return;
      this.handleButtonAction(btn);
    });

    // ── Dismiss error overlay ──────────────────────────────────────
    document.getElementById('calc-error-dismiss')?.addEventListener('click', () => {
      this.clearError();
    });

    // ── Angle mode toggle ──────────────────────────────────────────
    document.getElementById('calc-mode-deg')?.addEventListener('click', () => this.setMode('deg'));
    document.getElementById('calc-mode-rad')?.addEventListener('click', () => this.setMode('rad'));

    // ── History clear ──────────────────────────────────────────────
    document.getElementById('calc-history-clear')?.addEventListener('click', () => {
      this.history = [];
      this.renderHistory();
    });

    // ── Keyboard input (only active when calc pane is visible) ─────
    this._keyHandler = (e) => this.handleKeyboard(e);
    document.addEventListener('keydown', this._keyHandler);

    // ── 3D tilt: mouse follow ─────────────────────────────────────
    if (!this.prefersReducedMotion && this.scene) {
      this.scene.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.scene.addEventListener('mouseleave', () => {
        this.targetTiltX = 0;
        this.targetTiltY = 0;
      });

      // Touch tilt for mobile
      this.scene.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        this.handlePointerMove(t.clientX, t.clientY);
      }, { passive: true });
    }
  }

  // ================================================================
  // BUTTON ACTIONS
  // ================================================================
  handleButtonAction(btn) {
    const action  = btn.dataset.action;
    const digit   = btn.dataset.digit;
    const fn      = btn.dataset.fn;
    const op      = btn.dataset.op;
    const val     = btn.dataset.val;

    // Visual press effect
    this.animateButtonPress(btn);
    terminalAudio?.playKeyClick?.();

    // If an error is showing, any key except dismiss clears it
    if (this.isError) this.clearError();

    switch (action) {
      case 'digit':       this.appendDigit(digit);  break;
      case 'op':          this.appendOp(op);         break;
      case 'func':        this.appendFunc(fn);       break;
      case 'const':       this.appendConst(val);     break;
      case 'decimal':     this.appendDecimal();      break;
      case 'negate':      this.negate();             break;
      case 'percent':     this.percent();            break;
      case 'factorial':   this.appendPostfix('!');   break;
      case 'squared':     this.appendPower2();       break;
      case 'power':       this.appendOp('^');        break;
      case 'paren-open':  this.appendRaw('(');       break;
      case 'paren-close': this.appendRaw(')');       break;
      case 'clear':       this.clear();              break;
      case 'backspace':   this.backspace();          break;
      case 'equals':      this.evaluate();           break;
    }
  }

  handleKeyboard(e) {
    // Only intercept when calc pane is active
    const pane = document.getElementById('pane-calculator');
    if (!pane || !pane.classList.contains('active')) return;

    // Don't steal from the terminal CLI input
    if (document.activeElement?.id === 'terminal-cli-input') return;

    if (this.isSelfDestructing) return;

    const key = e.key;
    const mapped = {
      '0':'digit-0','1':'digit-1','2':'digit-2','3':'digit-3',
      '4':'digit-4','5':'digit-5','6':'digit-6','7':'digit-7',
      '8':'digit-8','9':'digit-9',
      '+':'op-+','-':'op--','*':'op-×','/':'op-÷','%':'percent',
      '^':'op-^','(':'paren-open',')':'paren-close','.':'decimal',
      '!':'factorial',
      'Enter':'equals','=':'equals',
      'Backspace':'backspace','Delete':'clear','Escape':'clear',
    };

    const act = mapped[key];
    if (!act) return;

    e.preventDefault();
    if (this.isError) this.clearError();

    if (act.startsWith('digit-'))       this.appendDigit(act.slice(6));
    else if (act.startsWith('op-'))     this.appendOp(act.slice(3));
    else if (act === 'percent')         this.percent();
    else if (act === 'paren-open')      this.appendRaw('(');
    else if (act === 'paren-close')     this.appendRaw(')');
    else if (act === 'decimal')         this.appendDecimal();
    else if (act === 'factorial')       this.appendPostfix('!');
    else if (act === 'equals')          this.evaluate();
    else if (act === 'backspace')       this.backspace();
    else if (act === 'clear')           this.clear();
  }

  // ================================================================
  // INPUT MUTATIONS
  // ================================================================
  appendDigit(d) {
    // After evaluation, starting a new number resets expression
    if (this.justEvaluated) {
      this.expression = '';
      this.justEvaluated = false;
    }
    this.expression += d;
    this.updateDisplay();
  }

  appendOp(op) {
    this.justEvaluated = false;
    // Allow chaining: replace trailing operator
    if (this.expression && /[+\-×÷^%]$/.test(this.expression)) {
      this.expression = this.expression.slice(0, -1);
    }
    // If empty, treat minus as unary
    if (!this.expression && op !== '-') return;
    this.expression += op;
    this.updateDisplay();
  }

  appendFunc(fn) {
    this.justEvaluated = false;
    this.expression += `${fn}(`;
    this.updateDisplay();
  }

  appendConst(val) {
    if (this.justEvaluated) { this.expression = ''; this.justEvaluated = false; }
    this.expression += val;
    this.updateDisplay();
  }

  appendDecimal() {
    this.justEvaluated = false;
    // Find the current number token being typed
    const parts = this.expression.split(/[+\-×÷^%(,]/);
    const current = parts[parts.length - 1];
    if (!current.includes('.')) {
      if (!current) this.expression += '0';
      this.expression += '.';
    }
    this.updateDisplay();
  }

  appendPostfix(sym) {
    this.expression += sym;
    this.updateDisplay();
  }

  appendRaw(str) {
    this.justEvaluated = false;
    this.expression += str;
    this.updateDisplay();
  }

  appendPower2() {
    if (!this.expression) return;
    // Wrap last number or closing paren in (...)^2
    this.expression += '^2';
    this.updateDisplay();
  }

  negate() {
    if (!this.expression) return;
    if (this.expression.startsWith('-')) {
      this.expression = this.expression.slice(1);
    } else {
      this.expression = '-' + this.expression;
    }
    this.updateDisplay();
  }

  percent() {
    if (!this.expression) return;
    this.expression += '%';
    this.updateDisplay();
  }

  clear() {
    this.expression = '';
    this.justEvaluated = false;
    this.lastResult = null;
    this.clearError();
    this.updateDisplay();
    this.animateReset();
  }

  backspace() {
    if (this.justEvaluated) { this.clear(); return; }
    if (!this.expression) return;
    // Remove last character; if last chars form a function name, remove the whole thing
    const funcMatch = this.expression.match(/([a-z]+)\($$/);
    if (funcMatch) {
      this.expression = this.expression.slice(0, -funcMatch[0].length);
    } else {
      this.expression = this.expression.slice(0, -1);
    }
    this.updateDisplay();
  }

  setMode(mode) {
    this.angleMode = mode;
    CalcEngine.setAngleMode(mode);

    document.getElementById('calc-mode-deg')?.classList.toggle('active', mode === 'deg');
    document.getElementById('calc-mode-rad')?.classList.toggle('active', mode === 'rad');
    document.getElementById('calc-mode-deg')?.setAttribute('aria-pressed', mode === 'deg');
    document.getElementById('calc-mode-rad')?.setAttribute('aria-pressed', mode === 'rad');

    terminalAudio?.playKeyClick?.();
  }

  // ================================================================
  // EVALUATION
  // ================================================================
  evaluate() {
    if (!this.expression || this.isSelfDestructing) return;

    const result = CalcEngine.evaluate(this.expression);

    if (result.error) {
      // ── Division by Zero: self-destruct sequence ─────────────────
      if (result.error === 'DIV_ZERO') {
        this.triggerSelfDestruct(result.errorMessage);
        return;
      }
      // ── Other errors ─────────────────────────────────────────────
      this.showError(result.errorMessage);
      terminalAudio?.playError?.();
      this.animateError();
      return;
    }

    // ── 9+10 Easter Egg ───────────────────────────────────────────
    if (result.isEasterEgg) {
      this.showEasterEggResult(result);
      return;
    }

    // ── Normal result ─────────────────────────────────────────────
    const histEntry = { expr: this.expression, result: result.value };
    this.addHistory(histEntry);

    this.lastResult = result.value;
    this.expression = result.value;
    this.justEvaluated = true;

    this.updateDisplay(result.value);
    this.animateResult();
    terminalAudio?.playAccessGranted?.();
  }

  showEasterEggResult(result) {
    this.addHistory({ expr: this.expression, result: result.value, note: result.eggMessage });
    this.lastResult = result.value;
    this.expression = result.value;
    this.justEvaluated = true;

    // Show result first
    this.updateDisplay(result.value);
    this.animateResult();
    terminalAudio?.playAccessGranted?.();

    // Then briefly show the egg message in result line
    setTimeout(() => {
      if (this.resultLine) this.resultLine.textContent = result.eggMessage;
      this.resultLine?.classList.add('calc-easter-flash');
      setTimeout(() => {
        this.resultLine?.classList.remove('calc-easter-flash');
        if (this.resultLine) this.resultLine.textContent = result.value;
      }, 2200);
    }, 120);
  }

  // ================================================================
  // SELF-DESTRUCT SEQUENCE
  // ================================================================
  triggerSelfDestruct(errorMsg) {
    if (this.isSelfDestructing) return;
    this.isSelfDestructing = true;

    terminalAudio?.playError?.();

    const overlay = this.destructOverlay;
    if (!overlay) return;

    overlay.classList.add('active');
    this.card?.classList.add('calc-shake');

    // Overdrive the matrix rain
    matrixEngine?.triggerOverdrive?.(4000);

    let count = 3;
    this.destructCount.textContent = count;
    this.destructFill.style.width = '100%';

    const tick = () => {
      count--;
      if (count > 0) {
        this.destructCount.textContent = count;
        this.destructFill.style.width = `${(count / 3) * 100}%`;
        terminalAudio?.playError?.();
        setTimeout(tick, 1000);
      } else {
        // "Explosion"
        this.destructCount.textContent = '💥';
        this.destructFill.style.width = '0%';
        terminalAudio?.playMatrixWarp?.();

        setTimeout(() => {
          // Safe reset
          overlay.classList.remove('active');
          this.card?.classList.remove('calc-shake');
          this.isSelfDestructing = false;
          this.clear();
          // Show aftermath message in result line
          if (this.resultLine) this.resultLine.textContent = '...phew.';
          setTimeout(() => {
            if (this.resultLine) this.resultLine.textContent = '0';
          }, 1800);
        }, 800);
      }
    };

    setTimeout(tick, 1000);
  }

  // ================================================================
  // ERROR DISPLAY
  // ================================================================
  showError(msg) {
    this.isError = true;
    if (this.errorMsg) this.errorMsg.textContent = msg;
    this.errorOverlay?.classList.add('active');
  }

  clearError() {
    this.isError = false;
    this.errorOverlay?.classList.remove('active');
    this.expression = '';
    this.updateDisplay();
  }

  // ================================================================
  // DISPLAY UPDATE
  // ================================================================
  updateDisplay(resultOverride) {
    // Sub-line: the expression being typed
    const exprText = this.expression || '';
    if (this.exprLine) {
      this.exprLine.textContent = exprText || '\u00a0';
    }

    // Main result line
    if (this.resultLine) {
      if (resultOverride !== undefined) {
        this.resultLine.textContent = resultOverride;
      } else if (!this.expression) {
        this.resultLine.textContent = '0';
      } else {
        // Live-evaluate a partial expression for result preview
        // Only if it looks complete (ends in number, ), or constant)
        const endsOk = /[\d)πe!]$/.test(this.expression);
        if (endsOk && !this.justEvaluated) {
          const preview = CalcEngine.evaluate(this.expression);
          if (!preview.error && preview.value !== this.expression) {
            this.resultLine.textContent = preview.value;
          } else {
            this.resultLine.textContent = this.expression;
          }
        } else {
          this.resultLine.textContent = this.expression;
        }
      }
    }
  }

  // ================================================================
  // HISTORY
  // ================================================================
  addHistory(entry) {
    this.history.unshift(entry); // newest first
    if (this.history.length > 20) this.history.pop();
    this.renderHistory();
  }

  renderHistory() {
    if (!this.historyList) return;
    if (this.history.length === 0) {
      this.historyList.innerHTML = '<div class="calc-history-empty text-dim">No computations logged yet.</div>';
      return;
    }
    this.historyList.innerHTML = this.history.map(h => `
      <div class="calc-history-entry" role="listitem">
        <span class="calc-hist-expr text-dim">${this.escapeHtml(h.expr)}</span>
        <span class="calc-hist-eq text-accent">→</span>
        <span class="calc-hist-result">${this.escapeHtml(h.result)}</span>
        ${h.note ? `<span class="calc-hist-note text-dim">${this.escapeHtml(h.note)}</span>` : ''}
      </div>`).join('');

    // Click to recall a history entry
    this.historyList.querySelectorAll('.calc-history-entry').forEach((el, idx) => {
      el.addEventListener('click', () => {
        this.expression = this.history[idx].result;
        this.justEvaluated = true;
        this.updateDisplay();
        terminalAudio?.playKeyClick?.();
      });
    });
  }

  // ================================================================
  // 3D TILT ENGINE
  // ================================================================
  handleMouseMove(e) {
    if (this.prefersReducedMotion || !this.scene) return;
    this.handlePointerMove(e.clientX, e.clientY);
  }

  handlePointerMove(clientX, clientY) {
    const rect = this.scene.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (clientX - cx) / (rect.width / 2);   // -1 to 1
    const dy = (clientY - cy) / (rect.height / 2);  // -1 to 1

    // Max tilt: 10deg on desktop, less on small screens
    const maxTilt = window.innerWidth < 640 ? 4 : 10;
    this.targetTiltX = -dy * maxTilt;  // tilt toward cursor vertically
    this.targetTiltY =  dx * maxTilt;  // tilt toward cursor horizontally
  }

  startTiltLoop() {
    if (this.prefersReducedMotion) return;

    const loop = () => {
      this.rafId = requestAnimationFrame(loop);
      // Smooth lerp to target
      this.tiltX += (this.targetTiltX - this.tiltX) * 0.08;
      this.tiltY += (this.targetTiltY - this.tiltY) * 0.08;

      if (this.card) {
        this.card.style.transform = `
          rotateX(${this.tiltX}deg)
          rotateY(${this.tiltY}deg)
          translateZ(0)
        `;
      }
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stopTiltLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // ================================================================
  // ANIMATIONS
  // ================================================================
  animateButtonPress(btn) {
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 120);
  }

  animateResult() {
    this.resultLine?.classList.add('calc-result-pop');
    setTimeout(() => this.resultLine?.classList.remove('calc-result-pop'), 300);
  }

  animateError() {
    this.card?.classList.add('calc-shake-light');
    setTimeout(() => this.card?.classList.remove('calc-shake-light'), 500);
  }

  animateReset() {
    this.resultLine?.classList.add('calc-reset-flash');
    setTimeout(() => this.resultLine?.classList.remove('calc-reset-flash'), 300);
  }

  // ================================================================
  // UTILITIES
  // ================================================================
  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  destroy() {
    this.stopTiltLoop();
    document.removeEventListener('keydown', this._keyHandler);
  }
}

// ──────────────────────────────────────────────────────────────────
// Instantiate when the calc pane is first shown (lazy init)
// ──────────────────────────────────────────────────────────────────
let calcInstance = null;

function initCalcIfNeeded() {
  if (!calcInstance) {
    calcInstance = new ScientificCalculator('calc-container');
  }
}
