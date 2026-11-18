/* Cadence v3.2 — Clean Apple Music White & Dark Adaptive UI (No Dark Shades) */
:root {
  --cadence-accent: #fa2d48;
  --cadence-accent-soft: rgba(250, 45, 72, 0.12);
  --cadence-surface: #ffffff;
  --cadence-sidebar: #f5f5f7;
  --cadence-elevated: #ffffff;
  --cadence-card: #f5f5f7;
  --cadence-surface-hover: rgba(0, 0, 0, 0.05);
  --cadence-surface-press: rgba(0, 0, 0, 0.09);
  --cadence-tinted: rgba(0, 0, 0, 0.045);
  --cadence-border: rgba(0, 0, 0, 0.08);
  --cadence-text: #1d1d1f;
  --cadence-subtext: rgba(29, 29, 31, 0.62);
  --cadence-radius: 12px;
  --cadence-lyric-scale: 1.18;
}

/* Override Spotify Encore Theme Variables Globally */
:root,
body,
.encore-dark-theme,
.encore-dark-theme .encore-base-set,
.encore-dark-theme .encore-inverted-dark-set,
.encore-dark-theme .encore-inverted-light-set,
.encore-dark-theme .encore-over-media-set,
.Root__main-view,
.Root__nav-bar,
.Root__right-sidebar,
.Root__now-playing-bar,
.GenericModal,
[role="dialog"] {
  --background-base: var(--cadence-surface) !important;
  --background-highlight: var(--cadence-surface-hover) !important;
  --background-press: var(--cadence-surface-press) !important;
  --background-elevated-base: var(--cadence-elevated) !important;
  --background-elevated-highlight: var(--cadence-surface-hover) !important;
  --background-elevated-press: var(--cadence-surface-press) !important;
  --background-tinted-base: var(--cadence-tinted) !important;
  --background-tinted-highlight: var(--cadence-surface-hover) !important;
  --background-tinted-press: var(--cadence-surface-press) !important;
  --text-base: var(--cadence-text) !important;
  --text-subdued: var(--cadence-subtext) !important;
  --text-bright-accent: var(--cadence-accent) !important;
  --essential-base: var(--cadence-text) !important;
  --essential-subdued: var(--cadence-subtext) !important;
  --essential-bright-accent: var(--cadence-accent) !important;
  --decorative-base: var(--cadence-text) !important;
  --decorative-subdued: var(--cadence-border) !important;
  --home-header-color: transparent !important;
  color: var(--cadence-text) !important;
}

/* Main Canvas & Split-Pane Surfaces */
body,
.Root__top-container,
.Root__main-view,
.main-view-container,
.main-view-container__scroll-node,
.os-content,
[data-testid="home-page"] {
  background-color: var(--cadence-surface) !important;
  color: var(--cadence-text) !important;
}

/* FIX 1: Remove Black/Grey Shades from Top Bar, Filter Chips & Home Header */
.main-topBar-container,
.main-topBar-background,
.main-topBar-overlay,
.Root__globalNav,
.main-home-homeHeader,
.main-home-filterChipsSection,
.main-home-filterChipsContainer,
.under-main-view,
.main-entityHeader-backgroundColor,
.main-entityHeader-overlay,
.main-actionBarBackground-background,
[data-testid="home-page"] > div > div:first-child {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
}

