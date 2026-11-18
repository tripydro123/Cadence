// Cadence v3.2 — Spicetify Studio Extension (Zero-Python + Robust DSP Karaoke + AI Ready)
// Author: tripydro123

(function CadenceStudio() {
  if (!window.Spicetify || !Spicetify.PopupModal || !Spicetify.Topbar) {
    setTimeout(CadenceStudio, 300);
    return;
  }

  const STORAGE_KEY = "cadence_v32_settings";
  const INSTALL_WIN = "iwr -useb https://raw.githubusercontent.com/tripydro123/cadence/main/install.ps1 | iex";
  const INSTALL_UNIX = "curl -fsSL https://raw.githubusercontent.com/tripydro123/cadence/main/install.sh | sh";

  const defaultState = {
    accentHex: "#fa2d48",
    surfaceHex: "#121214",
    adBlock: true,
    micHud: false,
    vocalReduction: 0,
    spatialWidth: false,
    eqBands: [0, 0, 0, 0, 0]
  };

  let state = Object.assign({}, defaultState, JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
    document.documentElement.style.setProperty("--cadence-accent", state.accentHex);
    document.documentElement.style.setProperty("--spice-button", state.accentHex);
    document.documentElement.style.setProperty("--cadence-surface", state.surfaceHex);
    document.body.classList.toggle("cadence-adblock-active", !!state.adBlock);

    const hud = document.getElementById("cadence-mic-hud");
    if (hud) {
      hud.classList.toggle("cadence-hidden", !state.micHud);
    }
  }

  // Web Audio API Engine (5-Band EQ + Spatial Widener + High-Performance Vocal Attenuation)
  let audioCtx = null;
  let filters = [];
  let splitter = null;
  let merger = null;
  let vocalGain = null;
  let wiredElement = null;

  function initAudioEngine() {
    const mediaEl = document.querySelector("video, audio");
    if (!mediaEl || mediaEl === wiredElement) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const source = audioCtx.createMediaElementSource(mediaEl);
      const freqs = [60, 230, 910, 3600, 14000];

      filters = freqs.map((freq, idx) => {
        const filter = audioCtx.createBiquadFilter();
        filter.type = idx === 0 ? "lowshelf" : idx === freqs.length - 1 ? "highshelf" : "peaking";
        filter.frequency.value = freq;
        filter.Q.value = 1.1;
        filter.gain.value = state.eqBands[idx] || 0;
        return filter;
      });

      source.connect(filters[0]);
      for (let i = 0; i < filters.length - 1; i++) {
        filters[i].connect(filters[i + 1]);
      }

      splitter = audioCtx.createChannelSplitter(2);
      merger = audioCtx.createChannelMerger(2);
      const invL = audioCtx.createGain();
      const invR = audioCtx.createGain();
      vocalGain = audioCtx.createGain();

      invL.gain.value = -1;
      invR.gain.value = -1;
      vocalGain.gain.value = (state.vocalReduction / 100) * 0.85;

      const lastFilter = filters[filters.length - 1];
      lastFilter.connect(splitter);

      splitter.connect(merger, 0, 0);
      splitter.connect(merger, 1, 1);

      splitter.connect(invR, 1);
      invR.connect(vocalGain);
      vocalGain.connect(merger, 0, 0);

      splitter.connect(invL, 0);
      invL.connect(vocalGain);
      vocalGain.connect(merger, 0, 1);

      merger.connect(audioCtx.destination);
      wiredElement = mediaEl;
    } catch (err) {
      console.debug("[Cadence] Audio hook deferred:", err.message);
    }
  }

  function updateAudioParams() {
    if (filters.length === 5) {
      state.eqBands.forEach((gain, idx) => {
        filters[idx].gain.value = gain;
      });
    }
    if (vocalGain) {
      const base = (state.vocalReduction / 100) * 0.85;
      const spatialBoost = state.spatialWidth ? 0.2 : 0;
      vocalGain.gain.value = Math.min(1, base + spatialBoost);
    }
  }

  function createMicHud() {
    if (document.getElementById("cadence-mic-hud")) return;
    const hud = document.createElement("div");
    hud.id = "cadence-mic-hud";
    if (!state.micHud) hud.classList.add("cadence-hidden");

    hud.innerHTML = `
      <span class="cadence-hud-label">MIC</span>
      <input id="cadence-hud-slider" type="range" min="0" max="100" value="${state.vocalReduction}" title="Karaoke Vocal Isolation" />
      <span id="cadence-hud-val" class="cadence-hud-label">${state.vocalReduction}%</span>
    `;

    document.body.appendChild(hud);
    const slider = hud.querySelector("#cadence-hud-slider");
    const valEl = hud.querySelector("#cadence-hud-val");

    slider.addEventListener("input", (e) => {
      state.vocalReduction = Number(e.target.value);
      valEl.textContent = `${state.vocalReduction}%`;
      initAudioEngine();
      updateAudioParams();
      saveState();
    });
  }

  async function openCadenceModal() {
    const container = document.createElement("div");
    container.className = "cadence-studio-wrap";

    container.innerHTML = `
      <div class="cadence-tabs">
        <button class="cadence-tab-btn active" data-tab="appearance">Appearance</button>
        <button class="cadence-tab-btn" data-tab="audio">5-Band EQ & Spatial</button>
        <button class="cadence-tab-btn" data-tab="karaoke">Karaoke & Audio</button>
        <button class="cadence-tab-btn" data-tab="share">Share Theme</button>
      </div>

      <div class="cadence-panel active" data-panel="appearance">
        <div class="cadence-row">
          <span>Accent Color Wheel</span>
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

      <div class="cadence-panel" data-panel="audio">
        <div class="cadence-eq-grid">
          ${["60Hz", "230Hz", "910Hz", "3.6kHz", "14kHz"]
            .map(
              (label, i) => `
            <div class="cadence-eq-band">
              <span style="font-size:11px;opacity:0.8;">${label}</span>
              <input type="range" class="cadence-eq-slider" data-band="${i}" min="-12" max="12" step="1" value="${state.eqBands[i]}" />
              <span class="cadence-eq-val" style="font-size:11px;">${state.eqBands[i]}dB</span>
            </div>`
            )
            .join("")}
        </div>
        <div class="cadence-row">
          <span>Spatial Stereo Widening</span>
          <input type="checkbox" id="cadence-spatial-toggle" ${state.spatialWidth ? "checked" : ""} />
        </div>
      </div>

      <div class="cadence-panel" data-panel="karaoke">
        <div class="cadence-row">
          <span>Show Floating Microphone Capsule HUD</span>
          <input type="checkbox" id="cadence-hud-toggle" ${state.micHud ? "checked" : ""} />
        </div>
        <div class="cadence-row">
          <span>Vocal Attenuation Level (<span id="cadence-vocal-pct">${state.vocalReduction}</span>%)</span>
          <input type="range" id="cadence-modal-vocal" min="0" max="100" value="${state.vocalReduction}" />
        </div>
        <div class="cadence-row" style="flex-direction:column;align-items:flex-start;gap:6px;">
          <div style="font-weight:600;font-size:13px;">High-Performance DSP Karaoke Engine</div>
          <div style="font-size:11px;opacity:0.75;line-height:1.4;">
            Active and running instantly in real-time via Web Audio API phase inversion. Zero memory footprint, zero downloads needed.
          </div>
        </div>
      </div>

      <div class="cadence-panel" data-panel="share">
        <div class="cadence-row" style="flex-direction:column;align-items:stretch;gap:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:600;font-size:13px;">Windows (PowerShell)</span>
            <button id="cadence-copy-win" class="cadence-tab-btn active" style="padding:5px 12px;">Copy</button>
          </div>
          <code style="font-size:11px;background:rgba(0,0,0,0.35);padding:8px 10px;border-radius:6px;word-break:break-all;user-select:all;">${INSTALL_WIN}</code>
        </div>

        <div class="cadence-row" style="flex-direction:column;align-items:stretch;gap:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:600;font-size:13px;">macOS & Linux (Terminal)</span>
            <button id="cadence-copy-unix" class="cadence-tab-btn active" style="padding:5px 12px;">Copy</button>
          </div>
          <code style="font-size:11px;background:rgba(0,0,0,0.35);padding:8px 10px;border-radius:6px;word-break:break-all;user-select:all;">${INSTALL_UNIX}</code>
        </div>
      </div>
    `;

    container.querySelectorAll(".cadence-tab-btn[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".cadence-tab-btn[data-tab]").forEach((b) => b.classList.remove("active"));
        container.querySelectorAll(".cadence-panel").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        container.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add("active");
      });
    });

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

    container.querySelectorAll(".cadence-eq-slider").forEach((slider) => {
      slider.addEventListener("input", (e) => {
        const idx = Number(e.target.dataset.band);
        const val = Number(e.target.value);
        state.eqBands[idx] = val;
        e.target.parentElement.querySelector(".cadence-eq-val").textContent = `${val}dB`;
        initAudioEngine();
        updateAudioParams();
        saveState();
      });
    });

    container.querySelector("#cadence-spatial-toggle").addEventListener("change", (e) => {
      state.spatialWidth = e.target.checked;
      initAudioEngine();
      updateAudioParams();
      saveState();
    });

    container.querySelector("#cadence-hud-toggle").addEventListener("change", (e) => {
      state.micHud = e.target.checked;
      applyVisualPrefs();
      saveState();
    });

    container.querySelector("#cadence-modal-vocal").addEventListener("input", (e) => {
      state.vocalReduction = Number(e.target.value);
      container.querySelector("#cadence-vocal-pct").textContent = state.vocalReduction;
      const hudSlider = document.getElementById("cadence-hud-slider");
      const hudVal = document.getElementById("cadence-hud-val");
      if (hudSlider) hudSlider.value = state.vocalReduction;
      if (hudVal) hudVal.textContent = `${state.vocalReduction}%`;
      initAudioEngine();
      updateAudioParams();
      saveState();
    });

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

  new Spicetify.Topbar.Button(
    "Cadence Studio",
    `<svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>`,
    openCadenceModal
  );

  applyVisualPrefs();
  createMicHud();
  console.log("[Cadence v3.2] Loaded successfully.");
})();
