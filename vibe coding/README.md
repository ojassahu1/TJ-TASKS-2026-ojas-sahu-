# Matrix-Inspired Developer Terminal // Bio-Card ⚡

> "Building things that probably shouldn't work... but do."

A high-performance, fully responsive, interactive personal developer portfolio and bio-card crafted with an authentic **cyberpunk / Matrix hacker terminal aesthetic**. Built using **HTML5, CSS3, and Vanilla JavaScript** with zero external bloatware.

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
  * Functional CLI with realistic prompt: `guest@ojas-matrix:~$ `.
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
| `diagnostic`| Runs hardware diagnostics: *Brain: 12% \| RAM: Somehow full \| Coffee: CRITICAL \| Bugs: ∞* |
| `quote` | Generates random developer wisdom from coding legends |
| `sudo <cmd>` | Checks root permissions (`sudo hire-me` triggers interview verification!) |
| `ls` | Lists virtual files (`about.txt`, `skills.json`, `hire_ojas.exe`, `secret_flag.dat`) |
| `cat <file>`| Reads content of virtual files |
| `theme <name>`| Switches theme (`green`, `amber`, `cyan`, `red`) |
| `audio <on/off>`| Toggles synthesized keystroke sound effects |
| `date` | Displays Earth UTC & Matrix cycle epoch time |
| `clear` | Clears terminal screen buffer |

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
└── README.md        # Documentation and guide
```

---

## 🛠️ How to Customize

All portfolio details are located in `data.js`. Simply open `data.js` to customize:
* `identity.name`: Your name
* `identity.role`: Your title / focus
* `identity.tagline`: Your motto or punchline
* `skills`: Array of categories with skills, proficiency percentages, and status tags
* `projects`: Array of projects with description, tech tags, and links
* `contact`: Email, GitHub, LinkedIn, and portfolio URLs
* `diagnostics`: Custom hardware/humor stats

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
3. Open `http://localhost:8000` in your browser.

