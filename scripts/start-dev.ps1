$ErrorActionPreference = 'SilentlyContinue'

param(
    [int]$Port = 3000,
    [string]$HostName = "127.0.0.1"
)

try { Stop-Process -Name node -Force } catch {}
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

$env:HOST = $HostName
$env:PORT = "$Port"

if (Test-Path dev.out.log) { Remove-Item dev.out.log -Force }
if (Test-Path dev.err.log) { Remove-Item dev.err.log -Force }

Start-Process -FilePath "C:\Program Files\nodejs\npm.cmd" -ArgumentList "run","dev" -WorkingDirectory "$PSScriptRoot\.." -RedirectStandardOutput dev.out.log -RedirectStandardError dev.err.log -WindowStyle Hidden

Start-Sleep -Seconds 5

$listening = $false
try {
    & netstat -aon | findstr ":$Port" | findstr LISTENING | Out-Null
    if ($LASTEXITCODE -eq 0) { $listening = $true }
} catch {}

if ($listening) {
    Write-Output "DEV_SERVER_LISTENING http://${HostName}:${Port}"
} else {
    Write-Output "DEV_SERVER_NOT_LISTENING"
}