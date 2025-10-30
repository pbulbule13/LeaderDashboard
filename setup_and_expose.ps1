Param(
  [string]$NgrokAuthToken = $env:NGROK_AUTHTOKEN,
  [int]$Port = 8000
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "[ OK ] $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Err($msg)  { Write-Host "[ERR ] $msg" -ForegroundColor Red }

# Ensure we are in the repo root (folder containing 'healthcare_sciences_dashboard')
$RepoRoot = Get-Location
$AppDir   = Join-Path $RepoRoot "healthcare_sciences_dashboard"
if (-not (Test-Path (Join-Path $AppDir "requirements.txt"))) {
  Err "Run this from the project root (contains 'healthcare_sciences_dashboard'). Current: $RepoRoot"
  exit 1
}

# Python setup
$VenvDir = Join-Path $RepoRoot ".venv"
$PyExe   = if (Test-Path (Join-Path $VenvDir "Scripts\python.exe")) { Join-Path $VenvDir "Scripts\python.exe" } else { "python" }

Info "Checking Python..."
& $PyExe --version | Out-Host

if (-not (Test-Path $VenvDir)) {
  Info "Creating virtual environment in $VenvDir"
  & python -m venv $VenvDir
  $PyExe = Join-Path $VenvDir "Scripts\python.exe"
}

Info "Upgrading pip and installing requirements..."
& $PyExe -m pip install --upgrade pip
& $PyExe -m pip install -r (Join-Path $AppDir "requirements.txt")

# Ensure PORT is set (defaults to 8000 via app_config.py if not)
if (-not $env:PORT) { $env:PORT = "$Port" }

# Start API server
Info "Starting API server on port $Port..."
$serverOut = Join-Path $RepoRoot "server.out.log"
$serverErr = Join-Path $RepoRoot "server.err.log"
$apiArgs = @{
  FilePath = $PyExe
  WorkingDirectory = $AppDir
  ArgumentList = "run_server.py"
  RedirectStandardOutput = $serverOut
  RedirectStandardError = $serverErr
  PassThru = $true
}
$apiProc = Start-Process @apiArgs

Start-Sleep -Seconds 2

# Wait for health endpoint
$healthUrl = "http://127.0.0.1:$Port/health"
$ok = $false
1..30 | ForEach-Object {
  try {
    $res = Invoke-RestMethod -Uri $healthUrl -TimeoutSec 2
    if ($res.status -eq "healthy") { $ok = $true; throw [System.Exception]::new("break") }
  } catch {
    Start-Sleep -Milliseconds 800
  }
}
if ($ok) { Ok "API healthy: $healthUrl" } else { Warn "API health not confirmed; see $serverOut and $serverErr" }

# Install ngrok if missing
if (-not (Get-Command ngrok -ErrorAction SilentlyContinue)) {
  Info "Installing ngrok via winget..."
  try {
    winget install -e --id Ngrok.Ngrok --accept-source-agreements --accept-package-agreements | Out-Host
  } catch {
    Err "Failed to install ngrok with winget. Install manually from https://ngrok.com/download and rerun."
    exit 1
  }
}

# Configure ngrok authtoken
if (-not $NgrokAuthToken) {
  $NgrokAuthToken = Read-Host "Enter your ngrok authtoken (from dashboard.ngrok.com)"
}
Info "Configuring ngrok authtoken..."
& ngrok config add-authtoken $NgrokAuthToken | Out-Host

# Start ngrok tunnel
Info "Starting ngrok tunnel to http://127.0.0.1:$Port ..."
$ngrokProc = Start-Process -FilePath "ngrok" -ArgumentList "http $Port" -PassThru

# Fetch public URL from ngrok local API
$publicUrl = $null
1..30 | ForEach-Object {
  try {
    $tunnels = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 2
    $https = $tunnels.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1
    if ($https) { $publicUrl = $https.public_url; throw [System.Exception]::new("break") }
  } catch {
    Start-Sleep -Milliseconds 700
  }
}

if ($publicUrl) {
  Ok "Public URL: $publicUrl"
  Info "Health: $publicUrl/health"
  Info "UI:     $publicUrl/ui"
  try { Start-Process "$publicUrl/ui" | Out-Null } catch {}
} else {
  Warn "Could not fetch public URL from ngrok API. Check the ngrok window for the Forwarding URL."
}

Write-Host ""
Ok "Setup complete."
Info "To stop: Stop-Process -Id $($apiProc.Id); if ($ngrokProc) { Stop-Process -Id $($ngrokProc.Id) }"
Info "Server logs: $serverOut (stdout), $serverErr (stderr)"