.Root__globalNav,
.main-topBar-container {
  background: color-mix(in srgb, var(--cadence-surface) 86%, transparent) !important;
  backdrop-filter: blur(28px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
  border-bottom: 1px solid var(--cadence-border) !important;
}

/* Fix Windows Titlebar Controls (-, [], X) in Light Mode */
body.cadence-light-mode .Root__globalNav button[aria-label="Minimize"],
body.cadence-light-mode .Root__globalNav button[aria-label="Maximize"],
body.cadence-light-mode .Root__globalNav button[aria-label="Restore"],
body.cadence-light-mode .Root__globalNav button[aria-label="Close"],
body.cadence-light-mode .main-topBar-windowControls button {
  color: #1d1d1f !important;
  background: transparent !important;
}

/* Clean Filter Chips ("All", "Music", "Podcasts", "Audiobooks") */
.ChipInnerComponent-sm,
button[role="checkbox"][aria-checked="false"] > span,
div[role="list"] button[aria-pressed="false"] {
  background-color: var(--cadence-tinted) !important;
  color: var(--cadence-text) !important;
  border: 1px solid var(--cadence-border) !important;
}

.ChipInnerComponent-sm-selected,
button[role="checkbox"][aria-checked="true"] > span,
div[role="list"] button[aria-pressed="true"] {
  background-color: var(--cadence-accent) !important;
  color: #ffffff !important;
  border-color: var(--cadence-accent) !important;
}

/* FIX 2: Remove Dark Fade Shades on Left & Right Sides of Carousels & Sidebars */
.main-shelf-shelf::before,
.main-shelf-shelf::after,
[data-testid="carousel-container"]::before,
[data-testid="carousel-container"]::after,
.main-yourLibraryX-header::after,
.main-yourLibraryX-libraryRootlist::before,
.main-yourLibraryX-libraryRootlist::after,
.LayoutResizer__resize-bar,
.LayoutResizer__inline-root {
  background: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
}

.LayoutResizer__resize-bar::after {
  background-color: var(--cadence-border) !important;
  width: 1px !important;
}

/* Apple Music Left Sidebar */
.Root__nav-bar,
.main-yourLibraryX-entryPoints,
.main-yourLibraryX-libraryContainer,
.main-yourLibraryX-libraryRootlist {
  background-color: var(--cadence-sidebar) !important;
  border-right: 1px solid var(--cadence-border) !important;
  box-shadow: none !important;
  color: var(--cadence-text) !important;
}

.main-yourLibraryX-navLinkActive,
.main-yourLibraryX-listItemActive {
  background-color: var(--cadence-accent-soft) !important;
  color: var(--cadence-accent) !important;
  border-radius: 10px !important;
  font-weight: 700 !important;
}

/* Right Now-Playing Sidebar */
.Root__right-sidebar,
.main-nowPlayingView-content,
.main-nowPlayingView-section,
aside[aria-label="Now playing view"] {
  background-color: var(--cadence-sidebar) !important;
  border-left: 1px solid var(--cadence-border) !important;
  box-shadow: none !important;
  color: var(--cadence-text) !important;
}

/* Keep Right-Sidebar Lyrics Preview Readable in White Mode */
body.cadence-light-mode .main-nowPlayingView-lyricsContent,
body.cadence-light-mode .main-nowPlayingView-lyricsContent p,
body.cadence-light-mode .main-nowPlayingView-lyricsContent div {
  color: var(--cadence-text) !important;
}

/* Force Text & Icons Across Cards, Rows, and Headings */
h1, h2, h3, h4,
.main-entityHeader-title h1,
.main-shelf-title,
.main-trackList-rowTitle,
.main-cardHeader-text,
.main-nowPlayingWidget-trackName a,
.main-yourLibraryX-listRowEntityTitle {
  color: var(--cadence-text) !important;
  letter-spacing: -0.015em;
}

.main-trackList-rowSubTitle,
.main-trackList-rowSubTitle a,
.main-cardSubHeader-text,
.main-nowPlayingWidget-artistName a,
.main-yourLibraryX-listRowSubtitle,
.playback-bar__progress-time-elapsed,
.main-playbackBarRemainingTime-container {
  color: var(--cadence-subtext) !important;
}

/* Dynamic Album-Art Mesh Backdrop */
#cadence-art-backdrop {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

#cadence-art-backdrop.cadence-hidden {
  display: none !important;
}

.cadence-backdrop-orb {
  position: absolute;
  width: 60vw;
  height: 60vw;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  filter: blur(95px) saturate(165%);
  opacity: 0.2;
  transition: background-image 1.1s ease, opacity 0.6s ease;
  animation: cadenceFloat 24s ease-in-out infinite alternate;
}

