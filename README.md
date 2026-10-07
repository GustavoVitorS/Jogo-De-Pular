# Jogo de Pular — V3.4 Zigzag Ascension

A lightweight arcade game built with **HTML, CSS and Vanilla JavaScript**, now featuring two distinct game modes while preserving the visual identity and movement style of the original project.

The project began as a very simple jumping prototype and evolved into a responsive arcade experience with an animated character, mobile landscape support, power-ups, progression, a mode-selection menu and the new **Ascension Mode**.

## Screenshots

### Current Mode Selection Menu

![Mode selection menu](./assets/images/menu-modos.png)

### Classic Mode

![Classic Mode gameplay](./assets/images/gameplay-classico.png)

### Ascension Mode

![Ascension Mode gameplay](./assets/images/gameplay-ascensao.png)

## From the First Version to V3.4

The original version was intentionally minimal: a basic play area and an early foundation for the jumping mechanic.

![First version of Jogo de Pular](./assets/images/first-version.png)

Since then, the project has grown considerably while keeping the same core idea: **simple controls, precise timing and increasingly difficult challenges**.

### Main improvements since the first version

- complete visual redesign with a purple/pink arcade identity;
- animated player character with moving legs and jump/landing reactions;
- richer background with stars, lighting, layered mountains and parallax depth;
- polished HUD with score, high score and level/stage information;
- procedural obstacle generation;
- short and high jump mechanics;
- coins and temporary power-ups;
- progressive game speed and difficulty;
- local high-score persistence;
- sound generated with Web Audio;
- responsive desktop, tablet and mobile layouts;
- mobile Orientation Gate with landscape-first gameplay;
- fullscreen/orientation-lock support when allowed by the browser;
- a new mode-selection menu;
- the original endless-runner experience preserved as **Classic Mode**;
- a completely new **Ascension Mode** with manual movement, vertical progression, falling hazards and checkpoints.

---

## Game Flow

```text
Open the game
   ↓
Mobile in portrait? → Orientation Gate → Landscape
   ↓
Mode Selection Menu
   ├── Mode 1 — Classic
   └── Mode 2 — Ascension
```

On desktop, the game opens directly on the mode-selection menu.

On phones, portrait orientation first displays the animated landscape warning. Once the device enters landscape, the mode-selection menu becomes available.

---

## Mode 1 — Classic

Classic Mode preserves the gameplay and visual identity established in V2.2 instead of replacing it with a new implementation.

### Preserved from V2.2

- original purple player character;
- animated legs while running;
- visual jump and landing reactions;
- purple/pink environment;
- stars, glow, moonlight and layered mountain scenery;
- original ground design;
- HUD;
- short/high jump physics;
- procedural obstacle generation;
- collectible coins;
- shield, slow-motion and double-score power-ups;
- progressive speed increase;
- local high score;
- Web Audio effects;
- touch controls from the mobile version.

The main additions are integration with the new menu and the ability to return to mode selection during gameplay.

### Desktop controls

- **Space** — start, jump and restart.
- Quick press — short jump.
- Hold — higher jump.

---

## Mode 2 — Ascension

Ascension Mode uses the **same animated character and visual language as Classic Mode**, but changes the gameplay into a vertical arcade challenge.

The goal is to climb through a sequence of platforms attached to the left and right sides of the arena while avoiding hazards falling from above.

The player must reach the checkpoint to complete the current stage and continue into a faster, more dangerous one.

### Core mechanics

- vertical arcade progression;
- platforms anchored to the **left and right walls**;
- mandatory zigzag progression between sides;
- only the next valid platform in the sequence advances the route;
- future platforms cannot be used as vertical shortcuts before their turn;
- previously completed platforms remain available as recovery points;
- controlled platform generation to keep every jump reachable;
- manual movement with `WASD` or arrow keys;
- **Space** is the dedicated jump command;
- horizontal movement on platforms and while airborne;
- directional character facing, so the player visibly turns left/right instead of appearing to moonwalk;
- leg animation reacts to movement speed and direction;
- light upward adjustment with `W` while airborne;
- fast fall / platform drop with `S`;
- variable jump height depending on how long Space is held;
- vertical camera/scroll progression;
- falling blocks and projectiles;
- warning indicators before dangerous objects enter the arena;
- increasingly frequent and faster hazards each stage;
- coins placed on riskier movement routes;
- checkpoints at the end of platform sequences;
- checkpoint bonuses without resetting the current score;
- a high score stored separately from Classic Mode.

