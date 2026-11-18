$ErrorActionPreference = "Stop"
Write-Host "Installing Cadence v3.3 (Apple Music Desktop UI)..." -ForegroundColor Cyan

$spicetifyPath = "$env:APPDATA\spicetify"
$themeDir = "$spicetifyPath\Themes\Cadence"
$extDir = "$spicetifyPath\Extensions"
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$baseUrl = "https://raw.githubusercontent.com/tripydro123/cadence/main"

New-Item -ItemType Directory -Force -Path $themeDir | Out-Null
New-Item -ItemType Directory -Force -Path $extDir | Out-Null

Invoke-WebRequest -Uri "$baseUrl/color.ini?v=$ts" -OutFile "$themeDir\color.ini"
Invoke-WebRequest -Uri "$baseUrl/user.css?v=$ts" -OutFile "$themeDir\user.css"
Invoke-WebRequest -Uri "$baseUrl/manifest.json?v=$ts" -OutFile "$themeDir\manifest.json"
Invoke-WebRequest -Uri "$baseUrl/cadence.js?v=$ts" -OutFile "$extDir\cadence.js"

spicetify config current_theme Cadence color_scheme Cadence
spicetify config extensions cadence.js
spicetify apply

Write-Host "Cadence v3.3 installed! Press Alt + C in Spotify to open Cadence Studio." -ForegroundColor Green
