$ErrorActionPreference = "Stop"
Write-Host "Installing Cadence v3.5 (Full Apple Music Desktop UI + 5-Layer AdBlocker)..." -ForegroundColor Cyan

$spicetifyPath = "$env:APPDATA\spicetify"
$themeDir = "$spicetifyPath\Themes\Cadence"
$extDir = "$spicetifyPath\Extensions"
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$baseUrl = "https://raw.githubusercontent.com/tripydro123/cadence/main"

New-Item -ItemType Directory -Force -Path $themeDir | Out-Null
New-Item -ItemType Directory -Force -Path $extDir | Out-Null

Invoke-WebRequest -Uri "$baseUrl/color.ini?v=$ts" -OutFile "$themeDir\color.ini"
Invoke-WebRequest -Uri "$baseUrl/manifest.json?v=$ts" -OutFile "$themeDir\manifest.json"
Invoke-WebRequest -Uri "$baseUrl/icons.css?v=$ts" -OutFile "$themeDir\icons.css"
Invoke-WebRequest -Uri "$baseUrl/artist-split.css?v=$ts" -OutFile "$themeDir\artist-split.css"
Invoke-WebRequest -Uri "$baseUrl/user.css?v=$ts" -OutFile "$themeDir\base.css"
Invoke-WebRequest -Uri "$baseUrl/cadence.js?v=$ts" -OutFile "$extDir\cadence.js"

# Combine base user.css + icons.css + artist-split.css into user.css for Spicetify injection
Get-Content "$themeDir\base.css", "$themeDir\icons.css", "$themeDir\artist-split.css" | Set-Content "$themeDir\user.css" -Encoding UTF8

spicetify config current_theme Cadence color_scheme Cadence
spicetify config inject_css 1 replace_colors 1
spicetify config extensions cadence.js
spicetify apply

Write-Host "Cadence v3.5 installed! Press Alt + C in Spotify to open Cadence Studio." -ForegroundColor Green
