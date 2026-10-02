/**
 * ====================================================================
 * RETRO TERMINAL AUDIO SYNTHESIZER (Web Audio API)
 * ====================================================================
 * Synthesizes vintage mechanical keystrokes, CRT beeps, modem handshakes,
 * and cyberpunk chimes without any external audio dependencies.
 */

class TerminalAudio {
  constructor() {
    this.ctx = null;
    this.enabled = false; // Off by default to respect user audio preferences
    this.masterGain = null;

    // Check localStorage for saved sound preference
    const saved = localStorage.getItem("matrix_terminal_audio");
    if (saved === "true") {
      this.enabled = true;
    }
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.24;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggle() {
    return this.setEnabled(!this.enabled);
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    localStorage.setItem("matrix_terminal_audio", String(this.enabled));
    const button = document.getElementById("audio-toggle-btn");
    if (button) {
      button.textContent = this.enabled ? "AUDIO: ON" : "AUDIO: OFF";
      button.setAttribute("aria-pressed", String(this.enabled));
    }
    if (this.enabled) {
      this.ensureContext();
      if (this.masterGain) this.masterGain.gain.value = 0.24;
      this.playAccessGranted();
    } else if (this.ctx && this.masterGain) {
      this.masterGain.gain.value = 0;
    }
    return this.enabled;
  }

  playEasterEgg(name) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const cues = {
      konami: { type: "triangle", notes: [[392, 0], [523, 0.07], [659, 0.14], [1047, 0.23]] },
      "click-hunt": { type: "sine", notes: [[880, 0], [659, 0.09], [523, 0.18]] },
      "terminal-click": { type: "square", notes: [[1175, 0], [1568, 0.07], [880, 0.16]] },
      "terminal-secret": { type: "square", notes: [[1568, 0], [784, 0.045], [1175, 0.1], [523, 0.17]] },
      calculator: { type: "triangle", notes: [[659, 0], [784, 0.08], [1245, 0.16], [1109, 0.25]] },
      coffee: { type: "sine", notes: [[330, 0], [494, 0.1], [392, 0.21]] },
      "hire-me": { type: "triangle", notes: [[440, 0], [554, 0.08], [659, 0.16]] },
      "red-pill": { type: "sawtooth", notes: [[196, 0], [392, 0.12], [784, 0.24]] },
      "blue-pill": { type: "sine", notes: [[587, 0], [554, 0.12], [440, 0.24]] },
      "self-destruct": { type: "square", notes: [[220, 0], [220, 0.14], [165, 0.28]] },
      "self-destruct-impact": { type: "sawtooth", notes: [[110, 0], [73, 0.08], [55, 0.16]] }
    };
    const cue = cues[name];
    if (!cue) return;

    const now = this.ctx.currentTime;
    cue.notes.forEach(([frequency, offset]) => {
      const start = now + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = cue.type;
      osc.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.055, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 0.13);
    });
  }

  // Short mechanical key click
  playKeyClick() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    // Slight random pitch variation like real mechanical switches
    osc.frequency.setValueAtTime(800 + Math.random() * 400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.035);
  }

  // Terminal Return / Command Execution Beep
  playEnter() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.04); // A5

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.11);
  }

  // Futuristic Access Granted Chime
  playAccessGranted() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.05);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime + index * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.05 + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + index * 0.05);
      osc.stop(this.ctx.currentTime + index * 0.05 + 0.2);
    });
  }

  // Access Denied / Error Buzzer
  playError() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.23);
  }

  // Matrix Overdrive Warp Sound
  playMatrixWarp() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.46);
  }

  // Hollywood Hacker Data Stream
  playDataStream() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(600 + Math.random() * 1200, this.ctx.currentTime + i * 0.04);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.04 + 0.035);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(this.ctx.currentTime + i * 0.04);
      osc.stop(this.ctx.currentTime + i * 0.04 + 0.04);
    }
  }
}

const terminalAudio = new TerminalAudio();

