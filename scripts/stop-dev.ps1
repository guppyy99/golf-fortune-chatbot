$ErrorActionPreference = 'SilentlyContinue'
try { Stop-Process -Name node -Force } catch {}
Start-Sleep -Seconds 1
try {
    & netstat -aon | findstr ":3000" | findstr LISTENING | Out-Null
    if ($LASTEXITCODE -ne 0) { Write-Output "DEV_SERVER_STOPPED" } else { Write-Output "DEV_SERVER_MAY_STILL_BE_RUNNING" }
} catch {
    Write-Output "DEV_SERVER_STOP_ATTEMPTED"
}



