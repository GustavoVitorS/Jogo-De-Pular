(() => {
  "use strict";

  const canvas = document.querySelector("#gameCanvas");
  const context = canvas.getContext("2d", { alpha: false });

  const ui = {
    hud: document.querySelector("#hud"),
    modeMenu: document.querySelector("#modeMenu"),
    playClassicButton: document.querySelector("#playClassicButton"),
    playAscensionButton: document.querySelector("#playAscensionButton"),
    score: document.querySelector("#scoreValue"),
    best: document.querySelector("#bestValue"),
    level: document.querySelector("#levelValue"),
    levelLabel: document.querySelector("#levelLabel"),
    startBest: document.querySelector("#startBestValue"),
    startBestLabel: document.querySelector("#startBestLabel"),
    finalScore: document.querySelector("#finalScoreValue"),
    finalCoins: document.querySelector("#finalCoinsValue"),
    finalBest: document.querySelector("#finalBestValue"),
    gameOverDetails: document.querySelector("#gameOverDetails"),
    startOverlay: document.querySelector("#startOverlay"),
    pauseOverlay: document.querySelector("#pauseOverlay"),
    gameOverOverlay: document.querySelector("#gameOverOverlay"),
    pauseTitle: document.querySelector("#pauseTitle"),
    pauseMessage: document.querySelector("#pauseMessage"),
    gameOverKicker: document.querySelector("#gameOverKicker"),
    gameOverTitle: document.querySelector("#gameOverTitle"),
    startKicker: document.querySelector("#startKicker"),
    startTitle: document.querySelector("#startTitle"),
    startCopy: document.querySelector("#startCopy"),
    finalMiddleLabel: document.querySelector("#finalMiddleLabel"),
    menuButton: document.querySelector("#menuButton"),
    startMenuButton: document.querySelector("#startMenuButton"),
    pauseMenuButton: document.querySelector("#pauseMenuButton"),
    gameOverMenuButton: document.querySelector("#gameOverMenuButton"),
    checkpointOverlay: document.querySelector("#checkpointOverlay"),
    checkpointTitle: document.querySelector("#checkpointTitle"),
    checkpointBonus: document.querySelector("#checkpointBonus"),
    brandEyebrow: document.querySelector("#brandEyebrow"),
    tagline: document.querySelector("#tagline"),
    gameFooter: document.querySelector("#gameFooter"),
    pauseButton: document.querySelector("#pauseButton"),
    resumeButton: document.querySelector("#resumeButton"),
    soundButton: document.querySelector("#soundButton"),
    soundIcon: document.querySelector("#soundIcon"),
    powerIndicator: document.querySelector("#powerIndicator"),
    powerIcon: document.querySelector("#powerIcon"),
    powerLabel: document.querySelector("#powerLabel"),
    powerTime: document.querySelector("#powerTime"),
    powerProgress: document.querySelector("#powerProgress"),
    pauseIcon: document.querySelector("#pauseButton span"),
    recordBanner: document.querySelector("#newRecordBanner"),
    status: document.querySelector("#gameStatus"),
    gameFrame: document.querySelector("#gameFrame"),
    touchControls: document.querySelector("#touchControls"),
    jumpButton: document.querySelector("#jumpButton"),
    movementPad: document.querySelector("#movementPad"),
    moveUpButton: document.querySelector("#moveUpButton"),
    moveLeftButton: document.querySelector("#moveLeftButton"),
    moveRightButton: document.querySelector("#moveRightButton"),
    moveDownButton: document.querySelector("#moveDownButton"),
    controlHint: document.querySelector("#controlHint"),
    touchStartHint: document.querySelector("#touchStartHint"),
    touchRetryHint: document.querySelector("#touchRetryHint"),
    touchGestureHint: document.querySelector("#touchGestureHint"),
    touchGestureHintText: document.querySelector("#touchGestureHintText"),
    touchPadFeedback: document.querySelector("#touchPadFeedback"),
    orientationGate: document.querySelector("#orientationGate"),
    landscapeButton: document.querySelector("#landscapeButton"),
    orientationText: document.querySelector("#orientationText"),
    orientationHint: document.querySelector("#orientationHint"),
  };

  const WORLD = Object.freeze({
    width: 1200,
    height: 600,
    groundY: 480,
  });

  // All gameplay tuning lives here so balancing does not require hunting
  // through the rest of the code.
  const CONFIG = Object.freeze({
    fixedStep: 1 / 60,
    activeFrameRate: 60,
    idleFrameRate: 24,
    pausedFrameRate: 4,
    maximumPixelRatio: 1.4,
    maximumLargeScreenPixelRatio: 1.25,
    maximumParticles: 120,
    gravity: 2700,
    jumpForce: 1000,
    heldJumpGravity: 0.54,
    releasedJumpGravity: 1.18,
    jumpHoldLimit: 0.18,
    jumpReleaseFactor: 0.58,
    jumpBuffer: 0.1,
    landingSquashTime: 0.17,
    initialSpeed: 330,
    acceleration: 6.2,
    maximumSpeed: 710,
    slowMotionFactor: 0.62,
    initialObstacleDelay: 1.85,
    obstacleDistanceMin: 590,
    obstacleDistanceMax: 760,
    coinIntervalMin: 2.2,
    coinIntervalMax: 4.2,
    powerIntervalMin: 13,
    powerIntervalMax: 20,
    coinValue: 25,
    levelEvery: 350,
    powerDurations: Object.freeze({
      shield: 12,
      slow: 6.5,
      double: 8,
    }),
  });

  const ASC_CONFIG = Object.freeze({
    gravity: 2380,
    heldJumpGravity: 0.58,
    releasedJumpGravity: 1.16,
    jumpForce: 920,
    sideImpulse: 760,
    jumpHoldLimit: 0.2,
    jumpReleaseFactor: 0.76,
    cameraLine: 285,
    cameraScrollSpeed: 940,
    minimumPlatformGap: 90,
    maximumPlatformGap: 120,
    platformWidthMin: 285,
    platformWidthMax: 320,
    checkpointWidth: 310,
    platformHeight: 26,
    wallInset: 84,
    platformsPerStage: 7,
    checkpointBonus: 500,
    coinValue: 45,
    hazardBaseSpeed: 250,
    hazardStageSpeed: 28,
    hazardBaseInterval: 2.05,
    hazardMinimumInterval: 0.62,
    warningTime: 0.56,
    slowMotionFactor: 0.6,
    reviveInvulnerability: 1.4,
    groundMoveSpeed: 540,
    airMoveSpeed: 760,
    groundAcceleration: 4600,
    airAcceleration: 3900,
    horizontalDrag: 4200,
    airUpControl: 560,
    airDownControl: 1450,
    maximumFallSpeed: 1120,
    dropThroughSpeed: 230,
  });

  const COLORS = Object.freeze({
    palePink: "#FFE3FE",
    purple: "#845EC2",
    pink: "#FFAEC0",
    blueViolet: "#7C83FD",
    strongPurple: "#AA2EE6",
    black: "#090613",
    white: "#F9F9F9",
  });

  const POWER_META = Object.freeze({
    shield: { label: "Escudo", icon: "S", color: COLORS.palePink },
    slow: { label: "Câmera lenta", icon: "≋", color: COLORS.blueViolet },
    double: { label: "Pontos ×2", icon: "×2", color: COLORS.pink },
  });

  const ASC_POWER_META = Object.freeze({
    shield: POWER_META.shield,
    slow: POWER_META.slow,
    double: POWER_META.double,
    revive: { label: "2ª chance", icon: "↺", color: COLORS.pink },
  });

  const SKY_STOPS = Object.freeze([
    { top: "#2b1452", bottom: "#c47ac5", glow: "#FFE3FE" },
    { top: "#6671dc", bottom: "#e9b5dc", glow: "#F9F9F9" },
    { top: "#4e236d", bottom: "#d47a9c", glow: "#FFAEC0" },
    { top: "#090613", bottom: "#28104d", glow: "#7C83FD" },
  ]);

  const OBSTACLE_TYPES = Object.freeze([
    { name: "crystal", width: 46, height: 72, color: "#160d26" },
    { name: "block", width: 58, height: 48, color: "#0c0914" },
    { name: "pillar", width: 44, height: 92, color: "#1c0d2b" },
    { name: "wide", width: 78, height: 40, color: "#100a1c" },
  ]);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const player = {
    x: 172,
    y: WORLD.groundY - 70,
    width: 52,
    height: 70,
    velocityY: 0,
    velocityX: 0,
    grounded: true,
    currentSide: "left",
    currentPlatformId: 0,
    jumpHeld: false,
    jumpHoldTime: 0,
    jumpBufferTime: 0,
    squashTime: 0,
    runPhase: 0,
    facing: 1,
  };

  let activeMode = null;
  let gameState = "menu-root";
  let obstacleList = [];
  let coinList = [];
  let powerUpList = [];
  let particleList = [];
  let currentPower = null;
  let baseSpeed = CONFIG.initialSpeed;
  let distanceTravelled = 0;
  let scoreFloat = 0;
  let score = 0;
  let coinsCollected = 0;
  let level = 1;
  let runTime = 0;
  let globalTime = 0;
  let obstacleTimer = CONFIG.initialObstacleDelay;
  let coinTimer = 2.7;
  let powerTimer = randomRange(CONFIG.powerIntervalMin, CONFIG.powerIntervalMax);
  let dustTimer = 0;
  let screenShake = 0;
  let screenFlash = 0;
  let newRecordTriggered = false;
  let bestAtRunStart = 0;
  let overlayTimer = 0;
  let spaceIsDown = false;
  let lastFrameTime = performance.now();
  let accumulator = 0;
  let canvasScaleX = 1;
  let canvasScaleY = 1;
  let lastRenderTimestamp = 0;
  let forceNextFrame = true;
  let mobileLayout = false;
  let orientationPaused = false;
  let firstMobileGestureHandled = false;
  let activeJumpPointerId = null;
  let landscapeRequestInFlight = null;
  let layoutFrameRequest = 0;

  let ascPlatforms = [];
  let ascHazards = [];
  let ascCoins = [];
  let ascPowerUps = [];
  let ascPlatformSerial = 0;
  let ascCheckpointSerial = ASC_CONFIG.platformsPerStage;
  let ascHazardTimer = 1.2;
  let ascDistance = 0;
  let ascStage = 1;
  let ascStageLandings = 0;
  let ascReviveReady = false;
  let ascInvulnerable = 0;
  let ascCheckpointTimer = 0;
  let ascLastSafe = null;
  let ascLandingLock = 0;
  let ascStageStartScore = 0;
  let ascCheckpointCount = 0;
  let ascTargetPlatformId = null;
  let ascProgressOrder = 0;
  let ascProgressSide = "left";
  let ascCameraScrollRemaining = 0;
  const ascMoveInput = { up: false, down: false, left: false, right: false };
  const activeMovePointers = new Map();
  const touchSurfacePointers = new Map();
  let touchMovePointerId = null;
  let ascTouchAxis = 0;
  let ascTouchVerticalAxis = 0;

  const renderCache = {
    groundGradient: null,
    horizonGradient: null,
    vignetteGradient: null,
  };

  const interfaceCache = Object.create(null);

  function clearAscensionMovement() {
    ascMoveInput.up = false;
    ascMoveInput.down = false;
    ascMoveInput.left = false;
    ascMoveInput.right = false;
    ascTouchAxis = 0;
    ascTouchVerticalAxis = 0;
    touchMovePointerId = null;
    activeMovePointers.clear();
    touchSurfacePointers.clear();
    if (ui.touchPadFeedback) {
      ui.touchPadFeedback.classList.add("is-app-hidden");
      ui.touchPadFeedback.classList.remove("is-active", "is-tap");
    }
    [ui.moveUpButton, ui.moveLeftButton, ui.moveRightButton, ui.moveDownButton].forEach((button) => {
      button?.classList.remove("is-pressed");
    });
  }

  function setAscensionMoveDirection(direction, pressed) {
    if (!(direction in ascMoveInput)) return;
    ascMoveInput[direction] = pressed;
  }

  const ambientPoints = Array.from({ length: reducedMotion ? 16 : 36 }, () => ({
    x: Math.random() * WORLD.width,
    y: 38 + Math.random() * 315,
    size: randomRange(0.7, 2.4),
    phase: Math.random() * Math.PI * 2,
    depth: randomRange(0.05, 0.2),
  }));

  class AudioEngine {
    constructor() {
      this.context = null;
      this.muted = loadBoolean("jdp-v2-muted", false);
    }

    ensureContext() {
      if (this.context) {
        if (this.context.state === "suspended") this.context.resume().catch(() => {});
        return;
      }

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      try {
        this.context = new AudioContextClass();
      } catch {
        this.context = null;
      }
    }

    setMuted(value) {
      this.muted = value;
      saveValue("jdp-v2-muted", String(value));
      updateSoundButton();
    }

    tone(frequency, duration, options = {}) {
      if (this.muted || !this.context) return;

      const {
        delay = 0,
        gain = 0.045,
        type = "sine",
        endFrequency = frequency,
      } = options;
      const start = this.context.currentTime + delay;
      const oscillator = this.context.createOscillator();
      const volume = this.context.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + duration);
      volume.gain.setValueAtTime(0.0001, start);
      volume.gain.exponentialRampToValueAtTime(gain, start + 0.012);
      volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(volume);
      volume.connect(this.context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    }

    play(name) {
      if (this.muted || !this.context) return;

      const sounds = {
        jump: () => this.tone(330, 0.16, { endFrequency: 680, type: "triangle", gain: 0.04 }),
        coin: () => {
          this.tone(830, 0.09, { type: "sine", gain: 0.035 });
          this.tone(1240, 0.12, { delay: 0.065, type: "sine", gain: 0.032 });
        },
        power: () => {
          [440, 660, 880].forEach((note, index) => {
            this.tone(note, 0.18, { delay: index * 0.065, type: "triangle", gain: 0.036 });
          });
        },
        shield: () => {
          this.tone(240, 0.24, { endFrequency: 90, type: "square", gain: 0.035 });
          this.tone(720, 0.18, { endFrequency: 260, type: "sine", gain: 0.025 });
        },
        record: () => {
          [523, 659, 784, 1047].forEach((note, index) => {
            this.tone(note, 0.24, { delay: index * 0.085, type: "triangle", gain: 0.033 });
          });
        },
        crash: () => {
          this.tone(150, 0.42, { endFrequency: 42, type: "sawtooth", gain: 0.055 });
          this.tone(95, 0.3, { endFrequency: 35, type: "square", gain: 0.025 });
        },
      };

      if (sounds[name]) sounds[name]();
    }
  }

  const audio = new AudioEngine();

  function loadNumber(key, fallback = 0) {
    try {
      const value = Number.parseInt(localStorage.getItem(key), 10);
      return Number.isFinite(value) && value >= 0 ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function loadBoolean(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value === "true";
    } catch {
      return fallback;
    }
  }

  function saveValue(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // The game remains fully playable when browser storage is unavailable.
    }
  }

  let classicBestScore = loadNumber("jdp-v31-classic-best", loadNumber("jdp-v2-best", 0));
  let ascensionBestScore = loadNumber("jdp-v31-ascension-best", 0);
  let bestScore = classicBestScore;

  function randomRange(minimum, maximum) {
    return minimum + Math.random() * (maximum - minimum);
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function formatScore(value) {
    return Math.max(0, Math.floor(value)).toString().padStart(5, "0");
  }

  function setOverlay(element, visible) {
    element.classList.toggle("is-visible", visible);
    element.setAttribute("aria-hidden", String(!visible));
  }

  function setStatus(message) {
    ui.status.textContent = message;
  }

  function updateSoundButton() {
    ui.soundIcon.textContent = audio.muted ? "×" : "♪";
    ui.soundButton.setAttribute("aria-label", audio.muted ? "Ativar som" : "Desativar som");
    ui.soundButton.title = audio.muted ? "Ativar som" : "Desativar som";
  }

  function updateInterface(force = false) {
    const visibleBest = Math.max(bestScore, score);
    const formattedScore = formatScore(score);
    const formattedBest = formatScore(visibleBest);
    const formattedStartBest = formatScore(bestScore);

    if (force || interfaceCache.score !== formattedScore) {
      interfaceCache.score = formattedScore;
      ui.score.textContent = formattedScore;
    }
    if (force || interfaceCache.best !== formattedBest) {
      interfaceCache.best = formattedBest;
      ui.best.textContent = formattedBest;
    }
    if (force || interfaceCache.level !== level || interfaceCache.mode !== activeMode) {
      interfaceCache.level = level;
      interfaceCache.mode = activeMode;
      ui.level.textContent = String(level);
      ui.levelLabel.textContent = activeMode === "ascension" ? "Fase" : "Nível";
    }
    if (force || interfaceCache.startBest !== formattedStartBest) {
      interfaceCache.startBest = formattedStartBest;
      ui.startBest.textContent = formattedStartBest;
    }

    const pauseDisabled = gameState === "menu-root" || gameState === "menu" || gameState === "gameover" || gameState === "checkpoint";
    const paused = gameState === "paused";
    const pauseLabel = paused ? "Continuar jogo" : "Pausar jogo";
    if (force || interfaceCache.pauseDisabled !== pauseDisabled) {
      interfaceCache.pauseDisabled = pauseDisabled;
      ui.pauseButton.disabled = pauseDisabled;
    }
    if (force || interfaceCache.paused !== paused) {
      interfaceCache.paused = paused;
      ui.pauseIcon.textContent = paused ? "▶" : "Ⅱ";
      ui.pauseButton.setAttribute("aria-label", pauseLabel);
      ui.pauseButton.title = paused ? "Continuar" : "Pausar";
    }

    if (currentPower) {
      const meta = (activeMode === "ascension" ? ASC_POWER_META : POWER_META)[currentPower.type];
      const roundedRemaining = Math.ceil(Math.max(0, currentPower.remaining) * 10) / 10;
      if (force || interfaceCache.powerType !== currentPower.type) {
        interfaceCache.powerType = currentPower.type;
        ui.powerIndicator.hidden = false;
        ui.powerIcon.textContent = meta.icon;
        ui.powerIcon.style.background = `linear-gradient(145deg, ${meta.color}, ${COLORS.strongPurple})`;
        ui.powerLabel.textContent = meta.label;
      }
      if (force || interfaceCache.powerRemaining !== roundedRemaining) {
        interfaceCache.powerRemaining = roundedRemaining;
        ui.powerTime.textContent = `${roundedRemaining.toFixed(1)}s`;
        ui.powerProgress.style.transform = `scaleX(${clamp(roundedRemaining / currentPower.duration, 0, 1)})`;
      }
    } else if (activeMode === "ascension" && ascReviveReady) {
      if (force || interfaceCache.powerType !== "revive-ready") {
        interfaceCache.powerType = "revive-ready";
        interfaceCache.powerRemaining = null;
        ui.powerIndicator.hidden = false;
        ui.powerIcon.textContent = ASC_POWER_META.revive.icon;
        ui.powerIcon.style.background = `linear-gradient(145deg, ${ASC_POWER_META.revive.color}, ${COLORS.strongPurple})`;
        ui.powerLabel.textContent = "2ª chance";
        ui.powerTime.textContent = "PRONTA";
        ui.powerProgress.style.transform = "scaleX(1)";
      }
    } else if (force || interfaceCache.powerType !== null) {
      interfaceCache.powerType = null;
      interfaceCache.powerRemaining = null;
      ui.powerIndicator.hidden = true;
    }
  }

  function rebuildRenderCache() {
    context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);

    renderCache.groundGradient = context.createLinearGradient(0, WORLD.groundY, 0, WORLD.height);
    renderCache.groundGradient.addColorStop(0, "#171026");
    renderCache.groundGradient.addColorStop(1, "#090613");

    renderCache.horizonGradient = context.createLinearGradient(0, 390, 0, WORLD.groundY + 15);
    renderCache.horizonGradient.addColorStop(0, "rgba(255, 174, 192, 0)");
    renderCache.horizonGradient.addColorStop(1, "rgba(255, 174, 192, 0.22)");

    renderCache.vignetteGradient = context.createRadialGradient(
      WORLD.width / 2,
      WORLD.height / 2,
      WORLD.height * 0.28,
      WORLD.width / 2,
      WORLD.height / 2,
      WORLD.width * 0.68,
    );
    renderCache.vignetteGradient.addColorStop(0, "rgba(9, 6, 19, 0)");
    renderCache.vignetteGradient.addColorStop(1, "rgba(9, 6, 19, 0.28)");
  }

  function getVisualViewportSize() {
    const viewport = window.visualViewport;
    return {
      width: Math.max(1, viewport ? viewport.width : window.innerWidth),
      height: Math.max(1, viewport ? viewport.height : window.innerHeight),
    };
  }

  function syncVisualViewport() {
    const viewport = getVisualViewportSize();
    document.documentElement.style.setProperty("--game-vw", `${viewport.width}px`);
    document.documentElement.style.setProperty("--game-vh", `${viewport.height}px`);
    return viewport;
  }

  function isTouchMobileLayout() {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    const hasTouch = (navigator.maxTouchPoints || 0) > 0 || "ontouchstart" in window;
    const viewport = getVisualViewportSize();
    const screenWidth = window.screen?.width || viewport.width;
    const screenHeight = window.screen?.height || viewport.height;
    const shortestScreenSide = Math.min(screenWidth, screenHeight);
    const shortestViewportSide = Math.min(viewport.width, viewport.height);

    // A touchscreen laptop normally keeps a fine pointer and hover support.
    // Phones/tablets normally expose coarse pointer + no hover, so they enter
    // the dedicated mobile experience without relying on user-agent strings.
    const handheldPointer = coarsePointer && noHover;
    const compactTouchFallback = hasTouch && noHover && shortestViewportSide <= 900;

    return hasTouch && (handheldPointer || compactTouchFallback) && shortestScreenSide <= 1100;
  }

  function isPortraitViewport() {
    const viewport = getVisualViewportSize();
    return viewport.height > viewport.width;
  }

  function resetOrientationCopy() {
    ui.orientationText.textContent =
      "Este jogo foi desenvolvido para aproveitar melhor sua tela no modo paisagem.";
    ui.orientationHint.textContent =
      "Gire seu celular para continuar. Se o navegador permitir, a rotação será solicitada automaticamente.";
  }

  function releaseMobileJump() {
    if (activeJumpPointerId === null && !ui.jumpButton.classList.contains("is-pressed")) return;
    activeJumpPointerId = null;
    spaceIsDown = false;
    ui.jumpButton.classList.remove("is-pressed");
    releaseJump();
  }

  function pauseForOrientation() {
    if (gameState !== "running") return;
    orientationPaused = true;
    gameState = "paused";
    clearAscensionMovement();
    player.jumpHeld = false;
    spaceIsDown = false;
    setOverlay(ui.pauseOverlay, false);
    setStatus("Jogo pausado enquanto o celular está na vertical.");
    updateInterface();
  }

  function resumeAfterOrientation() {
    if (!orientationPaused || gameState !== "paused" || document.hidden) return;
    orientationPaused = false;
    resumeGame();
  }

  function updateMobileExperience() {
    const viewport = syncVisualViewport();
    mobileLayout = isTouchMobileLayout();
    const portrait = mobileLayout && viewport.height > viewport.width;

    document.body.classList.toggle("is-mobile", mobileLayout);
    document.body.classList.toggle("is-portrait", portrait);
    document.body.classList.toggle("is-landscape", mobileLayout && !portrait);
    ui.touchControls.classList.add("is-app-hidden");
    if (ui.touchGestureHint) {
      const showTouchHint = Boolean(activeMode) && mobileLayout && !portrait;
      ui.touchGestureHint.classList.toggle("is-app-hidden", !showTouchHint);
      ui.touchGestureHint.setAttribute("aria-hidden", String(!showTouchHint));
    }

    ui.orientationGate.classList.toggle("is-hidden", !portrait);
    ui.orientationGate.setAttribute("aria-hidden", String(!portrait));

    if (portrait) {
      releaseMobileJump();
      pauseForOrientation();
    } else {
      resetOrientationCopy();
      resumeAfterOrientation();
    }

    return { mobile: mobileLayout, portrait };
  }

  async function requestLandscapeExperience({ silent = false } = {}) {
    if (!isTouchMobileLayout()) return false;
    if (landscapeRequestInFlight) return landscapeRequestInFlight;

    landscapeRequestInFlight = (async () => {
      let fullscreenEntered = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      let orientationLocked = false;
      const root = document.documentElement;
      const requestFullscreen = root.requestFullscreen || root.webkitRequestFullscreen;

      if (!fullscreenEntered && typeof requestFullscreen === "function") {
        try {
          if (root.requestFullscreen) {
            await root.requestFullscreen({ navigationUI: "hide" });
          } else {
            await root.webkitRequestFullscreen();
          }
          fullscreenEntered = true;
        } catch {
          // Expected on browsers that require a different user gesture or do not
          // expose element fullscreen (notably several iOS Safari versions).
        }
      }

      if (screen.orientation && typeof screen.orientation.lock === "function") {
        try {
          await screen.orientation.lock("landscape");
          orientationLocked = true;
        } catch {
          // Manual rotation remains the standards-compatible fallback.
        }
      }

      updateMobileExperience();
      scheduleLayoutSync();

      if (!silent && isPortraitViewport()) {
        ui.orientationText.textContent = orientationLocked
          ? "A orientação horizontal foi solicitada. Aguarde a tela se ajustar."
          : "Seu navegador bloqueou a rotação automática nesta página.";
        ui.orientationHint.textContent =
          "Vire o celular para o lado. Assim que o modo paisagem for detectado, o jogo libera sozinho.";
      }

      return fullscreenEntered || orientationLocked;
    })();

    try {
      return await landscapeRequestInFlight;
    } finally {
      landscapeRequestInFlight = null;
    }
  }

  function resizeCanvas() {
    syncVisualViewport();
    const bounds = canvas.getBoundingClientRect();
    const ratioLimit = mobileLayout
      ? 1.25
      : bounds.width >= 1000
        ? CONFIG.maximumLargeScreenPixelRatio
        : CONFIG.maximumPixelRatio;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, ratioLimit);
    const width = Math.max(1, Math.round(bounds.width * pixelRatio));
    const height = Math.max(1, Math.round(bounds.height * pixelRatio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    canvasScaleX = canvas.width / WORLD.width;
    canvasScaleY = canvas.height / WORLD.height;
    rebuildRenderCache();
    forceNextFrame = true;
  }

  function scheduleLayoutSync(delay = 0) {
    const run = () => {
      if (layoutFrameRequest) window.cancelAnimationFrame(layoutFrameRequest);
      layoutFrameRequest = window.requestAnimationFrame(() => {
        layoutFrameRequest = 0;
        updateMobileExperience();
        resizeCanvas();
      });
    };

    if (delay > 0) window.setTimeout(run, delay);
    else run();
  }

  function resetPlayer() {
    player.y = WORLD.groundY - player.height;
    player.velocityY = 0;
    player.velocityX = 0;
    player.grounded = true;
    player.jumpHeld = false;
    player.jumpHoldTime = 0;
    player.jumpBufferTime = 0;
    player.squashTime = 0;
    player.runPhase = 0;
    player.facing = 1;
  }

  function startGame() {
    if (activeMode === "ascension") {
      startAscensionGame();
      return;
    }
    if (activeMode !== "classic") return;
    window.clearTimeout(overlayTimer);
    resetPlayer();
    obstacleList = [];
    coinList = [];
    powerUpList = [];
    particleList = [];
    currentPower = null;
    baseSpeed = CONFIG.initialSpeed;
    distanceTravelled = 0;
    scoreFloat = 0;
    score = 0;
    coinsCollected = 0;
    level = 1;
    runTime = 0;
    obstacleTimer = CONFIG.initialObstacleDelay;
    coinTimer = 2.7;
    powerTimer = randomRange(CONFIG.powerIntervalMin, CONFIG.powerIntervalMax);
    dustTimer = 0;
    screenShake = 0;
    screenFlash = 0;
    newRecordTriggered = false;
    bestScore = classicBestScore;
    bestAtRunStart = bestScore;
    accumulator = 0;
    lastFrameTime = performance.now();
    lastRenderTimestamp = 0;
    forceNextFrame = true;
    clearAscensionMovement();
    gameState = "running";
    setOverlay(ui.startOverlay, false);
    setOverlay(ui.pauseOverlay, false);
    setOverlay(ui.gameOverOverlay, false);
    ui.recordBanner.classList.remove("is-active");
    setStatus(
      mobileLayout
        ? "Corrida iniciada. Use o botão Pular: toque para salto curto ou segure para salto alto."
        : "Corrida iniciada. Pressione a barra de espaço para pular.",
    );
    updateInterface();
  }

  function pauseGame(reason = "manual") {
    if (gameState !== "running") return;
    gameState = "paused";
    forceNextFrame = true;
    player.jumpHeld = false;
    clearAscensionMovement();
    ui.pauseTitle.textContent = reason === "focus" ? "Corrida interrompida" : reason === "menu" ? "Voltar ao menu?" : "Jogo pausado";
    ui.pauseMessage.textContent =
      reason === "focus"
        ? "A janela perdeu o foco. Continue quando estiver pronto."
        : reason === "menu"
          ? "A partida atual será encerrada. Você poderá escolher outro modo."
          : "Seu progresso está seguro.";
    setOverlay(ui.pauseOverlay, true);
    setStatus("Jogo pausado.");
    updateInterface();
  }

  function resumeGame() {
    if (gameState !== "paused") return;
    gameState = "running";
    accumulator = 0;
    lastFrameTime = performance.now();
    lastRenderTimestamp = 0;
    forceNextFrame = true;
    setOverlay(ui.pauseOverlay, false);
    setStatus("Corrida retomada.");
    updateInterface();
  }

  function requestJump() {
    if (gameState !== "running") return;
    if (activeMode === "ascension") {
      requestAscensionJump();
      return;
    }

    player.jumpBufferTime = CONFIG.jumpBuffer;
    if (player.grounded) performJump();
  }

  function performJump() {
    player.velocityY = -CONFIG.jumpForce;
    player.grounded = false;
    player.jumpHeld = spaceIsDown;
    player.jumpHoldTime = 0;
    player.jumpBufferTime = 0;
    player.squashTime = 0;
    emitBurst(player.x + 22, WORLD.groundY - 4, 7, COLORS.pink, 150, 0.34, true);
    audio.play("jump");
  }

  function releaseJump() {
    player.jumpHeld = false;
    if (activeMode === "ascension") {
      if (!player.grounded && player.velocityY < -120) player.velocityY *= ASC_CONFIG.jumpReleaseFactor;
      return;
    }
    if (!player.grounded && player.velocityY < -120) {
      player.velocityY *= CONFIG.jumpReleaseFactor;
    }
  }

  function triggerNewRecord() {
    if (newRecordTriggered) return;
    newRecordTriggered = true;
    ui.recordBanner.classList.remove("is-active");
    void ui.recordBanner.offsetWidth;
    ui.recordBanner.classList.add("is-active");
    emitCelebration();
    audio.play("record");
    setStatus("Novo recorde alcançado!");
  }

  function endGame() {
    if (activeMode === "ascension") {
      endAscensionGame();
      return;
    }
    if (gameState !== "running") return;

    gameState = "gameover";
    player.jumpHeld = false;
    screenShake = 18;
    screenFlash = 0.78;
    emitBurst(
      player.x + player.width / 2,
      player.y + player.height / 2,
      reducedMotion ? 12 : 30,
      COLORS.pink,
      360,
      0.72,
    );
    audio.play("crash");

    const beatRecord = score > bestScore;
    if (beatRecord) {
      bestScore = score;
      classicBestScore = bestScore;
      saveValue("jdp-v31-classic-best", String(bestScore));
      saveValue("jdp-v2-best", String(bestScore));
      if (!newRecordTriggered) triggerNewRecord();
    }

    ui.finalScore.textContent = formatScore(score);
    ui.finalCoins.textContent = String(coinsCollected);
    ui.finalBest.textContent = formatScore(bestScore);
    ui.gameOverDetails.hidden = true;
    ui.gameOverKicker.textContent = beatRecord ? "Novo recorde" : "Fim da corrida";
    ui.gameOverTitle.textContent = beatRecord ? "Sua melhor corrida!" : "Você foi longe.";
    ui.startBest.textContent = formatScore(bestScore);
    setStatus(`Fim da corrida. Pontuação ${score}. Pressione espaço para jogar novamente.`);
    updateInterface();

    overlayTimer = window.setTimeout(() => {
      if (gameState === "gameover") setOverlay(ui.gameOverOverlay, true);
    }, reducedMotion ? 40 : 420);
  }

  function updatePlayer(deltaTime) {
    player.runPhase += deltaTime * (baseSpeed / 37);
    player.jumpBufferTime = Math.max(0, player.jumpBufferTime - deltaTime);
    player.squashTime = Math.max(0, player.squashTime - deltaTime);

    if (!player.grounded) {
      player.jumpHoldTime += deltaTime;
      const holdingJump =
        player.jumpHeld &&
        player.jumpHoldTime < CONFIG.jumpHoldLimit &&
        player.velocityY < 0;
      const gravityMultiplier = holdingJump
        ? CONFIG.heldJumpGravity
        : player.jumpHeld
          ? 1
          : CONFIG.releasedJumpGravity;

      player.velocityY += CONFIG.gravity * gravityMultiplier * deltaTime;
      player.y += player.velocityY * deltaTime;

      const groundPosition = WORLD.groundY - player.height;
      if (player.y >= groundPosition) {
        const landingSpeed = player.velocityY;
        player.y = groundPosition;
        player.velocityY = 0;
        player.grounded = true;
        player.jumpHeld = false;
        player.squashTime = CONFIG.landingSquashTime;
        emitBurst(
          player.x + player.width / 2,
          WORLD.groundY - 3,
          reducedMotion ? 4 : 10,
          COLORS.palePink,
          clamp(landingSpeed * 0.2, 80, 190),
          0.34,
          true,
        );

        if (player.jumpBufferTime > 0) performJump();
      }
    }
  }

  function createObstacle(type, xPosition) {
    return {
      x: xPosition,
      y: WORLD.groundY - type.height,
      width: type.width,
      height: type.height,
      type: type.name,
      color: type.color,
      passed: false,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function spawnObstaclePattern() {
    const eligibleTypes = level < 2 ? OBSTACLE_TYPES.slice(0, 2) : OBSTACLE_TYPES;
    const selected = eligibleTypes[Math.floor(Math.random() * eligibleTypes.length)];
    const startX = WORLD.width + 70;
    obstacleList.push(createObstacle(selected, startX));

    // A double group is deliberately compact enough to clear with one full jump.
    if (level >= 3 && selected.height <= 50 && Math.random() < 0.2) {
      const secondType = Math.random() < 0.5 ? OBSTACLE_TYPES[1] : OBSTACLE_TYPES[3];
      const internalGap = 74 + baseSpeed * 0.085;
      obstacleList.push(createObstacle(secondType, startX + selected.width + internalGap));
    }

    const safeDistance =
      randomRange(CONFIG.obstacleDistanceMin, CONFIG.obstacleDistanceMax) + baseSpeed * 0.25;
    obstacleTimer = safeDistance / baseSpeed;
  }

  function spawnCoinArc() {
    const count = Math.floor(randomRange(4, 7));
    const startX = WORLD.width + 80;
    const spacing = 45;
    const peakHeight = randomRange(125, 190);

    for (let index = 0; index < count; index += 1) {
      const progress = count === 1 ? 0.5 : index / (count - 1);
      const arc = Math.sin(progress * Math.PI);
      const height = 86 + arc * (peakHeight - 86);
      coinList.push({
        x: startX + index * spacing,
        y: WORLD.groundY - height,
        radius: 13,
        phase: Math.random() * Math.PI * 2,
      });
    }

    coinTimer = randomRange(CONFIG.coinIntervalMin, CONFIG.coinIntervalMax);
  }

  function spawnPowerUp() {
    if (currentPower) {
      powerTimer = randomRange(4, 7);
      return;
    }

    const types = Object.keys(POWER_META);
    const type = types[Math.floor(Math.random() * types.length)];
    powerUpList.push({
      x: WORLD.width + 90,
      y: WORLD.groundY - randomRange(105, 155),
      radius: 21,
      type,
      phase: Math.random() * Math.PI * 2,
    });
    powerTimer = randomRange(CONFIG.powerIntervalMin, CONFIG.powerIntervalMax);
  }

  function updateObjects(deltaTime, effectiveSpeed) {
    obstacleTimer -= deltaTime;
    coinTimer -= deltaTime;
    powerTimer -= deltaTime;

    if (obstacleTimer <= 0) spawnObstaclePattern();
    if (coinTimer <= 0) spawnCoinArc();
    if (powerTimer <= 0) spawnPowerUp();

    obstacleList.forEach((obstacle) => {
      obstacle.x -= effectiveSpeed * deltaTime;
    });
    coinList.forEach((coin) => {
      coin.x -= effectiveSpeed * deltaTime;
    });
    powerUpList.forEach((powerUp) => {
      powerUp.x -= effectiveSpeed * deltaTime;
    });

    obstacleList = obstacleList.filter((obstacle) => obstacle.x + obstacle.width > -80);
    coinList = coinList.filter((coin) => coin.x + coin.radius > -40);
    powerUpList = powerUpList.filter((powerUp) => powerUp.x + powerUp.radius > -50);
  }

  function getPlayerHitbox() {
    return {
      x: player.x + 9,
      y: player.y + 7,
      width: player.width - 18,
      height: player.height - 12,
    };
  }

  function rectanglesOverlap(first, second) {
    return (
      first.x < second.x + second.width &&
      first.x + first.width > second.x &&
      first.y < second.y + second.height &&
      first.y + first.height > second.y
    );
  }

  function circleTouchesPlayer(circle, hitbox) {
    const nearestX = clamp(circle.x, hitbox.x, hitbox.x + hitbox.width);
    const nearestY = clamp(circle.y, hitbox.y, hitbox.y + hitbox.height);
    const deltaX = circle.x - nearestX;
    const deltaY = circle.y - nearestY;
    return deltaX * deltaX + deltaY * deltaY < circle.radius * circle.radius;
  }

  function activatePower(type) {
    const duration = CONFIG.powerDurations[type];
    currentPower = { type, duration, remaining: duration };
    audio.play("power");
    emitBurst(
      player.x + player.width / 2,
      player.y + player.height / 2,
      reducedMotion ? 8 : 18,
      POWER_META[type].color,
      230,
      0.55,
    );
    setStatus(`${POWER_META[type].label} ativado.`);
  }

  function checkCollisions() {
    const playerHitbox = getPlayerHitbox();

    for (let index = obstacleList.length - 1; index >= 0; index -= 1) {
      const obstacle = obstacleList[index];
      const obstacleHitbox = {
        x: obstacle.x + 5,
        y: obstacle.y + 4,
        width: obstacle.width - 10,
        height: obstacle.height - 4,
      };

      if (!rectanglesOverlap(playerHitbox, obstacleHitbox)) continue;

      if (currentPower?.type === "shield") {
        emitBurst(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          reducedMotion ? 10 : 24,
          COLORS.palePink,
          320,
          0.6,
        );
        obstacleList.splice(index, 1);
        currentPower = null;
        screenShake = 9;
        screenFlash = 0.45;
        audio.play("shield");
        setStatus("O escudo protegeu você de uma colisão.");
      } else {
        endGame();
        return;
      }
    }

    for (let index = coinList.length - 1; index >= 0; index -= 1) {
      const coin = coinList[index];
      if (!circleTouchesPlayer(coin, playerHitbox)) continue;

      coinList.splice(index, 1);
      coinsCollected += 1;
      scoreFloat += CONFIG.coinValue * (currentPower?.type === "double" ? 2 : 1);
      emitBurst(coin.x, coin.y, reducedMotion ? 4 : 9, COLORS.pink, 120, 0.28);
      audio.play("coin");
    }

    for (let index = powerUpList.length - 1; index >= 0; index -= 1) {
      const powerUp = powerUpList[index];
      if (!circleTouchesPlayer(powerUp, playerHitbox)) continue;

      powerUpList.splice(index, 1);
      activatePower(powerUp.type);
    }
  }

  function updatePower(deltaTime) {
    if (!currentPower) return;
    currentPower.remaining -= deltaTime;
    if (currentPower.remaining <= 0) {
      const expiredLabel = POWER_META[currentPower.type].label;
      currentPower = null;
      setStatus(`${expiredLabel} terminou.`);
    }
  }

  function createParticle(x, y, options = {}) {
    if (particleList.length >= CONFIG.maximumParticles) {
      particleList.splice(0, particleList.length - CONFIG.maximumParticles + 1);
    }
    const speed = options.speed ?? 100;
    const angle = options.groundOnly
      ? randomRange(Math.PI * 1.08, Math.PI * 1.92)
      : randomRange(0, Math.PI * 2);
    const life = options.life ?? 0.4;
    particleList.push({
      x,
      y,
      velocityX: Math.cos(angle) * randomRange(speed * 0.35, speed),
      velocityY: Math.sin(angle) * randomRange(speed * 0.35, speed),
      size: randomRange(2, 6),
      color: options.color ?? COLORS.palePink,
      life,
      maximumLife: life,
      gravity: options.groundOnly ? 300 : 80,
    });
  }

  function emitBurst(x, y, count, color, speed, life, groundOnly = false) {
    for (let index = 0; index < count; index += 1) {
      createParticle(x, y, { color, speed, life: randomRange(life * 0.65, life), groundOnly });
    }
  }

  function emitCelebration() {
    const palette = [COLORS.pink, COLORS.palePink, COLORS.blueViolet, COLORS.strongPurple];
    for (let index = 0; index < (reducedMotion ? 14 : 36); index += 1) {
      createParticle(randomRange(260, 940), randomRange(90, 230), {
        color: palette[index % palette.length],
        speed: randomRange(90, 250),
        life: randomRange(0.7, 1.35),
      });
    }
  }

  function updateParticles(deltaTime) {
    particleList.forEach((particle) => {
      particle.life -= deltaTime;
      particle.velocityY += particle.gravity * deltaTime;
      particle.x += particle.velocityX * deltaTime;
      particle.y += particle.velocityY * deltaTime;
      particle.velocityX *= Math.pow(0.08, deltaTime);
    });
    particleList = particleList.filter((particle) => particle.life > 0);
  }

  function updateClassicGame(deltaTime) {
    runTime += deltaTime;
    baseSpeed = Math.min(CONFIG.maximumSpeed, baseSpeed + CONFIG.acceleration * deltaTime);
    updatePower(deltaTime);

    const effectiveSpeed =
      baseSpeed * (currentPower?.type === "slow" ? CONFIG.slowMotionFactor : 1);
    distanceTravelled += effectiveSpeed * deltaTime;
    scoreFloat +=
      (effectiveSpeed * deltaTime * (currentPower?.type === "double" ? 2 : 1)) / 18;
    score = Math.floor(scoreFloat);
    level = 1 + Math.floor(score / CONFIG.levelEvery);

    updatePlayer(deltaTime);
    updateObjects(deltaTime, effectiveSpeed);
    checkCollisions();

    if (gameState !== "running") return;

    dustTimer -= deltaTime;
    if (!reducedMotion && player.grounded && dustTimer <= 0) {
      createParticle(player.x + 7, WORLD.groundY - 3, {
        color: COLORS.palePink,
        speed: 42,
        life: 0.34,
        groundOnly: true,
      });
      dustTimer = 0.11;
    }

    if (
      score > bestAtRunStart &&
      score >= Math.max(100, bestAtRunStart + 1) &&
      !newRecordTriggered
    ) {
      triggerNewRecord();
    }

    screenShake = Math.max(0, screenShake - 38 * deltaTime);
    screenFlash = Math.max(0, screenFlash - 2.4 * deltaTime);
    updateParticles(deltaTime);
  }

  function updateAmbient(deltaTime) {
    if (gameState !== "running") {
      player.runPhase += deltaTime * 3.2;
      updateParticles(deltaTime);
    }
    screenShake = Math.max(0, screenShake - 38 * deltaTime);
    screenFlash = Math.max(0, screenFlash - 2.4 * deltaTime);
  }

  function parseHex(hex) {
    const normalized = hex.replace("#", "");
    return {
      red: Number.parseInt(normalized.slice(0, 2), 16),
      green: Number.parseInt(normalized.slice(2, 4), 16),
      blue: Number.parseInt(normalized.slice(4, 6), 16),
    };
  }

  function mixColor(first, second, amount) {
    const start = parseHex(first);
    const end = parseHex(second);
    const channel = (from, to) => Math.round(from + (to - from) * amount);
    return `rgb(${channel(start.red, end.red)}, ${channel(start.green, end.green)}, ${channel(start.blue, end.blue)})`;
  }

  function getSkyPalette() {
    const cycle = ((globalTime / 46 + 0.08) % 1) * SKY_STOPS.length;
    const index = Math.floor(cycle) % SKY_STOPS.length;
    const nextIndex = (index + 1) % SKY_STOPS.length;
    const blend = cycle - Math.floor(cycle);
    const easedBlend = blend * blend * (3 - 2 * blend);
    return {
      top: mixColor(SKY_STOPS[index].top, SKY_STOPS[nextIndex].top, easedBlend),
      bottom: mixColor(SKY_STOPS[index].bottom, SKY_STOPS[nextIndex].bottom, easedBlend),
      glow: mixColor(SKY_STOPS[index].glow, SKY_STOPS[nextIndex].glow, easedBlend),
      nightAmount: index === 3 ? 1 - blend : nextIndex === 3 ? blend : 0,
    };
  }

  function roundedRectPath(ctx, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + safeRadius, y);
    ctx.lineTo(x + width - safeRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    ctx.lineTo(x + width, y + height - safeRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
    ctx.lineTo(x + safeRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    ctx.lineTo(x, y + safeRadius);
    ctx.quadraticCurveTo(x, y, x + safeRadius, y);
    ctx.closePath();
  }

  function drawBackground() {
    const palette = getSkyPalette();
    const skyGradient = context.createLinearGradient(0, 0, 0, WORLD.groundY);
    skyGradient.addColorStop(0, palette.top);
    skyGradient.addColorStop(1, palette.bottom);
    context.fillStyle = skyGradient;
    context.fillRect(0, 0, WORLD.width, WORLD.height);

    const orbX = 900 + Math.sin(globalTime * 0.028) * 130;
    const orbY = 122 + Math.cos(globalTime * 0.022) * 35;
    const orbGradient = context.createRadialGradient(orbX, orbY, 2, orbX, orbY, 105);
    orbGradient.addColorStop(0, palette.glow);
    orbGradient.addColorStop(0.25, "rgba(255, 227, 254, 0.44)");
    orbGradient.addColorStop(1, "rgba(255, 227, 254, 0)");
    context.fillStyle = orbGradient;
    context.beginPath();
    context.arc(orbX, orbY, 105, 0, Math.PI * 2);
    context.fill();

    ambientPoints.forEach((point) => {
      const x = ((point.x - distanceTravelled * point.depth) % (WORLD.width + 40) + WORLD.width + 40) % (WORLD.width + 40) - 20;
      const twinkle = 0.35 + Math.sin(globalTime * 1.6 + point.phase) * 0.22;
      context.globalAlpha = clamp(twinkle + palette.nightAmount * 0.42, 0.12, 0.9);
      context.fillStyle = COLORS.palePink;
      context.beginPath();
      context.arc(x, point.y, point.size, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;

    drawHills(395, 72, 250, "rgba(42, 20, 82, 0.28)", 0.045);
    drawHills(430, 52, 190, "rgba(30, 14, 60, 0.48)", 0.09);

    context.fillStyle = renderCache.horizonGradient;
    context.fillRect(0, 380, WORLD.width, 110);
  }

  function drawHills(baseY, amplitude, segmentWidth, color, depth) {
    const offset = (distanceTravelled * depth) % segmentWidth;
    context.beginPath();
    context.moveTo(-segmentWidth, WORLD.groundY);
    for (let x = -segmentWidth - offset; x <= WORLD.width + segmentWidth; x += segmentWidth) {
      context.lineTo(x, baseY);
      context.quadraticCurveTo(
        x + segmentWidth * 0.48,
        baseY - amplitude,
        x + segmentWidth,
        baseY,
      );
    }
    context.lineTo(WORLD.width + segmentWidth, WORLD.groundY);
    context.closePath();
    context.fillStyle = color;
    context.fill();
  }

  function drawGround() {
    context.fillStyle = renderCache.groundGradient;
    context.fillRect(0, WORLD.groundY, WORLD.width, WORLD.height - WORLD.groundY);

    context.fillStyle = COLORS.pink;
    context.globalAlpha = 0.7;
    context.fillRect(0, WORLD.groundY, WORLD.width, 2);
    context.globalAlpha = 1;

    const lineOffset = distanceTravelled % 86;
    context.strokeStyle = "rgba(124, 131, 253, 0.16)";
    context.lineWidth = 1;
    for (let x = -100 - lineOffset; x < WORLD.width + 100; x += 86) {
      context.beginPath();
      context.moveTo(x, WORLD.groundY + 9);
      context.lineTo(x - 46, WORLD.height);
      context.stroke();
    }

    for (let y = WORLD.groundY + 28; y < WORLD.height; y += 30) {
      context.globalAlpha = 1 - (y - WORLD.groundY) / 170;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(WORLD.width, y);
      context.stroke();
    }
    context.globalAlpha = 1;
  }

  function drawPlayer() {
    const shadowGround = activeMode === "ascension"
      ? (ascPlatforms.find((platform) => platform.id === player.currentPlatformId)?.y ?? player.y + player.height + 10)
      : WORLD.groundY;
    const heightAboveGround = shadowGround - (player.y + player.height);
    const shadowScale = clamp(1 - heightAboveGround / 260, 0.35, 1);
    context.save();
    context.globalAlpha = 0.26 * shadowScale;
    context.fillStyle = "#000000";
    context.beginPath();
    context.ellipse(
      player.x + player.width / 2,
      shadowGround + 5,
      31 * shadowScale,
      8 * shadowScale,
      0,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.restore();

    const verticalTilt = clamp(player.velocityY / 1900, -0.25, 0.23);
    const sideTilt = activeMode === "ascension" ? clamp(player.velocityX / 2600, -0.12, 0.12) : 0;
    const groundMoveTilt = activeMode === "ascension" && player.grounded
      ? clamp(player.velocityX / 5200, -0.085, 0.085)
      : 0;
    const characterTilt = player.grounded ? groundMoveTilt : verticalTilt + sideTilt;
    const squashProgress = player.squashTime / CONFIG.landingSquashTime;
    const squash = player.grounded ? Math.sin(squashProgress * Math.PI) * 0.11 : 0;
    const ascSpeedBlend = activeMode === "ascension"
      ? clamp(Math.abs(player.velocityX) / ASC_CONFIG.groundMoveSpeed, 0, 1)
      : 1;
    const runBounce = player.grounded ? Math.abs(Math.sin(player.runPhase)) * 2.2 * ascSpeedBlend : 0;
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2 + runBounce;
    const facing = activeMode === "ascension" ? (player.facing || 1) : 1;

    context.save();
    context.translate(centerX, centerY);
    context.rotate(characterTilt);
    context.scale(1 + squash, 1 - squash);
    context.scale(facing, 1);
    context.translate(-player.width / 2, -player.height / 2);

    context.shadowColor = COLORS.strongPurple;
    context.shadowBlur = 12;
    const bodyGradient = context.createLinearGradient(0, 0, player.width, player.height);
    bodyGradient.addColorStop(0, COLORS.blueViolet);
    bodyGradient.addColorStop(0.48, COLORS.strongPurple);
    bodyGradient.addColorStop(1, "#291040");
    context.fillStyle = bodyGradient;
    roundedRectPath(context, 2, 3, player.width - 4, player.height - 14, 14);
    context.fill();

    context.shadowBlur = 0;
    context.strokeStyle = "rgba(255, 255, 255, 0.42)";
    context.lineWidth = 1.4;
    roundedRectPath(context, 3, 4, player.width - 6, player.height - 16, 13);
    context.stroke();

    context.fillStyle = "rgba(255, 255, 255, 0.16)";
    roundedRectPath(context, 9, 10, 9, 30, 5);
    context.fill();

    context.fillStyle = COLORS.white;
    roundedRectPath(context, 25, 18, 7, 10, 3);
    context.fill();
    roundedRectPath(context, 37, 18, 7, 10, 3);
    context.fill();
    context.fillStyle = COLORS.black;
    const lookOffset = activeMode === "ascension" ? 1.6 : 0;
    context.fillRect(29 + lookOffset, 22, 2, 4);
    context.fillRect(41 + lookOffset, 22, 2, 4);

    context.strokeStyle = "rgba(255, 227, 254, 0.75)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(26, 39);
    context.lineTo(34, 45);
    context.lineTo(43, 37);
    context.stroke();

    const stride = player.grounded
      ? Math.sin(player.runPhase) * 7 * ascSpeedBlend
      : activeMode === "ascension"
        ? Math.sin(globalTime * 12) * 2.5
        : 2;
    const leftLift = player.grounded && activeMode === "ascension"
      ? Math.max(0, Math.sin(player.runPhase)) * 4 * ascSpeedBlend
      : 0;
    const rightLift = player.grounded && activeMode === "ascension"
      ? Math.max(0, -Math.sin(player.runPhase)) * 4 * ascSpeedBlend
      : 0;
    context.fillStyle = "#160a27";
    roundedRectPath(context, 8 + stride, player.height - 19 - leftLift, 15, 16, 5);
    context.fill();
    roundedRectPath(context, 30 - stride, player.height - 19 - rightLift, 15, 16, 5);
    context.fill();
    context.restore();

    if (currentPower?.type === "shield") {
      context.save();
      context.strokeStyle = `rgba(255, 227, 254, ${0.55 + Math.sin(globalTime * 7) * 0.18})`;
      context.fillStyle = "rgba(124, 131, 253, 0.1)";
      context.lineWidth = 3;
      context.shadowColor = COLORS.palePink;
      context.shadowBlur = 10;
      context.beginPath();
      context.arc(centerX, centerY, 48, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.restore();
    }
  }

  function drawObstacle(obstacle) {
    context.save();
    context.translate(obstacle.x, obstacle.y);
    context.shadowColor = "rgba(170, 46, 230, 0.42)";
    context.shadowBlur = 8;

    const gradient = context.createLinearGradient(0, 0, obstacle.width, obstacle.height);
    gradient.addColorStop(0, "#2b1643");
    gradient.addColorStop(0.48, obstacle.color);
    gradient.addColorStop(1, "#050309");
    context.fillStyle = gradient;

    if (obstacle.type === "crystal" || obstacle.type === "pillar") {
      context.beginPath();
      context.moveTo(obstacle.width * 0.5, 0);
      context.lineTo(obstacle.width, obstacle.height * 0.28);
      context.lineTo(obstacle.width * 0.86, obstacle.height);
      context.lineTo(obstacle.width * 0.14, obstacle.height);
      context.lineTo(0, obstacle.height * 0.28);
      context.closePath();
      context.fill();
      context.shadowBlur = 0;
      context.strokeStyle = "rgba(255, 174, 192, 0.48)";
      context.lineWidth = 1.5;
      context.stroke();
      context.beginPath();
      context.moveTo(obstacle.width * 0.5, 3);
      context.lineTo(obstacle.width * 0.42, obstacle.height * 0.78);
      context.lineTo(obstacle.width * 0.14, obstacle.height);
      context.stroke();
    } else {
      roundedRectPath(context, 0, 0, obstacle.width, obstacle.height, 10);
      context.fill();
      context.shadowBlur = 0;
      context.strokeStyle = "rgba(124, 131, 253, 0.42)";
      context.lineWidth = 1.5;
      context.stroke();
      context.fillStyle = "rgba(255, 227, 254, 0.12)";
      roundedRectPath(context, 8, 8, Math.max(8, obstacle.width * 0.18), obstacle.height - 16, 4);
      context.fill();
    }

    context.restore();
  }

  function drawCoin(coin) {
    const spin = 0.26 + Math.abs(Math.sin(globalTime * 5 + coin.phase)) * 0.74;
    context.save();
    context.translate(coin.x, coin.y + Math.sin(globalTime * 3 + coin.phase) * 4);
    context.scale(spin, 1);
    context.shadowColor = COLORS.pink;
    context.shadowBlur = 8;
    context.fillStyle = COLORS.pink;
    context.beginPath();
    context.arc(0, 0, coin.radius, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = COLORS.palePink;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, 0, coin.radius - 4, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }

  function drawPowerUp(powerUp) {
    const meta = (activeMode === "ascension" ? ASC_POWER_META : POWER_META)[powerUp.type];
    const floatY = Math.sin(globalTime * 3.2 + powerUp.phase) * 6;
    const pulse = 1 + Math.sin(globalTime * 5 + powerUp.phase) * 0.05;
    context.save();
    context.translate(powerUp.x, powerUp.y + floatY);
    context.scale(pulse, pulse);
    context.shadowColor = meta.color;
    context.shadowBlur = 12;
    const gradient = context.createRadialGradient(-7, -8, 2, 0, 0, powerUp.radius + 5);
    gradient.addColorStop(0, COLORS.white);
    gradient.addColorStop(0.35, meta.color);
    gradient.addColorStop(1, COLORS.strongPurple);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, powerUp.radius, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = "rgba(255, 255, 255, 0.7)";
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = COLORS.black;
    context.font = `900 ${powerUp.type === "double" ? 12 : 16}px system-ui`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(meta.icon, 0, 1);
    context.restore();
  }

  function drawParticles() {
    particleList.forEach((particle) => {
      const opacity = clamp(particle.life / particle.maximumLife, 0, 1);
      context.globalAlpha = opacity;
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size * opacity, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;
  }

  function drawClassicScene() {
    context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
    context.clearRect(0, 0, WORLD.width, WORLD.height);

    const shakeX = screenShake > 0 ? randomRange(-screenShake, screenShake) : 0;
    const shakeY = screenShake > 0 ? randomRange(-screenShake * 0.45, screenShake * 0.45) : 0;
    context.save();
    context.translate(shakeX, shakeY);
    drawBackground();
    drawGround();
    coinList.forEach(drawCoin);
    powerUpList.forEach(drawPowerUp);
    obstacleList.forEach(drawObstacle);
    drawParticles();
    drawPlayer();
    context.restore();

    if (screenFlash > 0) {
      context.fillStyle = `rgba(255, 227, 254, ${screenFlash * 0.42})`;
      context.fillRect(0, 0, WORLD.width, WORLD.height);
    }

    context.fillStyle = renderCache.vignetteGradient;
    context.fillRect(0, 0, WORLD.width, WORLD.height);
  }


  function resetInterfaceCache() {
    for (const key of Object.keys(interfaceCache)) delete interfaceCache[key];
  }

  function showModeMenu() {
    window.clearTimeout(overlayTimer);
    activeMode = null;
    gameState = "menu-root";
    orientationPaused = false;
    releaseMobileJump();
    clearAscensionMovement();
    currentPower = null;
    obstacleList = [];
    coinList = [];
    powerUpList = [];
    particleList = [];
    ascPlatforms = [];
    ascHazards = [];
    ascCoins = [];
    ascPowerUps = [];
    setOverlay(ui.startOverlay, false);
    setOverlay(ui.pauseOverlay, false);
    setOverlay(ui.gameOverOverlay, false);
    ui.checkpointOverlay.classList.remove("is-visible");
    ui.modeMenu.classList.remove("is-app-hidden");
    ui.gameFrame.classList.add("is-app-hidden");
    ui.touchControls.classList.add("is-app-hidden");
    ui.touchGestureHint?.classList.add("is-app-hidden");
    ui.gameFooter.classList.add("is-app-hidden");
    document.body.classList.add("is-main-menu");
    document.body.classList.remove("is-ascension-mode");
    ui.brandEyebrow.textContent = "Arcade • V3.5";
    ui.tagline.textContent = "O mesmo ritmo da V2.2, agora com dois desafios.";
    resetInterfaceCache();
    updateInterface(true);
    scheduleLayoutSync(20);
    setStatus("Menu principal. Escolha entre Modo Clássico e Modo Ascensão.");
  }

  function configureModeCopy(mode) {
    if (mode === "classic") {
      ui.brandEyebrow.textContent = "Endless runner • Modo 1";
      ui.tagline.textContent = "Ritmo, reflexo e um salto de cada vez.";
      ui.startKicker.textContent = "A corrida começa agora";
      ui.startTitle.innerHTML = 'Até onde você<br /><span>consegue chegar?</span>';
      ui.startCopy.textContent = "Desvie dos cristais, colete energia e mantenha o ritmo.";
      ui.finalMiddleLabel.textContent = "Moedas";
      ui.startBestLabel.textContent = "Melhor corrida";
      ui.gameOverDetails.hidden = true;
      ui.gameFrame.setAttribute("aria-label", "Área do Modo Clássico do Jogo de Pular");
      canvas.setAttribute("aria-label", "Modo Clássico. Use Espaço no computador ou toque na tela no celular para pular.");
      if (ui.controlHint) ui.controlHint.innerHTML = '<kbd>ESPAÇO</kbd> salto curto / alto • mobile: toque na tela';
      if (ui.touchStartHint) ui.touchStartHint.innerHTML = 'Toque <strong>na tela</strong> para começar';
      if (ui.touchRetryHint) ui.touchRetryHint.innerHTML = 'Toque <strong>na tela</strong> para tentar novamente';
      if (ui.touchGestureHintText) ui.touchGestureHintText.textContent = 'Toque na tela para pular';
    } else {
      ui.brandEyebrow.textContent = "Vertical arcade • Modo 2";
      ui.tagline.textContent = "Suba, desvie e alcance o próximo checkpoint.";
      ui.startKicker.textContent = "A ascensão começa agora";
      ui.startTitle.innerHTML = 'Até qual <span>fase</span><br />você consegue subir?';
      ui.startCopy.textContent = "Use A/D para correr para os lados, W/S para ajustar a trajetória e Espaço para saltar. As plataformas alternam entre esquerda e direita: é preciso atravessar a arena para avançar.";
      ui.finalMiddleLabel.textContent = "Checkpoints";
      ui.startBestLabel.textContent = "Melhor ascensão";
      ui.gameOverDetails.hidden = true;
      ui.gameFrame.setAttribute("aria-label", "Área do Modo Ascensão do Jogo de Pular");
      canvas.setAttribute("aria-label", "Modo Ascensão. Use WASD para se mover e Espaço para pular. No celular, arraste o dedo horizontalmente para mover e toque na tela para pular.");
      if (ui.controlHint) ui.controlHint.innerHTML = '<kbd>WASD</kbd> mover • <kbd>ESPAÇO</kbd> pular • mobile: arraste + toque';
      if (ui.touchStartHint) ui.touchStartHint.innerHTML = '<strong>Arraste</strong> para mover • <strong>toque</strong> para começar';
      if (ui.touchRetryHint) ui.touchRetryHint.innerHTML = '<strong>Arraste</strong> para mover • <strong>toque</strong> para tentar novamente';
      if (ui.touchGestureHintText) ui.touchGestureHintText.textContent = 'Arraste ↔ para mover • toque para pular';
    }
  }

  function selectMode(mode) {
    activeMode = mode;
    gameState = "menu";
    document.body.classList.remove("is-main-menu");
    document.body.classList.toggle("is-ascension-mode", mode === "ascension");
    clearAscensionMovement();
    ui.modeMenu.classList.add("is-app-hidden");
    ui.gameFrame.classList.remove("is-app-hidden");
    ui.gameFooter.classList.remove("is-app-hidden");
    ui.touchControls.classList.add("is-app-hidden");
    bestScore = mode === "classic" ? classicBestScore : ascensionBestScore;
    configureModeCopy(mode);
    currentPower = null;
    ascReviveReady = false;
    score = 0;
    scoreFloat = 0;
    coinsCollected = 0;
    level = 1;
    if (mode === "classic") {
      resetPlayer();
      obstacleList = [];
      coinList = [];
      powerUpList = [];
    } else {
      prepareAscensionPreview();
    }
    setOverlay(ui.startOverlay, true);
    setOverlay(ui.pauseOverlay, false);
    setOverlay(ui.gameOverOverlay, false);
    ui.checkpointOverlay.classList.remove("is-visible");
    resetInterfaceCache();
    updateInterface(true);
    scheduleLayoutSync(20);
    forceNextFrame = true;
  }

  function makeAscPlatform(side, y, checkpoint = false) {
    const width = checkpoint
      ? ASC_CONFIG.checkpointWidth
      : randomRange(ASC_CONFIG.platformWidthMin, ASC_CONFIG.platformWidthMax);
    const x = side === "left"
      ? ASC_CONFIG.wallInset
      : WORLD.width - ASC_CONFIG.wallInset - width;
    ascPlatformSerial += 1;
    return {
      id: ascPlatformSerial,
      order: ascPlatformSerial,
      side,
      x,
      y,
      width,
      height: checkpoint ? 30 : ASC_CONFIG.platformHeight,
      checkpoint,
      touched: false,
    };
  }

  function populateAscensionPath() {
    if (ascPlatforms.some((platform) => platform.checkpoint && !platform.touched)) return;
    let topPlatform = ascPlatforms.reduce((best, item) => !best || item.y < best.y ? item : best, null);
    while (!topPlatform || topPlatform.y > -170) {
      const previousSide = topPlatform?.side ?? "left";
      const side = previousSide === "left" ? "right" : "left";
      const nextY = (topPlatform?.y ?? 510) - randomRange(ASC_CONFIG.minimumPlatformGap, ASC_CONFIG.maximumPlatformGap);
      const checkpoint = ascPlatformSerial + 1 >= ascCheckpointSerial;
      const platform = makeAscPlatform(checkpoint ? side : side, nextY, checkpoint);
      ascPlatforms.push(platform);

      if (!checkpoint) {
        const previousCenterX = topPlatform
          ? topPlatform.x + topPlatform.width / 2
          : (side === "left" ? WORLD.width * 0.76 : WORLD.width * 0.24);
        const currentCenterX = platform.x + platform.width / 2;
        const verticalSpan = topPlatform ? Math.max(80, topPlatform.y - platform.y) : 110;
        const coinChance = Math.random();
        if (coinChance < 0.82) {
          ascCoins.push({
            x: clamp(
              previousCenterX + (currentCenterX - previousCenterX) * randomRange(0.42, 0.68),
              ASC_CONFIG.wallInset + 28,
              WORLD.width - ASC_CONFIG.wallInset - 28,
            ),
            y: platform.y + verticalSpan * randomRange(0.34, 0.66),
            radius: 13,
            phase: Math.random() * Math.PI * 2,
          });
        }
        if (Math.random() < 0.2 && ascPowerUps.length < 2) {
          const types = Object.keys(ASC_POWER_META);
          const type = types[Math.floor(Math.random() * types.length)];
          ascPowerUps.push({
            x: clamp(
              previousCenterX + (currentCenterX - previousCenterX) * randomRange(0.5, 0.78),
              ASC_CONFIG.wallInset + 34,
              WORLD.width - ASC_CONFIG.wallInset - 34,
            ),
            y: platform.y + verticalSpan * randomRange(0.26, 0.56),
            radius: 21,
            type,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
      topPlatform = platform;
      if (checkpoint) break;
    }
  }

  function prepareAscensionPreview() {
    ascPlatforms = [];
    ascHazards = [];
    ascCoins = [];
    ascPowerUps = [];
    particleList = [];
    ascPlatformSerial = 0;
    ascCheckpointSerial = ASC_CONFIG.platformsPerStage;
    ascStage = 1;
    ascDistance = 0;
    ascCheckpointCount = 0;
    const start = makeAscPlatform("left", 505, false);
    // Keep the first ledge attached to the left wall and short enough that the
    // player must actually cross the shaft to reach the first right-side ledge.
    start.width = 330;
    ascPlatforms.push(start);
    populateAscensionPath();
    player.x = start.x + start.width * 0.52 - player.width / 2;
    player.y = start.y - player.height;
    player.velocityX = 0;
    player.velocityY = 0;
    player.grounded = true;
    player.currentSide = "left";
    player.currentPlatformId = start.id;
    ascTargetPlatformId = null;
    ascProgressOrder = start.order;
    ascProgressSide = start.side;
    ascCameraScrollRemaining = 0;
    clearAscensionMovement();
    player.runPhase = 0;
    player.squashTime = 0;
    player.facing = 1;
    ascLastSafe = { platformId: start.id, x: player.x, y: player.y, side: "left" };
  }

  function startAscensionGame() {
    window.clearTimeout(overlayTimer);
    prepareAscensionPreview();
    currentPower = null;
    ascReviveReady = false;
    ascInvulnerable = 0;
    ascHazardTimer = 2.15;
    ascLandingLock = 0;
    ascCheckpointTimer = 0;
    ascStageStartScore = 0;
    scoreFloat = 0;
    score = 0;
    coinsCollected = 0;
    level = 1;
    runTime = 0;
    newRecordTriggered = false;
    bestAtRunStart = ascensionBestScore;
    bestScore = ascensionBestScore;
    accumulator = 0;
    lastFrameTime = performance.now();
    lastRenderTimestamp = 0;
    forceNextFrame = true;
    gameState = "running";
    setOverlay(ui.startOverlay, false);
    setOverlay(ui.pauseOverlay, false);
    setOverlay(ui.gameOverOverlay, false);
    ui.recordBanner.classList.remove("is-active");
    setStatus("Ascensão iniciada. Use A/D + Espaço e avance somente pela sequência esquerda ↔ direita até o topo.");
    updateInterface(true);
  }

  function requestAscensionJump() {
    if (!player.grounded || gameState !== "running") return;
    player.grounded = false;
    player.velocityY = -ASC_CONFIG.jumpForce;
    // The jump itself is vertical. Horizontal travel is now entirely controlled
    // by A/D (or the mobile direction pad), making every landing intentional.
    player.velocityX = clamp(player.velocityX, -ASC_CONFIG.airMoveSpeed, ASC_CONFIG.airMoveSpeed);
    ascTargetPlatformId = null;
    player.jumpHeld = spaceIsDown;
    player.jumpHoldTime = 0;
    player.squashTime = 0;
    player.runPhase += 0.7;
    emitBurst(player.x + player.width / 2, player.y + player.height, reducedMotion ? 4 : 9, COLORS.pink, 150, 0.34, true);
    audio.play("jump");
  }

  function getAscHazardHitbox(hazard) {
    return { x: hazard.x + 5, y: hazard.y + 5, width: hazard.size - 10, height: hazard.size - 10 };
  }

  function safeHazardX() {
    const minimum = 170;
    const maximum = WORLD.width - 170;
    let candidate = randomRange(minimum, maximum);
    for (let attempt = 0; attempt < 8; attempt += 1) {
      if (Math.abs(candidate - (player.x + player.width / 2)) > 175) return candidate;
      candidate = randomRange(minimum, maximum);
    }
    return player.x < WORLD.width / 2 ? WORLD.width * 0.72 : WORLD.width * 0.28;
  }

  function spawnAscHazard() {
    const size = randomRange(42, 64);
    ascHazards.push({
      x: safeHazardX() - size / 2,
      y: -size - 18,
      size,
      warning: ASC_CONFIG.warningTime,
      speed: ASC_CONFIG.hazardBaseSpeed + (ascStage - 1) * ASC_CONFIG.hazardStageSpeed + randomRange(-18, 45),
      phase: Math.random() * Math.PI * 2,
    });
    const stageFactor = Math.min(0.72, (ascStage - 1) * 0.055);
    ascHazardTimer = Math.max(
      ASC_CONFIG.hazardMinimumInterval,
      ASC_CONFIG.hazardBaseInterval * (1 - stageFactor) * randomRange(0.82, 1.18),
    );
  }

  function activateAscPower(type) {
    if (type === "revive") {
      ascReviveReady = true;
      audio.play("power");
      setStatus("Segunda chance pronta. Você volta à última plataforma segura se cair.");
      return;
    }
    const duration = CONFIG.powerDurations[type];
    currentPower = { type, duration, remaining: duration };
    audio.play("power");
    emitBurst(player.x + player.width / 2, player.y + player.height / 2, reducedMotion ? 8 : 18, ASC_POWER_META[type].color, 230, 0.55);
    setStatus(`${ASC_POWER_META[type].label} ativado.`);
  }

  function useAscRevive() {
    if (!ascReviveReady || !ascLastSafe) return false;
    ascReviveReady = false;
    currentPower = null;
    ascInvulnerable = ASC_CONFIG.reviveInvulnerability;
    ascHazards = ascHazards.filter((hazard) => Math.abs(hazard.x - ascLastSafe.x) > 220 || hazard.y < 150);
    const platform = ascPlatforms.find((item) => item.id === ascLastSafe.platformId);
    if (platform) {
      player.x = clamp(ascLastSafe.x, platform.x + 8, platform.x + platform.width - player.width - 8);
      player.y = platform.y - player.height;
      player.currentPlatformId = platform.id;
      player.currentSide = platform.side;
    } else {
      player.x = ascLastSafe.x;
      player.y = ascLastSafe.y;
    }
    player.velocityX = 0;
    player.velocityY = 0;
    player.grounded = true;
    player.squashTime = CONFIG.landingSquashTime;
    screenFlash = 0.55;
    emitCelebration();
    audio.play("record");
    setStatus("Segunda chance usada. Volte a subir!");
    updateInterface(true);
    return true;
  }

  function completeAscCheckpoint(platform) {
    if (gameState !== "running" || platform.touched) return;
    platform.touched = true;
    ascCheckpointCount += 1;
    const completedStage = ascStage;
    const bonus = ASC_CONFIG.checkpointBonus * completedStage;
    scoreFloat += bonus * (currentPower?.type === "double" ? 2 : 1);
    score = Math.floor(scoreFloat);
    ascStage += 1;
    level = ascStage;
    ascCheckpointSerial = ascPlatformSerial + ASC_CONFIG.platformsPerStage;
    ascStageStartScore = score;
    ascHazards = [];
    ascHazardTimer = 1.15;
    ascCheckpointTimer = reducedMotion ? 0.35 : 0.9;
    gameState = "checkpoint";
    ui.checkpointTitle.textContent = `FASE ${completedStage} CONCLUÍDA`;
    ui.checkpointBonus.textContent = `+${bonus} pontos`;
    ui.checkpointOverlay.classList.add("is-visible");
    ui.checkpointOverlay.setAttribute("aria-hidden", "false");
    emitCelebration();
    audio.play("record");
    populateAscensionPath();
    setStatus(`Checkpoint alcançado. Fase ${ascStage} preparada.`);
    updateInterface(true);
  }

  function landOnAscPlatform(platform, previousBottom) {
    const playerBottom = player.y + player.height;
    const overlapX = player.x + player.width - 5 > platform.x && player.x + 5 < platform.x + platform.width;
    const crossedTop = previousBottom <= platform.y + 12 && playerBottom >= platform.y - 4;
    const forgivingCatch = playerBottom >= platform.y && playerBottom <= platform.y + 46;
    if (!overlapX || !(crossedTop || forgivingCatch) || player.velocityY <= 0 || ascLandingLock > 0) return false;

    // Route lock: the player may recover on an already-cleared ledge, but can
    // only climb onto the *next* platform in the alternating left/right route.
    // Higher future platforms are intentionally non-collidable until their turn,
    // which removes the old shortcut of climbing vertically through upper ledges.
    const expectedOrder = ascProgressOrder + 1;
    const isClearedRecovery = platform.order <= ascProgressOrder;
    const isExpectedNext = platform.order === expectedOrder && platform.side !== ascProgressSide;
    if (!isClearedRecovery && !isExpectedNext) return false;

    player.y = platform.y - player.height;
    player.velocityY = 0;
    player.velocityX = 0;
    player.grounded = true;
    player.currentSide = platform.side;
    player.currentPlatformId = platform.id;
    ascTargetPlatformId = null;
    player.jumpHeld = false;
    player.squashTime = CONFIG.landingSquashTime;
    player.runPhase += 1.1;
    ascLandingLock = 0.08;

    const firstTouch = !platform.touched;
    const validProgressLanding = firstTouch && isExpectedNext;

    if (validProgressLanding) platform.touched = true;

    if (validProgressLanding) {
      ascProgressOrder = platform.order;
      ascProgressSide = platform.side;
      ascStageLandings += 1;
      scoreFloat += 35 * ascStage * (currentPower?.type === "double" ? 2 : 1);

      // Camera progress is earned only by landing on the next alternating ledge.
      // Repeated vertical jumps on the same platform can no longer pull the level
      // downward or bring the checkpoint to the player.
      const desiredCameraShift = Math.max(0, ASC_CONFIG.cameraLine - player.y);
      ascCameraScrollRemaining = Math.max(ascCameraScrollRemaining, desiredCameraShift);
    }

    ascLastSafe = { platformId: platform.id, x: player.x, y: player.y, side: platform.side };
    emitBurst(player.x + player.width / 2, platform.y - 2, reducedMotion ? 4 : 10, COLORS.palePink, 135, 0.32, true);

    if (platform.checkpoint && validProgressLanding) {
      platform.touched = false;
      completeAscCheckpoint(platform);
    } else if (platform.checkpoint && !validProgressLanding) {
      setStatus("Siga a rota lateral na ordem: esquerda ↔ direita. Não é possível cortar caminho pelas plataformas acima.");
    }
    return true;
  }

  function applyAscensionCamera(deltaTime) {
    if (ascCameraScrollRemaining <= 0) return;
    const scroll = Math.min(ascCameraScrollRemaining, ASC_CONFIG.cameraScrollSpeed * deltaTime);
    ascCameraScrollRemaining -= scroll;
    player.y += scroll;
    ascDistance += scroll;
    distanceTravelled += scroll * 0.55;
    ascPlatforms.forEach((platform) => { platform.y += scroll; });
    ascHazards.forEach((hazard) => { hazard.y += scroll; });
    ascCoins.forEach((coin) => { coin.y += scroll; });
    ascPowerUps.forEach((power) => { power.y += scroll; });
    if (ascLastSafe) ascLastSafe.y += scroll;
  }

  function updateAscensionPlayer(deltaTime) {
    player.squashTime = Math.max(0, player.squashTime - deltaTime);
    ascLandingLock = Math.max(0, ascLandingLock - deltaTime);
    const previousBottom = player.y + player.height;

    const keyboardAxis = (ascMoveInput.right ? 1 : 0) - (ascMoveInput.left ? 1 : 0);
    const horizontalAxis = clamp(keyboardAxis + ascTouchAxis, -1, 1);
    if (horizontalAxis !== 0) player.facing = horizontalAxis;
    else if (Math.abs(player.velocityX) > 24) player.facing = Math.sign(player.velocityX);

    const locomotionSpeed = Math.abs(player.velocityX);
    if (player.grounded) {
      if (locomotionSpeed > 8) player.runPhase += deltaTime * (5.4 + locomotionSpeed / 58);
    } else {
      player.runPhase += deltaTime * (3.2 + locomotionSpeed / 150);
    }

    const targetHorizontalSpeed = horizontalAxis * (player.grounded ? ASC_CONFIG.groundMoveSpeed : ASC_CONFIG.airMoveSpeed);
    const horizontalAcceleration = player.grounded ? ASC_CONFIG.groundAcceleration : ASC_CONFIG.airAcceleration;

    if (horizontalAxis !== 0) {
      const difference = targetHorizontalSpeed - player.velocityX;
      const maxChange = horizontalAcceleration * deltaTime;
      player.velocityX += clamp(difference, -maxChange, maxChange);
    } else {
      const drag = ASC_CONFIG.horizontalDrag * deltaTime;
      if (Math.abs(player.velocityX) <= drag) player.velocityX = 0;
      else player.velocityX -= Math.sign(player.velocityX) * drag;
    }

    if (player.grounded) {
      // A/D lets the player choose the launch point on the current platform.
      player.x += player.velocityX * deltaTime;
      player.x = clamp(player.x, 64, WORLD.width - 64 - player.width);

      const support = ascPlatforms.find((platform) => platform.id === player.currentPlatformId);
      const supported = support
        && player.x + player.width > support.x + 3
        && player.x < support.x + support.width - 3
        && Math.abs(player.y + player.height - support.y) < 10;

      // S deliberately drops through the current ledge. It is useful for
      // recovering missed collectibles, but costs height and therefore score.
      const touchDrop = ascTouchVerticalAxis > 0.45;
      if ((ascMoveInput.down || touchDrop) && support) {
        player.grounded = false;
        player.currentPlatformId = null;
        player.y += 7;
        player.velocityY = ASC_CONFIG.dropThroughSpeed;
        ascLandingLock = 0.16;
      } else if (!supported) {
        player.grounded = false;
        player.currentPlatformId = null;
        player.velocityY = Math.max(player.velocityY, 70);
      }
    }

    if (!player.grounded) {
      player.jumpHoldTime += deltaTime;
      const holdingJump = player.jumpHeld && player.jumpHoldTime < ASC_CONFIG.jumpHoldLimit && player.velocityY < 0;
      const gravityMultiplier = holdingJump ? ASC_CONFIG.heldJumpGravity : player.jumpHeld ? 1 : ASC_CONFIG.releasedJumpGravity;
      player.velocityY += ASC_CONFIG.gravity * gravityMultiplier * deltaTime;

      // W/S are trajectory controls, not alternative jump buttons. W can
      // slightly extend or soften the arc after Space has launched the player;
      // S commits to a faster descent. This preserves jump timing as the core
      // skill while making coins, power-ups and hazards actively dodgeable.
      const touchUp = ascTouchVerticalAxis < -0.35;
      const touchDown = ascTouchVerticalAxis > 0.35;
      if (ascMoveInput.up || touchUp) player.velocityY -= ASC_CONFIG.airUpControl * deltaTime;
      if (ascMoveInput.down || touchDown) player.velocityY += ASC_CONFIG.airDownControl * deltaTime;
      player.velocityY = Math.min(player.velocityY, ASC_CONFIG.maximumFallSpeed);

      player.x += player.velocityX * deltaTime;
      player.y += player.velocityY * deltaTime;
      player.x = clamp(player.x, 64, WORLD.width - 64 - player.width);

      for (const platform of ascPlatforms) {
        if (landOnAscPlatform(platform, previousBottom)) break;
      }
    }

    applyAscensionCamera(deltaTime);

    ascPlatforms = ascPlatforms.filter((platform) => platform.y < WORLD.height + 110);
    ascCoins = ascCoins.filter((coin) => coin.y < WORLD.height + 80);
    ascPowerUps = ascPowerUps.filter((power) => power.y < WORLD.height + 80);
    populateAscensionPath();

    if (player.y > WORLD.height + 55) {
      if (!useAscRevive()) endAscensionGame();
    }
  }

  function checkAscensionCollisions() {
    const hitbox = getPlayerHitbox();

    for (let index = ascCoins.length - 1; index >= 0; index -= 1) {
      const coin = ascCoins[index];
      if (!circleTouchesPlayer(coin, hitbox)) continue;
      ascCoins.splice(index, 1);
      coinsCollected += 1;
      scoreFloat += ASC_CONFIG.coinValue * (currentPower?.type === "double" ? 2 : 1);
      emitBurst(coin.x, coin.y, reducedMotion ? 4 : 9, COLORS.pink, 120, 0.28);
      audio.play("coin");
    }

    for (let index = ascPowerUps.length - 1; index >= 0; index -= 1) {
      const power = ascPowerUps[index];
      if (!circleTouchesPlayer(power, hitbox)) continue;
      ascPowerUps.splice(index, 1);
      activateAscPower(power.type);
    }

    if (ascInvulnerable > 0) return;
    for (let index = ascHazards.length - 1; index >= 0; index -= 1) {
      const hazard = ascHazards[index];
      if (hazard.warning > 0 || !rectanglesOverlap(hitbox, getAscHazardHitbox(hazard))) continue;
      if (currentPower?.type === "shield") {
        ascHazards.splice(index, 1);
        currentPower = null;
        screenShake = 9;
        screenFlash = 0.45;
        emitBurst(hazard.x + hazard.size / 2, hazard.y + hazard.size / 2, reducedMotion ? 10 : 24, COLORS.palePink, 320, 0.6);
        audio.play("shield");
        setStatus("O escudo protegeu você de um bloco.");
      } else if (useAscRevive()) {
        return;
      } else {
        endAscensionGame();
        return;
      }
    }
  }

  function updateAscensionGame(deltaTime) {
    runTime += deltaTime;
    ascInvulnerable = Math.max(0, ascInvulnerable - deltaTime);
    updatePower(deltaTime);
    updateAscensionPlayer(deltaTime);
    if (gameState !== "running") return;

    const slowFactor = currentPower?.type === "slow" ? ASC_CONFIG.slowMotionFactor : 1;
    ascHazardTimer -= deltaTime * slowFactor;
    if (ascHazardTimer <= 0) spawnAscHazard();
    ascHazards.forEach((hazard) => {
      if (hazard.warning > 0) hazard.warning -= deltaTime;
      else hazard.y += hazard.speed * slowFactor * deltaTime;
    });
    ascHazards = ascHazards.filter((hazard) => hazard.y < WORLD.height + 90);

    scoreFloat += (24 + ascStage * 2.4) * deltaTime * (currentPower?.type === "double" ? 2 : 1);
    scoreFloat += Math.max(0, ascDistance) * 0.0016;
    ascDistance *= 0.998;
    score = Math.floor(scoreFloat);
    level = ascStage;
    checkAscensionCollisions();
    if (gameState !== "running") return;

    if (score > bestAtRunStart && score >= Math.max(100, bestAtRunStart + 1) && !newRecordTriggered) triggerNewRecord();
    screenShake = Math.max(0, screenShake - 38 * deltaTime);
    screenFlash = Math.max(0, screenFlash - 2.4 * deltaTime);
    updateParticles(deltaTime);
  }

  function endAscensionGame() {
    if (gameState !== "running") return;
    gameState = "gameover";
    player.jumpHeld = false;
    clearAscensionMovement();
    player.velocityX = 0;
    screenShake = 18;
    screenFlash = 0.78;
    emitBurst(player.x + player.width / 2, player.y + player.height / 2, reducedMotion ? 12 : 30, COLORS.pink, 360, 0.72);
    audio.play("crash");
    const beatRecord = score > ascensionBestScore;
    if (beatRecord) {
      ascensionBestScore = score;
      bestScore = score;
      saveValue("jdp-v31-ascension-best", String(score));
      if (!newRecordTriggered) triggerNewRecord();
    }
    ui.finalScore.textContent = formatScore(score);
    ui.finalCoins.textContent = String(ascCheckpointCount);
    ui.finalBest.textContent = formatScore(ascensionBestScore);
    ui.gameOverDetails.hidden = false;
    ui.gameOverDetails.textContent = `Fase ${ascStage} • ${coinsCollected} moedas • ${ascCheckpointCount} checkpoints`;
    ui.gameOverKicker.textContent = beatRecord ? "Novo recorde" : "Fim da ascensão";
    ui.gameOverTitle.textContent = beatRecord ? "Sua melhor subida!" : `Você chegou à fase ${ascStage}.`;
    ui.startBest.textContent = formatScore(ascensionBestScore);
    setStatus(`Fim da ascensão. Pontuação ${score}.`);
    updateInterface(true);
    overlayTimer = window.setTimeout(() => {
      if (gameState === "gameover") setOverlay(ui.gameOverOverlay, true);
    }, reducedMotion ? 40 : 420);
  }

  function drawAscensionWalls() {
    const wallGradient = context.createLinearGradient(0, 0, 130, 0);
    wallGradient.addColorStop(0, "rgba(9, 6, 19, 0.98)");
    wallGradient.addColorStop(0.78, "rgba(35, 18, 68, 0.88)");
    wallGradient.addColorStop(1, "rgba(124, 131, 253, 0.36)");
    context.fillStyle = wallGradient;
    context.fillRect(0, 0, 84, WORLD.height);
    context.save();
    context.translate(WORLD.width, 0);
    context.scale(-1, 1);
    context.fillStyle = wallGradient;
    context.fillRect(0, 0, 84, WORLD.height);
    context.restore();
    context.fillStyle = "rgba(255, 174, 192, 0.65)";
    context.fillRect(82, 0, 2, WORLD.height);
    context.fillRect(WORLD.width - 84, 0, 2, WORLD.height);
  }

  function drawAscPlatform(platform) {
    context.save();
    const pulse = platform.checkpoint ? 0.55 + Math.sin(globalTime * 5) * 0.18 : 0.22;
    context.shadowColor = platform.checkpoint ? COLORS.palePink : COLORS.strongPurple;
    context.shadowBlur = platform.checkpoint ? 24 : 10;
    const gradient = context.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
    gradient.addColorStop(0, platform.checkpoint ? "#f4c8ff" : "#8c66d5");
    gradient.addColorStop(0.18, platform.checkpoint ? "#bd64ef" : "#6541a6");
    gradient.addColorStop(1, "#24123e");
    context.fillStyle = gradient;
    roundedRectPath(context, platform.x, platform.y, platform.width, platform.height, 11);
    context.fill();

    // A short inward-facing nose makes every ledge read as a structure anchored
    // to the left or right wall instead of a floating center platform.
    const noseDirection = platform.side === "left" ? 1 : -1;
    const noseBaseX = platform.side === "left" ? platform.x + platform.width - 2 : platform.x + 2;
    context.beginPath();
    context.moveTo(noseBaseX, platform.y + 5);
    context.lineTo(noseBaseX + noseDirection * 20, platform.y + platform.height / 2);
    context.lineTo(noseBaseX, platform.y + platform.height - 5);
    context.closePath();
    context.fillStyle = platform.checkpoint ? "#b95ce9" : "#5e3899";
    context.fill();

    context.shadowBlur = 0;
    context.strokeStyle = platform.checkpoint ? `rgba(255,227,254,${0.7 + pulse * 0.2})` : "rgba(255,227,254,0.36)";
    context.lineWidth = platform.checkpoint ? 2.4 : 1.4;
    context.stroke();
    context.fillStyle = "rgba(255,255,255,0.14)";
    roundedRectPath(context, platform.x + 10, platform.y + 5, Math.max(24, platform.width * 0.22), 4, 2);
    context.fill();
    if (platform.checkpoint) {
      const centerX = platform.x + platform.width / 2;
      const ringY = platform.y - 34;
      context.strokeStyle = `rgba(255,227,254,${0.62 + Math.sin(globalTime * 6) * 0.16})`;
      context.lineWidth = 5;
      context.shadowColor = COLORS.strongPurple;
      context.shadowBlur = 22;
      context.beginPath();
      context.ellipse(centerX, ringY, 82, 21, 0, 0, Math.PI * 2);
      context.stroke();
      context.shadowBlur = 0;
      context.fillStyle = COLORS.palePink;
      context.font = "900 38px system-ui";
      context.textAlign = "center";
      context.fillText("↑", centerX, ringY - 22);
    }
    context.restore();
  }

  function drawAscHazard(hazard) {
    const centerX = hazard.x + hazard.size / 2;
    if (hazard.warning > 0) {
      const alpha = 0.25 + Math.abs(Math.sin(globalTime * 12 + hazard.phase)) * 0.55;
      context.save();
      context.globalAlpha = alpha;
      context.strokeStyle = COLORS.pink;
      context.lineWidth = 3;
      context.setLineDash([8, 8]);
      context.beginPath();
      context.moveTo(centerX, 4);
      context.lineTo(centerX, 54);
      context.stroke();
      context.setLineDash([]);
      context.fillStyle = COLORS.palePink;
      context.beginPath();
      context.moveTo(centerX, 62);
      context.lineTo(centerX - 9, 46);
      context.lineTo(centerX + 9, 46);
      context.closePath();
      context.fill();
      context.restore();
      return;
    }
    context.save();
    context.translate(hazard.x, hazard.y);
    context.shadowColor = "rgba(255,72,125,0.7)";
    context.shadowBlur = 15;
    const grad = context.createLinearGradient(0, 0, hazard.size, hazard.size);
    grad.addColorStop(0, "#30203e");
    grad.addColorStop(0.55, "#110917");
    grad.addColorStop(1, "#050309");
    context.fillStyle = grad;
    roundedRectPath(context, 0, 0, hazard.size, hazard.size, 12);
    context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = "rgba(255,82,126,0.9)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(hazard.size * 0.2, hazard.size * 0.15);
    context.lineTo(hazard.size * 0.48, hazard.size * 0.46);
    context.lineTo(hazard.size * 0.38, hazard.size * 0.78);
    context.moveTo(hazard.size * 0.52, hazard.size * 0.12);
    context.lineTo(hazard.size * 0.66, hazard.size * 0.42);
    context.lineTo(hazard.size * 0.86, hazard.size * 0.62);
    context.stroke();
    context.restore();
  }

  function drawAscensionScene() {
    context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
    context.clearRect(0, 0, WORLD.width, WORLD.height);
    const shakeX = screenShake > 0 ? randomRange(-screenShake, screenShake) : 0;
    const shakeY = screenShake > 0 ? randomRange(-screenShake * 0.45, screenShake * 0.45) : 0;
    context.save();
    context.translate(shakeX, shakeY);
    drawBackground();
    drawAscensionWalls();
    ascPlatforms.forEach(drawAscPlatform);
    ascCoins.forEach(drawCoin);
    ascPowerUps.forEach(drawPowerUp);
    ascHazards.forEach(drawAscHazard);
    drawParticles();
    drawPlayer();
    context.restore();
    if (ascInvulnerable > 0) {
      context.save();
      context.globalAlpha = 0.14 + Math.sin(globalTime * 18) * 0.06;
      context.fillStyle = COLORS.palePink;
      context.fillRect(0, 0, WORLD.width, WORLD.height);
      context.restore();
    }
    if (screenFlash > 0) {
      context.fillStyle = `rgba(255, 227, 254, ${screenFlash * 0.42})`;
      context.fillRect(0, 0, WORLD.width, WORLD.height);
    }
    context.fillStyle = renderCache.vignetteGradient;
    context.fillRect(0, 0, WORLD.width, WORLD.height);
  }

  function updateGame(deltaTime) {
    if (activeMode === "ascension") updateAscensionGame(deltaTime);
    else if (activeMode === "classic") updateClassicGame(deltaTime);
  }

  function drawScene() {
    if (activeMode === "ascension") drawAscensionScene();
    else drawClassicScene();
  }

  function getFrameInterval() {
    if (gameState === "running" || gameState === "checkpoint") return 1000 / CONFIG.activeFrameRate;
    if (gameState === "paused" || gameState === "menu-root") return 1000 / CONFIG.pausedFrameRate;
    return 1000 / CONFIG.idleFrameRate;
  }

  function frame(timestamp) {
    if (document.hidden) {
      lastFrameTime = timestamp;
      lastRenderTimestamp = timestamp;
      window.requestAnimationFrame(frame);
      return;
    }

    const frameInterval = getFrameInterval();
    const elapsedSinceRender = timestamp - lastRenderTimestamp;
    if (!forceNextFrame && elapsedSinceRender < frameInterval - 0.75) {
      window.requestAnimationFrame(frame);
      return;
    }

    forceNextFrame = false;
    // Using the current timestamp as the new baseline guarantees the game can
    // never render above the selected cap, even on 120/144/240 Hz monitors.
    lastRenderTimestamp = timestamp;
    const rawDelta = Math.min((timestamp - lastFrameTime) / 1000, 0.05);
    lastFrameTime = timestamp;
    globalTime += rawDelta;

    if (gameState === "checkpoint") {
      ascCheckpointTimer = Math.max(0, ascCheckpointTimer - rawDelta);
      updateParticles(rawDelta);
      if (ascCheckpointTimer <= 0) {
        ui.checkpointOverlay.classList.remove("is-visible");
        ui.checkpointOverlay.setAttribute("aria-hidden", "true");
        gameState = "running";
        accumulator = 0;
      }
    } else if (gameState === "running") {
      accumulator += rawDelta;
      let steps = 0;
      while (accumulator >= CONFIG.fixedStep && steps < 4) {
        updateGame(CONFIG.fixedStep);
        accumulator -= CONFIG.fixedStep;
        steps += 1;
        if (gameState !== "running") break;
      }
    } else if (gameState !== "paused") {
      updateAmbient(rawDelta);
    }

    if (activeMode) drawScene();
    updateInterface();
    window.requestAnimationFrame(frame);
  }

  // Dormant test hooks. They exist only when a test harness explicitly enables
  // them before this script loads and are never exposed during normal play.
  if (window.__JDP_ENABLE_QA__ === true) {
    Object.defineProperty(window, "__JDP_QA__", {
      configurable: true,
      value: Object.freeze({
        activatePower(type) {
          if (POWER_META[type]) activatePower(type);
          updateInterface();
        },
        forceCoinCollection() {
          const before = scoreFloat;
          coinList.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            radius: 13,
            phase: 0,
          });
          checkCollisions();
          score = Math.floor(scoreFloat);
          updateInterface();
          return scoreFloat - before;
        },
        forceObstacleCollision() {
          const obstacle = createObstacle(OBSTACLE_TYPES[1], player.x);
          obstacleList.push(obstacle);
          checkCollisions();
          updateInterface();
        },
        forceAscCheckpoint() {
          if (activeMode !== "ascension") return false;
          const platform = ascPlatforms.find((item) => item.checkpoint);
          if (!platform) return false;
          player.x = platform.x + platform.width / 2 - player.width / 2;
          player.y = platform.y - player.height;
          player.velocityY = 1;
          player.grounded = false;
          platform.touched = false;
          completeAscCheckpoint(platform);
          return true;
        },
        forceAscHazardCollision() {
          if (activeMode !== "ascension") return false;
          ascHazards.push({
            x: player.x, y: player.y, size: Math.max(player.width, player.height),
            warning: 0, speed: 0, phase: 0,
          });
          checkAscensionCollisions();
          return true;
        },
        forceAscFatalCollision() {
          if (activeMode !== "ascension") return false;
          currentPower = null;
          ascReviveReady = false;
          ascInvulnerable = 0;
          ascHazards = [{
            x: player.x, y: player.y, size: Math.max(player.width, player.height),
            warning: 0, speed: 0, phase: 0,
          }];
          checkAscensionCollisions();
          return true;
        },
        giveAscRevive() {
          if (activeMode !== "ascension") return false;
          ascReviveReady = true;
          updateInterface(true);
          return true;
        },
        getState() {
          return {
            gameState,
            score,
            coinsCollected,
            power: currentPower?.type ?? null,
            activeMode,
            ascStage,
            ascCheckpointCount,
            ascReviveReady,
            moveInput: { ...ascMoveInput },
            touchAxis: Number(ascTouchAxis.toFixed(2)),
            touchVerticalAxis: Number(ascTouchVerticalAxis.toFixed(2)),
            player: { x: Math.round(player.x), y: Math.round(player.y), grounded: player.grounded, platformId: player.currentPlatformId, side: player.currentSide, facing: player.facing },
            ascProgressOrder,
            ascProgressSide,
            ascCameraScrollRemaining: Math.round(ascCameraScrollRemaining),
            ascPlatforms: ascPlatforms.map((p) => ({ id:p.id, order:p.order, side:p.side, x:Math.round(p.x), y:Math.round(p.y), width:Math.round(p.width), checkpoint:p.checkpoint, touched:p.touched })).slice(0,10),
          };
        },
      }),
    });
  }

  document.addEventListener("keydown", (event) => {
    const ascensionDirections = {
      KeyW: "up", ArrowUp: "up",
      KeyS: "down", ArrowDown: "down",
      KeyA: "left", ArrowLeft: "left",
      KeyD: "right", ArrowRight: "right",
    };

    if (activeMode === "ascension" && ascensionDirections[event.code]) {
      event.preventDefault();
      setAscensionMoveDirection(ascensionDirections[event.code], true);
      audio.ensureContext();
      return;
    }

    if (event.code !== "Space") return;
    event.preventDefault();
    if (event.repeat) return;

    spaceIsDown = true;
    audio.ensureContext();

    if (gameState === "menu" || gameState === "gameover") {
      startGame();
    } else if (gameState === "running") {
      requestJump();
    }
  });

  document.addEventListener("keyup", (event) => {
    const ascensionDirections = {
      KeyW: "up", ArrowUp: "up",
      KeyS: "down", ArrowDown: "down",
      KeyA: "left", ArrowLeft: "left",
      KeyD: "right", ArrowRight: "right",
    };

    if (activeMode === "ascension" && ascensionDirections[event.code]) {
      event.preventDefault();
      setAscensionMoveDirection(ascensionDirections[event.code], false);
      return;
    }

    if (event.code !== "Space") return;
    event.preventDefault();
    spaceIsDown = false;
    releaseJump();
  });


  const TOUCH_SURFACE = Object.freeze({
    dragDeadZone: 12,
    fullSpeedDistance: 88,
    tapMaxDistance: 15,
    tapMaxDuration: 420,
    syntheticJumpHold: 0.14,
  });

  function isTouchSurfaceTargetBlocked(target) {
    return Boolean(target?.closest?.("button, a, input, select, textarea, [role='button']"));
  }

  function resetTouchSurfacePointer(pointerId) {
    touchSurfacePointers.delete(pointerId);
    if (touchMovePointerId === pointerId) {
      touchMovePointerId = null;
      ascTouchAxis = 0;
      ascTouchVerticalAxis = 0;
    }
  }

  function updateTouchPadFeedback(event, dx = 0, dy = 0, visible = true) {
    if (!ui.touchPadFeedback) return;
    if (!visible) {
      ui.touchPadFeedback.classList.add("is-app-hidden");
      ui.touchPadFeedback.classList.remove("is-active", "is-tap");
      return;
    }
    const bounds = ui.gameFrame.getBoundingClientRect();
    const x = clamp(event.clientX - bounds.left, 24, Math.max(24, bounds.width - 24));
    const y = clamp(event.clientY - bounds.top, 24, Math.max(24, bounds.height - 24));
    const thumbOffsetX = clamp(dx / 4, -14, 14);
    const thumbOffsetY = clamp(dy / 4, -14, 14);
    ui.touchPadFeedback.style.left = `${x}px`;
    ui.touchPadFeedback.style.top = `${y}px`;
    ui.touchPadFeedback.style.setProperty("--touch-thumb-x", `${thumbOffsetX}px`);
    ui.touchPadFeedback.style.setProperty("--touch-thumb-y", `${thumbOffsetY}px`);
    ui.touchPadFeedback.classList.remove("is-app-hidden");
    ui.touchPadFeedback.classList.add("is-active");
  }

  function triggerScreenTapJump() {
    if (!mobileLayout || isPortraitViewport() || !activeMode) return;
    audio.ensureContext();
    requestLandscapeExperience({ silent: true }).catch(() => {});

    if (gameState === "menu" || gameState === "gameover") {
      startGame();
      return;
    }
    if (gameState !== "running") return;

    spaceIsDown = true;
    requestJump();
    window.setTimeout(() => {
      spaceIsDown = false;
      releaseJump();
    }, TOUCH_SURFACE.syntheticJumpHold * 1000);
  }

  function beginTouchSurfaceGesture(event) {
    if (!mobileLayout || isPortraitViewport() || !activeMode) return;
    if (event.pointerType === "mouse" || isTouchSurfaceTargetBlocked(event.target)) return;
    event.preventDefault();
    audio.ensureContext();
    requestLandscapeExperience({ silent: true }).catch(() => {});

    touchSurfacePointers.set(event.pointerId, {
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      startedAt: performance.now(),
      dragging: false,
    });

    updateTouchPadFeedback(event, 0, 0, true);

    if (typeof ui.gameFrame.setPointerCapture === "function") {
      try { ui.gameFrame.setPointerCapture(event.pointerId); } catch { /* optional */ }
    }
  }

  function moveTouchSurfaceGesture(event) {
    const gesture = touchSurfacePointers.get(event.pointerId);
    if (!gesture || !mobileLayout || isPortraitViewport()) return;
    if (event.cancelable) event.preventDefault();

    gesture.lastX = event.clientX;
    gesture.lastY = event.clientY;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    const distance = Math.hypot(dx, dy);

    if (!gesture.dragging && distance >= TOUCH_SURFACE.dragDeadZone) {
      gesture.dragging = true;
      if (touchMovePointerId === null || touchMovePointerId === event.pointerId) touchMovePointerId = event.pointerId;
    }

    if (activeMode === "ascension" && gesture.dragging && touchMovePointerId === event.pointerId) {
      const horizontalDominant = Math.abs(dx) >= Math.abs(dy) * 0.72;
      const verticalDominant = Math.abs(dy) > Math.abs(dx) * 1.12;

      ascTouchAxis = horizontalDominant
        ? clamp(dx / TOUCH_SURFACE.fullSpeedDistance, -1, 1)
        : 0;
      ascTouchVerticalAxis = verticalDominant
        ? clamp(dy / TOUCH_SURFACE.fullSpeedDistance, -1, 1)
        : 0;

      if (Math.abs(ascTouchAxis) < 0.08) ascTouchAxis = 0;
      if (Math.abs(ascTouchVerticalAxis) < 0.12) ascTouchVerticalAxis = 0;
      updateTouchPadFeedback(event, dx, dy, true);
    }
  }

  function endTouchSurfaceGesture(event) {
    const gesture = touchSurfacePointers.get(event.pointerId);
    if (!gesture) return;
    if (event.cancelable) event.preventDefault();

    const elapsed = performance.now() - gesture.startedAt;
    const distance = Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY);
    const wasMovementPointer = touchMovePointerId === event.pointerId;
    const isTap = !gesture.dragging && distance <= TOUCH_SURFACE.tapMaxDistance && elapsed <= TOUCH_SURFACE.tapMaxDuration;

    resetTouchSurfacePointer(event.pointerId);
    if (wasMovementPointer) {
      ascTouchAxis = 0;
      ascTouchVerticalAxis = 0;
    }
    if (isTap && ui.touchPadFeedback) {
      ui.touchPadFeedback.classList.add("is-tap");
      window.setTimeout(() => updateTouchPadFeedback(event, 0, 0, false), 120);
      triggerScreenTapJump();
    } else {
      updateTouchPadFeedback(event, 0, 0, false);
    }
  }

  ui.gameFrame.addEventListener("pointerdown", beginTouchSurfaceGesture, { passive: false });
  ui.gameFrame.addEventListener("pointermove", moveTouchSurfaceGesture, { passive: false });
  ui.gameFrame.addEventListener("pointerup", endTouchSurfaceGesture, { passive: false });
  ui.gameFrame.addEventListener("pointercancel", endTouchSurfaceGesture, { passive: false });
  ui.gameFrame.addEventListener("lostpointercapture", (event) => {
    resetTouchSurfacePointer(event.pointerId);
    if (touchSurfacePointers.size === 0) updateTouchPadFeedback(event, 0, 0, false);
  });
  ui.gameFrame.addEventListener("contextmenu", (event) => {
    if (mobileLayout) event.preventDefault();
  });

  // The first real touch is the earliest standards-compliant opportunity to
  // enter fullscreen and lock orientation on most Android browsers.
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (firstMobileGestureHandled || !isTouchMobileLayout()) return;
      if (event.target.closest?.("#landscapeButton")) return;
      firstMobileGestureHandled = true;
      requestLandscapeExperience().catch(() => {});
    },
    { capture: true, passive: true },
  );

  const mobileMoveButtons = [
    [ui.moveUpButton, "up"],
    [ui.moveLeftButton, "left"],
    [ui.moveRightButton, "right"],
    [ui.moveDownButton, "down"],
  ];

  mobileMoveButtons.forEach(([button, direction]) => {
    if (!button) return;
    button.addEventListener("pointerdown", (event) => {
      if (activeMode !== "ascension" || !mobileLayout || isPortraitViewport()) return;
      event.preventDefault();
      audio.ensureContext();
      requestLandscapeExperience({ silent: true }).catch(() => {});
      activeMovePointers.set(event.pointerId, direction);
      setAscensionMoveDirection(direction, true);
      button.classList.add("is-pressed");
      if (typeof button.setPointerCapture === "function") {
        try { button.setPointerCapture(event.pointerId); } catch { /* optional */ }
      }
    });

    const releaseMove = (event) => {
      const heldDirection = activeMovePointers.get(event.pointerId);
      if (heldDirection !== direction) return;
      activeMovePointers.delete(event.pointerId);
      setAscensionMoveDirection(direction, false);
      button.classList.remove("is-pressed");
    };

    button.addEventListener("pointerup", releaseMove);
    button.addEventListener("pointercancel", releaseMove);
    button.addEventListener("lostpointercapture", releaseMove);
    button.addEventListener("contextmenu", (event) => event.preventDefault());
  });

  ui.jumpButton.addEventListener("pointerdown", (event) => {
    if (!mobileLayout || isPortraitViewport()) return;
    event.preventDefault();
    audio.ensureContext();
    requestLandscapeExperience({ silent: true }).catch(() => {});

    activeJumpPointerId = event.pointerId;
    if (typeof ui.jumpButton.setPointerCapture === "function") {
      try {
        ui.jumpButton.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is an enhancement, not a requirement.
      }
    }

    ui.jumpButton.classList.add("is-pressed");
    spaceIsDown = true;

    if (gameState === "menu" || gameState === "gameover") {
      startGame();
    } else if (gameState === "running") {
      requestJump();
    }
  });

  const endTouchJump = (event) => {
    if (activeJumpPointerId !== null && event.pointerId !== activeJumpPointerId) return;
    if (event.cancelable) event.preventDefault();
    releaseMobileJump();
  };

  ui.jumpButton.addEventListener("pointerup", endTouchJump);
  ui.jumpButton.addEventListener("pointercancel", endTouchJump);
  ui.jumpButton.addEventListener("lostpointercapture", endTouchJump);
  ui.jumpButton.addEventListener("contextmenu", (event) => event.preventDefault());


  ui.playClassicButton.addEventListener("click", () => {
    audio.ensureContext();
    selectMode("classic");
  });

  ui.playAscensionButton.addEventListener("click", () => {
    audio.ensureContext();
    selectMode("ascension");
  });

  const returnToMenu = () => {
    if (activeMode === "classic" && score > classicBestScore) {
      classicBestScore = score;
      saveValue("jdp-v31-classic-best", String(score));
      saveValue("jdp-v2-best", String(score));
    } else if (activeMode === "ascension" && score > ascensionBestScore) {
      ascensionBestScore = score;
      saveValue("jdp-v31-ascension-best", String(score));
    }
    showModeMenu();
  };

  ui.startMenuButton.addEventListener("click", returnToMenu);
  ui.gameOverMenuButton.addEventListener("click", returnToMenu);
  ui.pauseMenuButton.addEventListener("click", returnToMenu);
  ui.menuButton.addEventListener("click", () => {
    audio.ensureContext();
    if (gameState === "running") {
      pauseGame("menu");
      ui.pauseTitle.textContent = "Voltar ao menu?";
      ui.pauseMessage.textContent = "A partida atual será encerrada. Você poderá escolher outro modo.";
    } else if (gameState === "paused") {
      ui.pauseTitle.textContent = "Voltar ao menu?";
      ui.pauseMessage.textContent = "A partida atual será encerrada. Você poderá escolher outro modo.";
      setOverlay(ui.pauseOverlay, true);
    } else {
      showModeMenu();
    }
  });

  ui.landscapeButton.addEventListener("click", async () => {
    audio.ensureContext();
    ui.landscapeButton.disabled = true;
    const originalText = ui.landscapeButton.innerHTML;
    ui.landscapeButton.innerHTML = '<span aria-hidden="true">↻</span> Ajustando tela…';

    try {
      await requestLandscapeExperience();
    } finally {
      window.setTimeout(() => {
        ui.landscapeButton.disabled = false;
        ui.landscapeButton.innerHTML = originalText;
      }, 320);
    }
  });

  ui.pauseButton.addEventListener("click", () => {
    audio.ensureContext();
    if (gameState === "running") pauseGame("manual");
    else if (gameState === "paused" && !orientationPaused) resumeGame();
  });

  ui.resumeButton.addEventListener("click", () => {
    audio.ensureContext();
    if (!orientationPaused) resumeGame();
  });

  ui.soundButton.addEventListener("click", () => {
    audio.ensureContext();
    audio.setMuted(!audio.muted);
    if (!audio.muted) audio.play("coin");
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      orientationPaused = false;
      pauseGame("focus");
    } else {
      scheduleLayoutSync(40);
    }
  });

  window.addEventListener("blur", () => {
    // Mobile fullscreen/orientation changes can transiently blur the window.
    // document.hidden remains the reliable signal when the app is actually left.
    if (!mobileLayout) pauseGame("focus");
  });

  window.addEventListener("resize", () => scheduleLayoutSync(), { passive: true });
  window.addEventListener("orientationchange", () => scheduleLayoutSync(90), { passive: true });
  document.addEventListener("fullscreenchange", () => scheduleLayoutSync(70));
  document.addEventListener("webkitfullscreenchange", () => scheduleLayoutSync(70));

  if (screen.orientation && typeof screen.orientation.addEventListener === "function") {
    screen.orientation.addEventListener("change", () => scheduleLayoutSync(70));
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => scheduleLayoutSync(), { passive: true });
    window.visualViewport.addEventListener("scroll", syncVisualViewport, { passive: true });
  }

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => scheduleLayoutSync());
    observer.observe(ui.gameFrame);
  }

  updateSoundButton();
  updateMobileExperience();
  showModeMenu();
  resizeCanvas();

  window.requestAnimationFrame(frame);
})();