### Why the zigzag route matters

V3.4 specifically prevents players from completing a stage by repeatedly jumping upward in a straight line.

Progress now requires alternating across the arena:

```text
LEFT PLATFORM
      ↗
        PLAYER
              ↗
                RIGHT PLATFORM
                      ↓
                PLAYER
              ↙
LEFT PLATFORM
```

The camera only advances after a valid landing on the expected platform, which makes positioning and timing part of the challenge.

### Desktop controls

| Input | Action |
| --- | --- |
| `A / D` | Move left/right on platforms and control horizontal movement in the air |
| `W` | Small upward adjustment while airborne |
| `S` | Fast fall; drop from a platform when grounded |
| `Space` | Jump |
| Arrow keys | Alternative directional controls |

Releasing Space early reduces jump height; holding it longer provides additional lift.

### Ascension power-ups

- **Shield** — absorbs one collision.
- **Slow Time** — temporarily slows falling hazards.
- **2× Score** — temporarily doubles score gains.
- **Second Chance** — returns the player to the last safe platform with brief invulnerability.

---

## Mobile and Tablet Controls

The game is designed around **landscape orientation** on mobile devices.

### Classic Mode

Classic Mode keeps the V2.2 touch jump control.

### Ascension Mode

Ascension Mode provides:

- a four-direction touch pad corresponding to `WASD`;
- a dedicated **JUMP** button;
- short/long jump behavior equivalent to desktop;
- touch targets adapted for compact landscape displays.

---

## Mode Selection Menu

The main menu is built with real HTML/CSS game elements rather than using concept art as a static background.

It provides two cards:

### Mode 1 — Classic

The original endless-runner challenge focused on timing, jumping and obstacle avoidance.

### Mode 2 — Ascension

A vertical challenge focused on manual movement, alternating platforms, falling hazards, coins, power-ups and checkpoints.

On large screens the cards are displayed side by side. Compact landscape devices use a dedicated reduced layout designed to remain usable even around **568×320**.

---

## Mobile Orientation Gate

The mobile experience preserves the landscape system introduced in V2.2.

1. A smartphone opened in portrait displays the animated **Play in landscape** gate.
2. On the first valid interaction, fullscreen is requested when supported.
3. `screen.orientation.lock("landscape")` is requested when available.
4. If the browser blocks automatic rotation, the user can rotate the phone manually.
5. Landscape orientation unlocks the mode-selection menu.
6. Returning to portrait during gameplay pauses the game and restores the gate.
7. Returning to landscape resumes the game.

The implementation also uses `VisualViewport`, safe-area insets, dynamic viewport sizing and pointer/touch detection rather than relying exclusively on `userAgent`.

> Browser restrictions still apply. Safari/iOS may require the device to be rotated manually.

---

## Responsive Design

The gameplay keeps a logical resolution of **1200 × 600**, while the interface scales around that logical game space instead of changing Classic Mode physics.

Responsive techniques include:

- `aspect-ratio`;
- CSS Grid and Flexbox;
- `clamp()`;
- dynamic viewport units;
- `VisualViewport`;
- `env(safe-area-inset-*)`;
- dedicated compact-landscape layouts.

### Tested viewport targets

```text
Portrait mobile
320×568
360×640
390×844
412×915

Landscape mobile
568×320
640×360
667×375
740×360
844×390
915×412

Desktop
1024×768
1280×720
1366×768
1440×900
1920×1080
2560×1080 (ultrawide)
```

---

## Local Progress

The project uses `localStorage` and does not require a backend.

- Classic Mode high score: `jdp-v31-classic-best`
- Ascension Mode high score: `jdp-v31-ascension-best`
- Legacy Classic high score migration: `jdp-v2-best`
- Audio preference remains compatible with the V2.2 implementation.

---

## Game State and Mode Switching

The project uses a single main `requestAnimationFrame` loop.

Supported flows include:

