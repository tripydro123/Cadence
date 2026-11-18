#!/usr/bin/env sh
set -e

# Cadence v3.2 Zero-Python macOS & Linux Installer
REPO="tripydro123/cadence"
BRANCH="main"
BASE_URL="https://raw.githubusercontent.com/$REPO/$BRANCH"

if ! command -v spicetify >/dev/null 2>&1; then
  echo "Spicetify CLI not found. Install it first: https://spicetify.app/docs/getting-started"
  exit 1
fi

SPICETIFY_DIR="$HOME/.config/spicetify"
THEME_DIR="$SPICETIFY_DIR/Themes/Cadence"
EXT_DIR="$SPICETIFY_DIR/Extensions"

mkdir -p "$THEME_DIR" "$EXT_DIR"

echo "Downloading Cadence v3.2 theme and Studio extension..."
curl -fsSL "$BASE_URL/color.ini" -o "$THEME_DIR/color.ini"
curl -fsSL "$BASE_URL/user.css" -o "$THEME_DIR/user.css"
curl -fsSL "$BASE_URL/cadence.js" -o "$EXT_DIR/cadence.js"

echo "Applying Cadence v3.2 configuration..."
spicetify config current_theme Cadence color_scheme Dark
spicetify config extensions cadence.js
spicetify config inject_css 1 replace_colors 1 overwrite_assets 1
spicetify apply

echo "Cadence v3.2 installed and applied!"
