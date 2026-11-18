// Cadence v3.2 — Apple Music UI, White/Dark Adaptive Theme & 3-Wheel Color Studio
// Author: tripydro123

(function CadenceStudio() {
  if (!window.Spicetify || !Spicetify.PopupModal || !Spicetify.Topbar) {
    setTimeout(CadenceStudio, 300);
    return;
  }

  const STORAGE_KEY = "cadence_v32_apple_music_ui";
  const INSTALL_WIN = "iwr -useb https://raw.githubusercontent.com/tripydro123/cadence/main/install.ps1 | iex";
  const INSTALL_UNIX = "curl -fsSL https://raw.githubusercontent.com/tripydro123/cadence/main/install.sh | sh";

  const PRESETS = [
    { name: "Apple Music White", accent: "#fa2d48", surface: "#ffffff", text: "#1d1d1f", isWhiteBtn: true },
    { name: "Apple Music Dark", accent: "#fa2d48", surface: "#1c1c1e", text: "#ffffff", isWhiteBtn: false },
    { name: "iOS Warm White", accent: "#ff2d55", surface: "#f9f9fb", text: "#1d1d1f", isWhiteBtn: true },
    { name: "OLED Pure Black", accent: "#ff375f", surface: "#000000", text: "#ffffff", isWhiteBtn: false }
  ];

  const defaultState = {
    accentHex: "#fa2d48",
    surfaceHex: "#ffffff",
    textHex: "#1d1d1f",
    autoTextContrast: true,
    borderRadius: 12,
    ambientBackdrop: true,
    floatingPlayer: true,
    squircleHighlight: true,
    editorialHeaders: true,
    compactSidebar: true,
    adBlock: true,
    lyricTheater: false,
    lyricGlow: true,
    lyricScale: 1.18
  };

  let state = Object.assign({}, defaultState, JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // Color helpers for circular HSV wheels
  function hexToHsv(hex) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (d !== 0) {
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return { h: h * 360, s, v };
  }

  function hsvToHex(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const toHex = (n) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function shiftHex(hex, amount) {
    const clean = hex.replace("#", "");
    const clamp = (n) => Math.max(0, Math.min(255, n));
    const r = clamp(parseInt(clean.substring(0, 2), 16) + amount);
    const g = clamp(parseInt(clean.substring(2, 4), 16) + amount);
    const b = clamp(parseInt(clean.substring(4, 6), 16) + amount);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  function getLuminance(hex) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  function hexToRgba(hex, alpha) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  async function copyToClipboard(text, btnEl, defaultLabel) {
    let copied = false;
    try {
      if (window.Spicetify?.Platform?.ClipboardAPI?.copy) {
        await Spicetify.Platform.ClipboardAPI.copy(text);
        copied = true;
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (e) {
      copied = false;
    }

    if (!copied) {
      const temp = document.createElement("textarea");
      temp.value = text;
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.select();
      copied = document.execCommand("copy");
      document.body.removeChild(temp);
    }

    if (copied) {
      btnEl.textContent = "Copied!";
      if (window.Spicetify?.showNotification) {
        Spicetify.showNotification("Copied to clipboard!");
      }
      setTimeout(() => {
        btnEl.textContent = defaultLabel;
      }, 2000);
    }
  }

  function ensureBackdropLayer() {
    let layer = document.getElementById("cadence-art-backdrop");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "cadence-art-backdrop";
      layer.innerHTML = `
        <div class="cadence-backdrop-orb orb-a"></div>
        <div class="cadence-backdrop-orb orb-b"></div>
      `;
      document.body.prepend(layer);
    }
    return layer;
  }

  function updateBackdropArt() {
    const layer = ensureBackdropLayer();
    layer.classList.toggle("cadence-hidden", !state.ambientBackdrop);
    if (!state.ambientBackdrop) return;

    const item = Spicetify.Player?.data?.item;
    const images = item?.album?.images || item?.images || [];
    const imgUrl = images[0]?.url || item?.metadata?.image_xlarge_url || item?.metadata?.image_url || "";

    if (imgUrl) {
      const resolvedUrl = imgUrl.startsWith("spotify:image:")
        ? `https://i.scdn.co/image/${imgUrl.replace("spotify:image:", "")}`
        : imgUrl;
      layer.querySelector(".orb-a").style.backgroundImage = `url("${resolvedUrl}")`;
      layer.querySelector(".orb-b").style.backgroundImage = `url("${resolvedUrl}")`;
    }
  }

  function applyVisualPrefs() {
    const root = document.documentElement;
    const isLight = getLuminance(state.surfaceHex) > 0.58;

    if (state.autoTextContrast) {
      state.textHex = isLight ? "#1d1d1f" : "#ffffff";
    }

    // Authentic Apple Music Light (#f5f5f7 sidebar / #ffffff canvas) & Dark (#1c1c1e / #141416) surfaces
    const sidebarBg = isLight ? shiftHex(state.surfaceHex, -10) : shiftHex(state.surfaceHex, 6);
    const elevatedBg = isLight ? "#ffffff" : shiftHex(state.surfaceHex, 14);
    const cardBg = isLight ? shiftHex(state.surfaceHex, -6) : shiftHex(state.surfaceHex, 10);
    const hoverBg = isLight ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.08)";
    const pressBg = isLight ? "rgba(0, 0, 0, 0.09)" : "rgba(255, 255, 255, 0.13)";
    const tintedBg = isLight ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.06)";
    const borderCol = isLight ? "rgba(0, 0, 0, 0.09)" : "rgba(255, 255, 255, 0.1)";
    const subtextCol = hexToRgba(state.textHex, 0.62);

    root.style.setProperty("--cadence-accent", state.accentHex);
    root.style.setProperty("--cadence-accent-soft", hexToRgba(state.accentHex, isLight ? 0.12 : 0.2));
    root.style.setProperty("--cadence-surface", state.surfaceHex);
    root.style.setProperty("--cadence-sidebar", sidebarBg);
    root.style.setProperty("--cadence-elevated", elevatedBg);
    root.style.setProperty("--cadence-card", cardBg);
    root.style.setProperty("--cadence-surface-hover", hoverBg);
    root.style.setProperty("--cadence-surface-press", pressBg);
    root.style.setProperty("--cadence-tinted", tintedBg);
    root.style.setProperty("--cadence-border", borderCol);
    root.style.setProperty("--cadence-text", state.textHex);
    root.style.setProperty("--cadence-subtext", subtextCol);
    root.style.setProperty("--cadence-radius", `${state.borderRadius}px`);
    root.style.setProperty("--cadence-lyric-scale", `${state.lyricScale}`);

    // Spicetify Core Variables
    root.style.setProperty("--spice-button", state.accentHex);
    root.style.setProperty("--spice-button-active", state.accentHex);
    root.style.setProperty("--spice-notification", state.accentHex);
    root.style.setProperty("--spice-main", state.surfaceHex);
    root.style.setProperty("--spice-sidebar", sidebarBg);
    root.style.setProperty("--spice-player", elevatedBg);
    root.style.setProperty("--spice-card", cardBg);
    root.style.setProperty("--spice-selected-row", hoverBg);
    root.style.setProperty("--spice-misc", tintedBg);
    root.style.setProperty("--spice-text", state.textHex);
    root.style.setProperty("--spice-subtext", subtextCol);

    document.body.classList.toggle("cadence-light-mode", isLight);
    document.body.classList.toggle("cadence-adblock-active", !!state.adBlock);
    document.body.classList.toggle("cadence-floating-player", !!state.floatingPlayer);
    document.body.classList.toggle("cadence-squircle-cards", !!state.squircleHighlight);
    document.body.classList.toggle("cadence-editorial-headers", !!state.editorialHeaders);
    document.body.classList.toggle("cadence-compact-ui", !!state.compactSidebar);
    document.body.classList.toggle("cadence-lyric-theater", !!state.lyricTheater);
    document.body.classList.toggle("cadence-lyric-glow", !!state.lyricGlow);

    updateBackdropArt();
  }

  // Circular Color Wheel Component
  function mountCircularWheel(containerEl, initialHex, onChange) {
    let hsv = hexToHsv(initialHex);
    const size = 116;
    const radius = size / 2;

    containerEl.innerHTML = `
      <div class="cadence-wheel-box" style="width:${size}px;height:${size}px;">
        <canvas width="${size}" height="${size}" class="cadence-wheel-canvas" style="width:${size}px;height:${size}px;"></canvas>
        <div class="cadence-wheel-cursor"></div>
      </div>
      <div class="cadence-brightness-row">
        <span>Shade</span>
        <input type="range" class="cadence-val-slider" min="0" max="1" step="0.01" value="${hsv.v}" />
      </div>
      <div class="cadence-hex-badge">${initialHex.toUpperCase()}</div>
    `;

    const canvas = containerEl.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const cursor = containerEl.querySelector(".cadence-wheel-cursor");
    const valSlider = containerEl.querySelector(".cadence-val-slider");
    const hexBadge = containerEl.querySelector(".cadence-hex-badge");

    function renderWheel() {
      const img = ctx.createImageData(size, size);
      const data = img.data;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const dx = x - radius;
          const dy = y - radius;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const idx = (y * size + x) * 4;

          if (dist <= radius) {
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
            const hue = (angle + 360) % 360;
            const sat = Math.min(1, dist / radius);
            const hex = hsvToHex(hue, sat, hsv.v);
            data[idx] = parseInt(hex.slice(1, 3), 16);
            data[idx + 1] = parseInt(hex.slice(3, 5), 16);
            data[idx + 2] = parseInt(hex.slice(5, 7), 16);
            data[idx + 3] = 255;
          } else {
            data[idx + 3] = 0;
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    function updateCursorPosition() {
      const rad = (hsv.h * Math.PI) / 180;
      const dist = hsv.s * (radius - 6);
      const cx = radius + Math.cos(rad) * dist;
      const cy = radius + Math.sin(rad) * dist;
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
      const hex = hsvToHex(hsv.h, hsv.s, hsv.v);
      cursor.style.backgroundColor = hex;
      hexBadge.textContent = hex.toUpperCase();
    }

    function pickAtPointer(e) {
      const rect = canvas.getBoundingClientRect();
      const dx = e.clientX - rect.left - radius;
      const dy = e.clientY - rect.top - radius;
      const dist = Math.min(radius, Math.sqrt(dx * dx + dy * dy));
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      hsv.h = (angle + 360) % 360;
      hsv.s = dist / radius;
      updateCursorPosition();
      onChange(hsvToHex(hsv.h, hsv.s, hsv.v));
    }

    let dragging = false;
    canvas.addEventListener("pointerdown", (e) => {
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
      pickAtPointer(e);
    });
    canvas.addEventListener("pointermove", (e) => {
      if (dragging) pickAtPointer(e);
    });
    canvas.addEventListener("pointerup", (e) => {
      dragging = false;
      canvas.releasePointerCapture(e.pointerId);
    });

    valSlider.addEventListener("input", (e) => {
      hsv.v = Number(e.target.value);
      renderWheel();
      updateCursorPosition();
      onChange(hsvToHex(hsv.h, hsv.s, hsv.v));
    });

    renderWheel();
    updateCursorPosition();

    return {
      setHex(newHex) {
        hsv = hexToHsv(newHex);
        valSlider.value = hsv.v;
        renderWheel();
        updateCursorPosition();
      }
    };
  }

  function toggleCadenceModal() {
    if (document.querySelector(".cadence-studio-wrap")) {
      Spicetify.PopupModal.hide();
      return;
    }
    openCadenceModal();
  }

  function openCadenceModal() {
    const container = document.createElement("div");
    container.className = "cadence-studio-wrap";

    container.innerHTML = `
      <div class="cadence-tabs">
        <button class="cadence-tab-btn active" data-tab="appearance">Themes & Color Wheels</button>
        <button class="cadence-tab-btn" data-tab="layout">Apple Music UI</button>
        <button class="cadence-tab-btn" data-tab="lyrics">Karaoke Lyrics</button>
        <button class="cadence-tab-btn" data-tab="share">Share Theme</button>
      </div>

      <div class="cadence-panel active" data-panel="appearance">
        <div class="cadence-preset-grid">
          ${PRESETS.map(
            (p, idx) => `
            <button class="cadence-preset-btn ${p.isWhiteBtn ? "cadence-white-theme-btn" : ""}" data-preset="${idx}">
              <span class="cadence-swatch" style="background:${p.surface};border:2px solid ${p.accent};"></span>
              <span>${p.name}</span>
            </button>`
          ).join("")}
        </div>

        <div class="cadence-wheels-grid-3">
          <div class="cadence-wheel-card">
            <div class="cadence-wheel-title">Accent Wheel</div>
            <div id="cadence-accent-wheel"></div>
          </div>
          <div class="cadence-wheel-card">
            <div class="cadence-wheel-title">Background Wheel</div>
            <div id="cadence-bg-wheel"></div>
          </div>
          <div class="cadence-wheel-card">
            <div class="cadence-wheel-title">Text Color Wheel</div>
            <div id="cadence-text-wheel"></div>
          </div>
        </div>

        <div class="cadence-row">
          <span>Auto-Contrast Text (Prevents Invisible Text on White BG)</span>
          <input type="checkbox" id="cadence-autotext-toggle" ${state.autoTextContrast ? "checked" : ""} />
        </div>
      </div>

      <div class="cadence-panel" data-panel="layout">
        <div class="cadence-row">
          <span>Apple Music Frosted-Glass Floating Player Pill</span>
          <input type="checkbox" id="cadence-floating-toggle" ${state.floatingPlayer ? "checked" : ""} />
        </div>
        <div class="cadence-row">
          <span>Dynamic Album-Art Ambient Mesh Backdrop</span>
          <input type="checkbox" id="cadence-backdrop-toggle" ${state.ambientBackdrop ? "checked" : ""} />
        </div>
        <div class="cadence-row">
          <span>Apple Music Squircle Cards & Glass Edge Highlight</span>
          <input type="checkbox" id="cadence-squircle-toggle" ${state.squircleHighlight ? "checked" : ""} />
        </div>
        <div class="cadence-row">
          <span>Clean Editorial Playlist & Album Headers</span>
          <input type="checkbox" id="cadence-editorial-toggle" ${state.editorialHeaders ? "checked" : ""} />
        </div>
        <div class="cadence-row">
          <span>Card Corner Radius (<span id="cadence-radius-val">${state.borderRadius}</span>px)</span>
          <input type="range" id="cadence-radius-slider" min="6" max="22" step="2" value="${state.borderRadius}" />
        </div>
        <div class="cadence-row">
          <span>Suppress Upgrade & Promo Banners</span>
          <input type="checkbox" id="cadence-adblock-toggle" ${state.adBlock ? "checked" : ""} />
        </div>
      </div>

      <div class="cadence-panel" data-panel="lyrics">
        <div class="cadence-row">
          <span>Active Lyric Zoom Scale (<span id="cadence-scale-val">${state.lyricScale.toFixed(2)}</span>x)</span>
          <input type="range" id="cadence-scale-slider" min="1.0" max="1.4" step="0.05" value="${state.lyricScale}" />
        </div>
        <div class="cadence-row">
          <span>Accent Glow on Active Lyric Line</span>
          <input type="checkbox" id="cadence-lyric-glow-toggle" ${state.lyricGlow ? "checked" : ""} />
        </div>
        <div class="cadence-row">
          <span>Theater Dimming (Sidebars Fade During Lyrics)</span>
          <input type="checkbox" id="cadence-theater-toggle" ${state.lyricTheater ? "checked" : ""} />
        </div>
      </div>

      <div class="cadence-panel" data-panel="share">
        <div class="cadence-row" style="flex-direction:column;align-items:stretch;gap:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:600;font-size:13px;">Windows (PowerShell)</span>
            <button id="cadence-copy-win" class="cadence-tab-btn active" style="padding:5px 12px;">Copy</button>
          </div>
          <code class="cadence-code-box">${INSTALL_WIN}</code>
        </div>

        <div class="cadence-row" style="flex-direction:column;align-items:stretch;gap:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:600;font-size:13px;">macOS & Linux (Terminal)</span>
            <button id="cadence-copy-unix" class="cadence-tab-btn active" style="padding:5px 12px;">Copy</button>
          </div>
          <code class="cadence-code-box">${INSTALL_UNIX}</code>
        </div>
      </div>
    `;

    // Mount 3 Circular Color Wheels
    const accentWheelCtrl = mountCircularWheel(
      container.querySelector("#cadence-accent-wheel"),
      state.accentHex,
      (newHex) => {
        state.accentHex = newHex;
        applyVisualPrefs();
        saveState();
      }
    );

    const bgWheelCtrl = mountCircularWheel(
      container.querySelector("#cadence-bg-wheel"),
      state.surfaceHex,
      (newHex) => {
        state.surfaceHex = newHex;
        applyVisualPrefs();
        if (state.autoTextContrast) {
          textWheelCtrl.setHex(state.textHex);
        }
        saveState();
      }
    );

    const textWheelCtrl = mountCircularWheel(
      container.querySelector("#cadence-text-wheel"),
      state.textHex,
      (newHex) => {
        state.autoTextContrast = false;
        container.querySelector("#cadence-autotext-toggle").checked = false;
        state.textHex = newHex;
        applyVisualPrefs();
        saveState();
      }
    );

    // Tab switching
    container.querySelectorAll(".cadence-tab-btn[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".cadence-tab-btn[data-tab]").forEach((b) => b.classList.remove("active"));
        container.querySelectorAll(".cadence-panel").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        container.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add("active");
      });
    });

    // Presets (including Apple Music White button)
    container.querySelectorAll(".cadence-preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const preset = PRESETS[Number(btn.dataset.preset)];
        if (!preset) return;
        state.accentHex = preset.accent;
        state.surfaceHex = preset.surface;
        state.textHex = preset.text;
        state.autoTextContrast = true;
        container.querySelector("#cadence-autotext-toggle").checked = true;
        accentWheelCtrl.setHex(preset.accent);
        bgWheelCtrl.setHex(preset.surface);
        textWheelCtrl.setHex(preset.text);
        applyVisualPrefs();
        saveState();
      });
    });

    container.querySelector("#cadence-autotext-toggle").addEventListener("change", (e) => {
      state.autoTextContrast = e.target.checked;
      applyVisualPrefs();
      textWheelCtrl.setHex(state.textHex);
      saveState();
    });

    container.querySelector("#cadence-adblock-toggle").addEventListener("change", (e) => {
      state.adBlock = e.target.checked;
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-floating-toggle").addEventListener("change", (e) => {
      state.floatingPlayer = e.target.checked;
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-backdrop-toggle").addEventListener("change", (e) => {
      state.ambientBackdrop = e.target.checked;
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-squircle-toggle").addEventListener("change", (e) => {
      state.squircleHighlight = e.target.checked;
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-editorial-toggle").addEventListener("change", (e) => {
      state.editorialHeaders = e.target.checked;
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-radius-slider").addEventListener("input", (e) => {
      state.borderRadius = Number(e.target.value);
      container.querySelector("#cadence-radius-val").textContent = state.borderRadius;
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-scale-slider").addEventListener("input", (e) => {
      state.lyricScale = Number(e.target.value);
      container.querySelector("#cadence-scale-val").textContent = state.lyricScale.toFixed(2);
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-lyric-glow-toggle").addEventListener("change", (e) => {
      state.lyricGlow = e.target.checked;
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-theater-toggle").addEventListener("change", (e) => {
      state.lyricTheater = e.target.checked;
      applyVisualPrefs();
      saveState();
    });

    const copyWinBtn = container.querySelector("#cadence-copy-win");
    copyWinBtn.addEventListener("click", () => copyToClipboard(INSTALL_WIN, copyWinBtn, "Copy"));

    const copyUnixBtn = container.querySelector("#cadence-copy-unix");
    copyUnixBtn.addEventListener("click", () => copyToClipboard(INSTALL_UNIX, copyUnixBtn, "Copy"));

    Spicetify.PopupModal.display({
      title: "Cadence v3.2 — Apple Music Studio",
      content: container,
      isLarge: true
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.altKey && e.code === "KeyC") {
      e.preventDefault();
      toggleCadenceModal();
    }
  });

  if (window.Spicetify?.Player) {
    Spicetify.Player.addEventListener("songchange", () => {
      setTimeout(updateBackdropArt, 250);
    });
  }

  new Spicetify.Topbar.Button(
    "Cadence Studio (Alt+C)",
    `<svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>`,
    toggleCadenceModal
  );

  applyVisualPrefs();
  console.log("[Cadence v3.2] Apple Music UI & 3-Wheel Studio loaded.");
})();