body.cadence-light-mode .cadence-backdrop-orb {
  opacity: 0.09;
}

.cadence-backdrop-orb.orb-a { top: -18%; left: -8%; }
.cadence-backdrop-orb.orb-b { bottom: -20%; right: -10%; animation-delay: -12s; }

@keyframes cadenceFloat {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(4%, 5%) scale(1.1); }
}

/* Search Pill */
.x-searchInput-searchInputInput,
form[role="search"] input {
  background-color: var(--cadence-tinted) !important;
  color: var(--cadence-text) !important;
  border: 1px solid var(--cadence-border) !important;
  border-radius: 10px !important;
}

/* Apple Music Floating Frosted-Glass Player Pill */
body.cadence-floating-player .Root__now-playing-bar {
  position: fixed !important;
  bottom: 14px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: min(94vw, 1180px) !important;
  border-radius: 20px !important;
  background: color-mix(in srgb, var(--cadence-elevated) 86%, transparent) !important;
  backdrop-filter: blur(32px) saturate(190%) !important;
  -webkit-backdrop-filter: blur(32px) saturate(190%) !important;
  border: 1px solid var(--cadence-border) !important;
  box-shadow: 0 14px 38px rgba(0, 0, 0, 0.14) !important;
  padding: 6px 16px !important;
  z-index: 90 !important;
}

body.cadence-floating-player .main-view-container__scroll-node-child {
  padding-bottom: 105px !important;
}

.playback-bar__progress-time-elapsed,
.main-playbackBarRemainingTime-container {
  font-variant-numeric: tabular-nums !important;
}

/* Clean Editorial Playlist & Album Headers */
body.cadence-editorial-headers .main-entityHeader-title h1 {
  letter-spacing: -0.025em !important;
  font-weight: 800 !important;
}

body.cadence-editorial-headers .main-entityHeader-imageContainer img {
  border-radius: var(--cadence-radius) !important;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.2) !important;
}

/* Apple Music Squircle Cards & Track Rows */
.main-card-card,
.main-cardImage-imageWrapper,
.main-coverSlotCollapsed-container,
.main-nowPlayingWidget-coverArt .cover-art {
  border-radius: var(--cadence-radius) !important;
}

body.cadence-squircle-cards .main-card-card {
  background-color: var(--cadence-card) !important;
  border: 1px solid var(--cadence-border) !important;
  transition: transform 0.22s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.22s ease !important;
}

body.cadence-squircle-cards .main-card-card:hover {
  transform: translateY(-3px) scale(1.01) !important;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.12) !important;
}

.main-trackList-trackListRow:hover {
  background-color: var(--cadence-surface-hover) !important;
  border-radius: 8px !important;
}

/* Accent Play Buttons */
button.main-playButton-button,
.main-playPauseButton-button {
  background-color: var(--cadence-accent) !important;
  color: #ffffff !important;
}

button.main-playButton-button svg,
.main-playPauseButton-button svg {
  fill: #ffffff !important;
  color: #ffffff !important;
}

/* Minimal Scrollbars */
body.cadence-compact-ui ::-webkit-scrollbar {
  width: 5px !important;
  height: 5px !important;
}

body.cadence-compact-ui ::-webkit-scrollbar-thumb {
  background: rgba(140, 140, 145, 0.35) !important;
  border-radius: 99px !important;
}

/* AdBlock Suppression */
body.cadence-adblock-active .main-leaderboardComponent-container,
body.cadence-adblock-active div[aria-label="Upgrade to Premium"],
body.cadence-adblock-active button[title="Upgrade to Premium"] {
  display: none !important;
}

/* Karaoke Lyrics Enhancements */
.lyrics-lyricsContent-lyric {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), color 0.2s ease, text-shadow 0.25s ease !important;
  transform-origin: left center !important;
}

.lyrics-lyricsContent-lyric.lyrics-lyricsContent-active,
[data-testid="lyrics-line"][data-active="true"] {
  transform: scale(var(--cadence-lyric-scale)) !important;
  font-weight: 800 !important;
}

