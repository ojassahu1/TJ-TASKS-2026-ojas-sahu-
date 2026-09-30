# OJAS.OS // Developer Operating System ⚡

> "Building things that probably shouldn't work... but do."

A high-performance, fully responsive developer portfolio presented as a living operating system. OJAS.OS combines the existing Matrix terminal, data-driven modules, digital rain, command palette, and scientific calculator into a discoverable cyberpunk interface—built with **HTML5, CSS3, and Vanilla JavaScript** with zero dependencies.

---

## 🌟 Key Features

* **🟢 Authentic Matrix Digital Rain**:
  * Real-time canvas simulation powered by `requestAnimationFrame`.
  * Dynamic multi-depth streams, randomized glyph mutation (Japanese Katakana, matrix digits, math symbols, runes).
  * Glowing lead characters and soft trailing phosphor fade.
  * Overdrive acceleration mode (`ENTER THE MATRIX` / `matrix` command).
  * Automatic debounced viewport resize handling.
  * Non-blocking background (`pointer-events: none`).

* **💻 Interactive Hacker Terminal Shell (`CommandTerminal`)**:
  * Functional CLI with a context-aware prompt such as `identity@ojas-os:~$`.
  * Command history navigation with `ArrowUp` and `ArrowDown`.
  * Command auto-completion via `Tab`.
  * Rich formatted output, ASCII art, and humor responses.

* **🔊 Retro Web Audio API Synthesizer**:
  * Zero external sound assets! Synthesizes vintage mechanical switch clicks, CRT return beeps, modem handshakes, and access-granted chimes in real-time.
  * Includes an instant toggle button (`[AUDIO: ON / OFF]`) with state preserved in `localStorage`.

* **📺 CRT Scanline & Phosphor Filter**:
  * Authentic retro tube display scanlines and screen vignette.
  * Can be toggled on/off with one click (`[CRT: ON / OFF]`).

* **🎨 4 Hacker Color Themes**:
  * `Matrix Green` (Default)
  * `Cyber Amber`
  * `Ghost Cyan`
  * `Blood Red`
  * Switchable via the UI dropdown or the `theme <name>` command.

* **📱 100% Fluid & Mobile-First Responsive**:
  * Tested seamlessly across viewports: `320px`, `375px`, `390px`, `430px`, `768px`, `1024px`, `1440px`.
  * Guaranteed **zero horizontal scrolling or overflow**.
  * Accessible tap targets, touch-friendly navigation, and adaptive canvas scaling.

* **⚙️ Single Source of Truth (`data.js`)**:
  * Easily update your name, role, bio, skills, projects, contact info, and Easter egg quotes in seconds without touching CSS or core logic.

* **🧮 Quantum Scientific Calculator**:
  * A theme-aware scientific calculator with static 3D depth styling, tactile keys, DEG/RAD trigonometry, calculation history, keyboard input, and a bounded shunting-yard expression engine (no `eval()`).
  * Supports parentheses, percentage, factorial, powers, square roots, `sin`, `cos`, `tan`, `log`, `ln`, π, and e.
  * Division by zero triggers a harmless calculator-local visual simulation. `9 + 10` evaluates to `19`; the Easter-egg message keeps the joke separate from the mathematical result.

* **⌨️ Accessible Overlay Controls**:
  * `Esc` closes the topmost active layer in order: boot sequence, command palette, modal, calculator alert, then fullscreen terminal frame.
  * Closing a modal or fullscreen frame restores focus to its triggering control; ordinary terminal and calculator shortcuts remain available when no overlay is open.

* **🖥️ OJAS.OS System Layer**:
  * A persistent module status display, environment modes (`Matrix`, `Cyber`, `Terminal`, `Minimal`, and `Void`), contextual terminal prompts, and restrained system notifications make the interface feel alive without hiding the portfolio.
  * Returning visitors skip the cinematic boot sequence automatically; `[ RESTART OJAS.OS ]` replays it on demand.

* **⌘ Global Command Palette**:
  * Press `/` or `Ctrl + K` from anywhere outside a text field to search modules and run system actions.
  * Navigate results with `↑` / `↓`, execute with `Enter`, and dismiss with `Esc`.

---

## 🕹️ Interactive Terminal Commands

Visitors can type commands directly into the terminal prompt:

