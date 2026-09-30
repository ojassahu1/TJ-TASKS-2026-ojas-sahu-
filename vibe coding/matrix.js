/**
 * ====================================================================
 * MATRIX DIGITAL RAIN ENGINE
 * ====================================================================
 * High-performance, responsive HTML5 Canvas digital rain stream simulator.
 * Features multi-depth streams, randomized character mutation, bright lead
 * glyphs with soft phosphor glows, overdrive mode, and viewport responsiveness.
 */

class MatrixRain {
  constructor(canvasId = "matrix-canvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.animationFrameId = null;
    this.lastTime = 0;
    this.fpsInterval = 1000 / 30; // Target ~30-33 FPS for authentic retro terminal feel & battery efficiency

    // Matrix Glyph Set: Japanese Katakana, Matrix digits, Latin, Math, Runes
    this.glyphs = (
      "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ" +
      "0123456789" +
      "ABCDEFZXY0101" +
      "<>[]{}+=*~#@!?:;%$_|/\\"
    ).split("");

    this.fontSize = 16;
    this.columns = [];
    this.isOverdrive = false;
    this.overdriveTimeout = null;
    this.isPaused = false;
    this.colorTheme = "matrix-green"; // options: matrix-green, cyber-amber, ghost-cyan, blood-red

    // Color definitions based on themes
    this.themes = {
      "matrix-green": {
        lead: "#ffffff",
        leadGlow: "#00ff66",
        bright: "#00ff66",
        dim: "#008f37",
        fade: "#003b14",
        bgFade: "rgba(3, 8, 4, 0.08)"
      },
      "cyber-amber": {
        lead: "#ffffff",
        leadGlow: "#ffb000",
        bright: "#ffb000",
        dim: "#b37b00",
        fade: "#4d3400",
        bgFade: "rgba(10, 6, 2, 0.08)"
      },
      "ghost-cyan": {
        lead: "#ffffff",
        leadGlow: "#00e5ff",
        bright: "#00e5ff",
        dim: "#008da0",
        fade: "#003a42",
        bgFade: "rgba(2, 8, 12, 0.08)"
      },
      "blood-red": {
        lead: "#ffffff",
        leadGlow: "#ff1744",
        bright: "#ff1744",
        dim: "#99001f",
        fade: "#40000d",
        bgFade: "rgba(12, 2, 4, 0.08)"
      }
    };

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      this.fpsInterval = 1000 / 12; // Lower framerate for reduced motion
    }

    this.init();
  }

  init() {
    this.resize();
    this.bindEvents();
    this.start();
  }

  resize() {
    if (!this.canvas) return;

    // Support devicePixelRatio safely for sharp text without burning GPU
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Responsive font size: slightly smaller on mobile
    this.fontSize = width < 480 ? 13 : width < 768 ? 14 : 16;
    const colCount = Math.floor(width / this.fontSize);

    // Initialize or adapt columns
    this.columns = [];
    for (let i = 0; i < colCount; i++) {
      this.columns.push({
        x: i * this.fontSize,
        y: Math.random() * -100, // Staggered starting points above viewport
        speed: (Math.random() * 0.75 + 0.6) * (this.isOverdrive ? 2.5 : 1),
        charLength: Math.floor(Math.random() * 20 + 8),
        opacity: Math.random() * 0.5 + 0.5,
        changeFreq: Math.floor(Math.random() * 6 + 2),
        counter: 0,
        currentChar: this.getRandomGlyph()
      });
    }

    // Initial fill with solid background so text starts clean
    const currentTheme = this.themes[this.colorTheme] || this.themes["matrix-green"];
    this.ctx.fillStyle = "#020704";
    this.ctx.fillRect(0, 0, width, height);
  }

  getRandomGlyph() {
    return this.glyphs[Math.floor(Math.random() * this.glyphs.length)];
  }

  bindEvents() {
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.resize(), 120);
    });

    // Handle tab visibility to pause rendering when inactive (battery saving)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });
  }

  draw(currentTime) {
    if (this.isPaused) return;

    this.animationFrameId = requestAnimationFrame((t) => this.draw(t));

    const elapsed = currentTime - this.lastTime;
    if (elapsed < this.fpsInterval) return;

    this.lastTime = currentTime - (elapsed % this.fpsInterval);

    const theme = this.themes[this.colorTheme] || this.themes["matrix-green"];
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Semi-transparent blackout creating trailing fade
    this.ctx.fillStyle = this.isOverdrive ? "rgba(2, 6, 3, 0.16)" : theme.bgFade;
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.font = `${this.fontSize}px 'Courier New', monospace`;

    for (let i = 0; i < this.columns.length; i++) {
      const col = this.columns[i];

      // Randomly mutate character
      col.counter++;
      if (col.counter % col.changeFreq === 0) {
        col.currentChar = this.getRandomGlyph();
      }

      const drawY = col.y * this.fontSize;

      // Draw the bright leading character with glow
      this.ctx.save();
      this.ctx.shadowColor = theme.leadGlow;
      this.ctx.shadowBlur = this.isOverdrive ? 14 : 7;
      this.ctx.fillStyle = theme.lead;
      this.ctx.fillText(col.currentChar, col.x, drawY);
      this.ctx.restore();

      // Draw a secondary trailing character just above it
      if (col.y > 1) {
        this.ctx.fillStyle = theme.bright;
        this.ctx.fillText(this.getRandomGlyph(), col.x, drawY - this.fontSize);
      }

      // Draw dimmer trail characters further up
      if (col.y > 4) {
        this.ctx.fillStyle = theme.dim;
        this.ctx.fillText(this.getRandomGlyph(), col.x, drawY - this.fontSize * 3);
      }

      // Move stream downward
      col.y += col.speed;

      // Reset stream if past bottom of screen
      if (drawY > height && Math.random() > 0.975) {
        col.y = 0;
        col.speed = (Math.random() * 0.75 + 0.6) * (this.isOverdrive ? 2.5 : 1);
        col.charLength = Math.floor(Math.random() * 20 + 8);
      }
    }
  }

  start() {
    if (!this.animationFrameId) {
      this.lastTime = performance.now();
      this.animationFrameId = requestAnimationFrame((t) => this.draw(t));
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  triggerOverdrive(durationMs = 6000) {
    this.isOverdrive = true;
    for (let col of this.columns) {
      col.speed = (Math.random() * 1.5 + 1.8);
    }

    if (this.overdriveTimeout) clearTimeout(this.overdriveTimeout);
    this.overdriveTimeout = setTimeout(() => {
      this.isOverdrive = false;
      for (let col of this.columns) {
        col.speed = Math.random() * 0.75 + 0.6;
      }
    }, durationMs);
  }

  setTheme(themeName) {
    if (this.themes[themeName]) {
      this.colorTheme = themeName;
    }
  }
}

// Global instance handle
let matrixEngine = null;
document.addEventListener("DOMContentLoaded", () => {
  matrixEngine = new MatrixRain("matrix-canvas");
});

