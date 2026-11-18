// Cadence v3.2 — Spicetify Visual & Lyrics Studio Extension
// Author: tripydro123

(function CadenceStudio() {
  if (!window.Spicetify || !Spicetify.PopupModal || !Spicetify.Topbar) {
    setTimeout(CadenceStudio, 300);
    return;
  }

  const STORAGE_KEY = "cadence_v32_design_settings";
  const INSTALL_WIN = "iwr -useb https://raw.githubusercontent.com/tripydro123/cadence/main/install.ps1 | iex";
  const INSTALL_UNIX = "curl -fsSL https://raw.githubusercontent.com/tripydro123/cadence/main/install.sh | sh";

  const PRESETS = [
    { name: "Apple Crimson", accent: "#fa2d48", surface: "#121214" },
    { name: "OLED Midnight", accent: "#ff375f", surface: "#000000" },
    { name: "Frosted Slate", accent: "#0a84ff", surface: "#16181d" },
    { name: "Velvet Amber", accent: "#ff9f0a", surface: "#141210" }
  ];

  const defaultState = {
    accentHex: "#fa2d48",
    surfaceHex: "#121214",
    borderRadius: 14,
    ambientGlow: true,
    compactSidebar: false,
    adBlock: true,
    lyricTheater: false,
    lyricGlow: true,
    lyricScale: 1.2,
    modalOpen: false
  };

  let state = Object.assign({}, defaultState, JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
  state.modalOpen = false;

  function saveState() {
    const toSave = Object.assign({}, state, { modalOpen: false });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
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

  function applyVisualPrefs() {
    const root = document.documentElement;
    root.style.setProperty("--cadence-accent", state.accentHex);
    root.style.setProperty("--spice-button", state.accentHex);
    root.style.setProperty("--spice-button-active", state.accentHex);
    root.style.setProperty("--cadence-surface", state.surfaceHex);
    root.style.setProperty("--spice-main", state.surfaceHex);
    root.style.setProperty("--spice-player", state.surfaceHex);
    root.style.setProperty("--cadence-radius", `${state.borderRadius}px`);
    root.style.setProperty("--cadence-lyric-scale", `${state.lyricScale}`);

    document.body.classList.toggle("cadence-adblock-active", !!state.adBlock);
    document.body.classList.toggle("cadence-ambient-glow", !!state.ambientGlow);
    document.body.classList.toggle("cadence-compact-ui", !!state.compactSidebar);
    document.body.classList.toggle("cadence-lyric-theater", !!state.lyricTheater);
    document.body.classList.toggle("cadence-lyric-glow", !!state.lyricGlow);
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
        <button class="cadence-tab-btn active" data-tab="appearance">Appearance</button>
        <button class="cadence-tab-btn" data-tab="layout">Layout & Glow</button>
        <button class="cadence-tab-btn" data-tab="lyrics">Karaoke Lyrics</button>
        <button class="cadence-tab-btn" data-tab="share">Share Theme</button>
      </div>

      <div class="cadence-panel active" data-panel="appearance">
        <div class="cadence-preset-grid">
          ${PRESETS.map(
            (p, idx) => `
            <button class="cadence-preset-btn" data-preset="${idx}">
              <span class="cadence-swatch" style="background:${p.accent};border-color:${p.surface};"></span>
              <span>${p.name}</span>
            </button>`
          ).join("")}
        </div>
        <div class="cadence-row">
          <span>Custom Accent Color</span>
          <input type="color" id="cadence-accent-picker" value="${state.accentHex}" />
        </div>
        <div class="cadence-row">
          <span>Surface Base Tint</span>
          <input type="color" id="cadence-surface-picker" value="${state.surfaceHex}" />
        </div>
        <div class="cadence-row">
          <span>Suppress Promo & Upgrade Banners</span>
          <input type="checkbox" id="cadence-adblock-toggle" ${state.adBlock ? "checked" : ""} />
        </div>
      </div>

      <div class="cadence-panel" data-panel="layout">
        <div class="cadence-row">
          <span>Card & Artwork Corner Radius (<span id="cadence-radius-val">${state.borderRadius}</span>px)</span>
          <input type="range" id="cadence-radius-slider" min="4" max="24" step="2" value="${state.borderRadius}" />
        </div>
        <div class="cadence-row">
          <span>Ambient Artwork & Card Glow</span>
          <input type="checkbox" id="cadence-glow-toggle" ${state.ambientGlow ? "checked" : ""} />
        </div>
        <div class="cadence-row">
          <span>Minimal Scrollbars & Sleek Spacing</span>
          <input type="checkbox" id="cadence-compact-toggle" ${state.compactSidebar ? "checked" : ""} />
        </div>
      </div>

      <div class="cadence-panel" data-panel="lyrics">
        <div class="cadence-row">
          <span>Active Lyric Zoom Scale (<span id="cadence-scale-val">${state.lyricScale.toFixed(2)}</span>x)</span>
          <input type="range" id="cadence-scale-slider" min="1.0" max="1.45" step="0.05" value="${state.lyricScale}" />
        </div>
        <div class="cadence-row">
          <span>Accent Glow on Active Lyric Line</span>
          <input type="checkbox" id="cadence-lyric-glow-toggle" ${state.lyricGlow ? "checked" : ""} />
        </div>
        <div class="cadence-row">
          <span>Theater Dimming (Focus Mode on Lyrics View)</span>
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

    // Tab switching
    container.querySelectorAll(".cadence-tab-btn[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".cadence-tab-btn[data-tab]").forEach((b) => b.classList.remove("active"));
        container.querySelectorAll(".cadence-panel").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        container.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add("active");
      });
    });

    // Presets
    container.querySelectorAll(".cadence-preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const preset = PRESETS[Number(btn.dataset.preset)];
        if (!preset) return;
        state.accentHex = preset.accent;
        state.surfaceHex = preset.surface;
        container.querySelector("#cadence-accent-picker").value = preset.accent;
        container.querySelector("#cadence-surface-picker").value = preset.surface;
        applyVisualPrefs();
        saveState();
      });
    });

    // Appearance controls
    container.querySelector("#cadence-accent-picker").addEventListener("input", (e) => {
      state.accentHex = e.target.value;
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-surface-picker").addEventListener("input", (e) => {
      state.surfaceHex = e.target.value;
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-adblock-toggle").addEventListener("change", (e) => {
      state.adBlock = e.target.checked;
      applyVisualPrefs();
      saveState();
    });

    // Layout controls
    container.querySelector("#cadence-radius-slider").addEventListener("input", (e) => {
      state.borderRadius = Number(e.target.value);
      container.querySelector("#cadence-radius-val").textContent = state.borderRadius;
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-glow-toggle").addEventListener("change", (e) => {
      state.ambientGlow = e.target.checked;
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-compact-toggle").addEventListener("change", (e) => {
      state.compactSidebar = e.target.checked;
      applyVisualPrefs();
      saveState();
    });

    // Karaoke Lyrics controls
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

    // Copy buttons
    const copyWinBtn = container.querySelector("#cadence-copy-win");
    copyWinBtn.addEventListener("click", () => copyToClipboard(INSTALL_WIN, copyWinBtn, "Copy"));

    const copyUnixBtn = container.querySelector("#cadence-copy-unix");
    copyUnixBtn.addEventListener("click", () => copyToClipboard(INSTALL_UNIX, copyUnixBtn, "Copy"));

    Spicetify.PopupModal.display({
      title: "Cadence v3.2 Studio",
      content: container,
      isLarge: true
    });
  }

  // Hotkey: Alt + C toggles Cadence Studio
  window.addEventListener("keydown", (e) => {
    if (e.altKey && e.code === "KeyC") {
      e.preventDefault();
      toggleCadenceModal();
    }
  });

  new Spicetify.Topbar.Button(
    "Cadence Studio (Alt+C)",
    `<svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>`,
    toggleCadenceModal
  );

  applyVisualPrefs();
  console.log("[Cadence v3.2] Visual & Lyrics Studio loaded (Press Alt+C to open).");
})();