| Command | Action / Response |
| :--- | :--- |
| `help` | Prints the comprehensive matrix command directory |
| `about` | Displays developer bio, role, education, and mission statement |
| `skills` | Renders technical capabilities with `[OK]` status badges and ASCII bars |
| `projects` | Lists production deployments (`projects <id>` shows specific blueprint) |
| `contact` | Reveals direct encrypted communication channels & links |
| `whoami` | Shows identity: *"Developer / Human... probably."* |
| `matrix` | Engages overdrive rain speed, screen warp distortion, and audio effect |
| `hack` | Executes Hollywood mainframe intrusion sequence with progress bar |
| `coffee` | Brews emergency developer espresso with ASCII art & caffeine telemetry |
| `diagnostic` | Shows simulated profile telemetry; it does not read hardware metrics |
| `quote` | Generates random developer wisdom from coding legends |
| `sudo <cmd>` | Checks root permissions (`sudo hire-me` triggers interview verification!) |
| `ls` | Lists virtual files (`about.txt`, `skills.json`, `hire_ojas.exe`, `secret_flag.dat`) |
| `cat <file>` | Reads content of virtual files |
| `theme <name>` | Switches theme (`green`, `amber`, `cyan`, `red`) |
| `audio <on/off>` | Toggles synthesized keystroke sound effects |
| `date` | Displays Earth UTC & Matrix cycle epoch time |
| `clear` | Clears terminal screen buffer |

---

## ⌨️ Keyboard Controls

| Context | Shortcut | Action |
| :--- | :--- | :--- |
| Any active overlay | `Esc` | Dismisses only the topmost active overlay and restores focus where applicable |
| Terminal CLI | `Enter` | Runs the typed command |
| Terminal CLI | `↑` / `↓` | Moves through command history |
| Terminal CLI | `Tab` | Autocompletes a matching command |
| Quantum Calculator | `0`–`9`, `.`, `+`, `-`, `*`, `/`, `^`, `(`, `)`, `%`, `!` | Enters a scientific expression |
| Quantum Calculator | `Enter` / `=` | Evaluates the expression |
| Quantum Calculator | `Backspace` | Removes the previous input |
| Quantum Calculator | `Esc`, `Delete` | Clears the current calculator input when no overlay is active |
| OJAS.OS | `/` or `Ctrl + K` | Opens the global command palette |

---

## 🚀 Interactive Quick Actions

Quick-action buttons provide instant access to humorous developer interactions:

1. **`[ ACCESS PROFILE ]`**:

   ```text
   ACCESS GRANTED.

   Unfortunately, there is nothing here
   that can fix your code at 3 AM.
   ```

2. **`[ RUN DIAGNOSTIC ]`**:

   ```text
   RUNNING DIAGNOSTIC...

   Brain: 12%
   RAM: Somehow full
   Coffee: CRITICAL
   Bugs: ∞
   ```

3. **`[ PRODUCTIVITY +0.0001% ]`**:

   ```text
   SYSTEM MESSAGE:
   "Congratulations. You clicked a button.
   Your productivity has increased by 0.0001%."
   ```

4. **`[ ENTER THE MATRIX ]`**: Overdrives digital rain + warp sound.
5. **`[ HACK THE SYSTEM ]`**: Hollywood cyber-hack simulation.
6. **`[ RED PILL / BLUE PILL ]`**: Secret choice modal.

---

## 🐇 Easter Eggs

* **Konami Code**: Press `↑` `↑` `↓` `↓` `←` `→` `←` `→` `B` `A` anywhere on the page to unlock **God Mode** / Operator Root Clearance!
* **`sudo hire-me`**: Unlocks candidate telemetry verification and triggers a direct invitation dispatch link.
* **Random Interaction Counter**: After interacting 25 times:

  ```text
  THE SYSTEM HAS BEEN WATCHING YOU.

  Just kidding.

  It's JavaScript.
  ```

---

## 📁 File Structure

```text
vibe coding/
├── index.html       # Semantic HTML5 structure with accessible panels & canvas
├── style.css        # Cyberpunk terminal styling, themes, CRT scanlines, responsive rules
├── data.js          # Central configuration object for profile, projects, and skills
├── matrix.js        # Matrix digital rain canvas animation engine
├── audio.js         # Retro Web Audio API keystroke synthesizer
├── terminal.js      # CLI command processor, history, and autocomplete
├── app.js           # Core application coordinator & event controller
├── calculator-engine.js # Safe scientific expression parser and evaluator
├── calculator.js    # Calculator UI controller and interaction effects
├── os.js            # OJAS.OS state, command palette, modes, and notifications
└── README.md        # Documentation and guide
```

---

## 🌐 Running Locally

No build tools, Node modules, or bundle steps are required!

1. Double-click `index.html` to open directly in any browser.
2. Or serve with any static web server:

   ```bash
   # Using Python
   python -m http.server 8000

   # Or using npx
   npx serve .
   ```

3. Open `tj-tasks-2026-ojas-sahu-vibe-coding.vercel.app` in your browser.

The site is static and requires no package installation.

