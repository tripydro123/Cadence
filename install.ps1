$ErrorActionPreference = "Stop"

# Cadence v3.2 Zero-Python Windows Installer
$Repo = "tripydro123/cadence"
$Branch = "main"
$BaseUrl = "https://raw.githubusercontent.com/$Repo/$Branch"

if (-not (Get-Command spicetify -ErrorAction SilentlyContinue)) {
    Write-Host "Spicetify CLI was not found. Please install Spicetify first: https://spicetify.app/docs/getting-started" -ForegroundColor Red
    exit 1
}

$SpicetifyDir = "$env:APPDATA\spicetify"
$ThemeDir = "$SpicetifyDir\Themes\Cadence"
$ExtDir = "$SpicetifyDir\Extensions"

New-Item -ItemType Directory -Force -Path $ThemeDir | Out-Null
New-Item -ItemType Directory -Force -Path $ExtDir | Out-Null

Write-Host "Downloading Cadence v3.2 theme and Studio extension..." -ForegroundColor Cyan
Invoke-WebRequest -UseBasicParsing "$BaseUrl/color.ini" -OutFile "$ThemeDir\color.ini"
Invoke-WebRequest -UseBasicParsing "$BaseUrl/user.css" -OutFile "$ThemeDir\user.css"
Invoke-WebRequest -UseBasicParsing "$BaseUrl/cadence.js" -OutFile "$ExtDir\cadence.js"

Write-Host "Applying Cadence v3.2 configuration..." -ForegroundColor Cyan
spicetify config current_theme Cadence color_scheme Dark
spicetify config extensions cadence.js
spicetify config inject_css 1 replace_colors 1 overwrite_assets 1
spicetify apply

Write-Host "Cadence v3.2 installed and applied! Click the Cadence Studio icon in Spotify's top bar to customize." -ForegroundColor Green