```text
Menu → Classic → Menu → Ascension
Menu → Ascension → Menu → Classic
```

Changing modes clears gameplay entities and temporary state before loading the next mode, preventing duplicated loops, hazards or input handlers in the background.

---

## Pause and Game Over

Both modes support:

- pause;
- resume;
- return to menu;
- restart after Game Over.

Ascension Mode also reports stage progress, collected coins and reached checkpoints.

---

## Project Structure

The GitHub-ready version keeps only `index.html` and `README.md` in the repository root. Everything else lives inside `assets/`.

```text
Jogo-De-Pular/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── javascript/
    │   └── script.js
    ├── images/
    │   ├── favicon.svg
    │   ├── icon-192.png
    │   ├── icon-512.png
    │   ├── apple-touch-icon.png
    │   ├── first-version.png
    │   ├── menu-modos.png
    │   ├── gameplay-classico.png
    │   └── gameplay-ascensao.png
    └── manifest.webmanifest
```

---

## Run Locally

No installation or build process is required.

You can open `index.html` directly in a modern browser, but running a local HTTP server is recommended for fullscreen, PWA and orientation APIs.

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## GitHub Pages

1. Replace the repository files with this version.
2. Commit and push your changes.
3. Open **Settings → Pages**.
4. Publish the repository root from the desired branch.
5. Wait for deployment to finish.

All project paths are relative, so the game remains compatible with GitHub Pages project subdirectories.

---

## Manifest / PWA

`assets/manifest.webmanifest` keeps the game configured for fullscreen landscape use:

```json
{
  "display": "fullscreen",
  "orientation": "landscape"
}
```

Orientation locking still depends on browser and operating-system support.

---

## Version Evolution

### V1 — First Prototype

The project started as a small experimental jumping prototype with a basic play area and the first foundation for player movement.

### V2.2 — Mobile Landscape Foundation

V2.2 established the modern identity of the game:

- animated purple character;
- animated legs;
- richer scenery;
- Classic Mode gameplay;
- short/high jumps;
- mobile landscape experience;
- touch controls;
- Orientation Gate;
- PWA support.

### V3.1 — Preserve & Ascend

- introduced the two-mode architecture;
- added the mode-selection menu;
- added the initial Ascension Mode while deliberately preserving Classic Mode's V2.2 visual identity.

### V3.2 — Skill Ascension

- removed automatic horizontal assistance;
- added manual `WASD` / arrow controls;
- kept Space as the dedicated jump command;
- added horizontal ground and air control;
- added `W` airborne adjustment and `S` fast fall/drop;
- spread coins and power-ups across riskier routes;
- added a mobile D-pad for Ascension Mode.

### V3.3 — Directional Ascension

- added real character facing based on movement direction;
- added body lean and movement-driven leg animation;
- removed the visual "moonwalk" effect;
- narrowed platforms and anchored them to the arena walls;
- changed progress from raw height to valid platform landings;
- moved collectibles further into the cross-arena route;
- improved air-control responsiveness.

### V3.4 — Zigzag Ascension

V3.4 focuses on making Ascension Mode a real alternating traversal challenge:

- platforms remain anchored to the left and right walls;
- the route alternates **left ↔ right**;
- only the expected next platform advances progression;
- future platforms cannot be used as premature vertical shortcuts;
- completed platforms remain available as recovery points;
- horizontal range and platform spacing were recalibrated for fair cross-arena jumps;
- checkpoint progression requires the correct zigzag route;
- the animated V2.2 character, Classic Mode scenery and original visual direction remain preserved.

---

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Web Audio API
- Local Storage
- Screen Orientation API
- Fullscreen API
- Visual Viewport API
- Progressive Web App manifest

No frameworks, npm packages, backend services or paid APIs are required.

---

## Browser Compatibility

Use a current version of Chrome, Brave, Edge, Firefox or Safari.

- **Desktop:** keyboard/mouse, no Orientation Gate.
- **Android:** fullscreen and landscape lock are requested when supported.
- **iPhone/iPad/Safari:** manual rotation may still be required.
- **Installed PWA:** the manifest requests landscape/fullscreen presentation.

---

## License

This repository currently does not declare a license. Add one before redistributing the project under explicit terms or accepting external contributions.