body.cadence-lyric-glow .lyrics-lyricsContent-lyric.lyrics-lyricsContent-active,
body.cadence-lyric-glow [data-testid="lyrics-line"][data-active="true"] {
  text-shadow: 0 0 18px color-mix(in srgb, var(--cadence-accent) 70%, transparent) !important;
}

body.cadence-lyric-theater .Root__nav-bar,
body.cadence-lyric-theater .Root__right-sidebar {
  opacity: 0.32;
  transition: opacity 0.3s ease;
}

body.cadence-lyric-theater .Root__nav-bar:hover,
body.cadence-lyric-theater .Root__right-sidebar:hover {
  opacity: 1;
}

/* Studio Modal Adaptive White/Dark Container */
.GenericModal,
.GenericModal > div,
.main-embedWidgetGenerator-container {
  background-color: var(--cadence-elevated) !important;
  color: var(--cadence-text) !important;
  border: 1px solid var(--cadence-border) !important;
  border-radius: 18px !important;
}

.cadence-studio-wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 520px;
  padding: 4px;
  color: var(--cadence-text) !important;
}

.cadence-tabs {
  display: flex;
  gap: 6px;
  border-bottom: 1px solid var(--cadence-border);
  padding-bottom: 10px;
}

.cadence-tab-btn {
  background: var(--cadence-tinted);
  border: 1px solid var(--cadence-border);
  color: var(--cadence-text) !important;
  padding: 8px 13px;
  border-radius: 9px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.cadence-tab-btn:hover {
  background: var(--cadence-surface-hover);
}

.cadence-tab-btn.active {
  background: var(--cadence-accent) !important;
  border-color: var(--cadence-accent) !important;
  color: #ffffff !important;
}

.cadence-panel {
  display: none;
  flex-direction: column;
  gap: 12px;
}

.cadence-panel.active {
  display: flex;
}

.cadence-preset-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.cadence-preset-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--cadence-tinted);
  border: 1px solid var(--cadence-border);
  color: var(--cadence-text) !important;
  padding: 10px 12px;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.cadence-white-theme-btn {
  background: #ffffff !important;
  color: #1d1d1f !important;
  border: 1.5px solid rgba(0, 0, 0, 0.18) !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.cadence-preset-btn:hover {
  border-color: var(--cadence-accent) !important;
  transform: translateY(-1px);
}

.cadence-swatch {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 3 Circular Color Wheels Grid */
.cadence-wheels-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.cadence-wheel-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: var(--cadence-tinted);
  border: 1px solid var(--cadence-border);
  padding: 12px 10px;
  border-radius: 14px;
}

.cadence-wheel-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--cadence-text) !important;
}

.cadence-wheel-box {
  position: relative;
  border-radius: 50%;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(128, 128, 128, 0.25);
  cursor: crosshair;
}

.cadence-wheel-canvas {
  display: block;
  border-radius: 50%;
}

.cadence-wheel-cursor {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2.5px solid #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.cadence-brightness-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  font-size: 10px;
  color: var(--cadence-subtext) !important;
}

.cadence-brightness-row input[type="range"] {
  flex: 1;
  accent-color: var(--cadence-accent);
  cursor: pointer;
}

.cadence-hex-badge {
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: 99px;
  background: var(--cadence-surface-hover);
  color: var(--cadence-text) !important;
}

.cadence-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--cadence-tinted);
  padding: 11px 14px;
  border-radius: 11px;
  border: 1px solid var(--cadence-border);
  font-size: 12.5px;
  color: var(--cadence-text) !important;
}

.cadence-row input[type="range"],
.cadence-row input[type="checkbox"] {
  accent-color: var(--cadence-accent);
  cursor: pointer;
}

.cadence-row input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.cadence-code-box {
  font-size: 11px;
  background: var(--cadence-surface-hover);
  color: var(--cadence-text) !important;
  padding: 8px 10px;
  border-radius: 8px;
  word-break: break-all;
  user-select: all;
}
