@echo off
title HR System
color 0A
cls

echo.
echo  ==========================================
echo       University HR System - Starting
echo  ==========================================
echo.

:: Launch everything in one PowerShell window
powershell -NoExit -ExecutionPolicy Bypass -Command ^
  "$root = '%~dp0'; " ^
  "$c = @{ForegroundColor='Cyan'}; " ^
  "$g = @{ForegroundColor='Green'}; " ^
  "$y = @{ForegroundColor='Yellow'}; " ^
  "Write-Host ''; " ^
  "Write-Host ' Starting all services...' @c; " ^
  "Write-Host ''; " ^
  "$laravel = Start-Job -Name 'Laravel' -ScriptBlock { param($r) Set-Location \"$r\Backend\"; php artisan serve 2>&1 } -ArgumentList $root; " ^
  "$reverb  = Start-Job -Name 'Reverb'  -ScriptBlock { param($r) Set-Location \"$r\Backend\"; php artisan reverb:start 2>&1 } -ArgumentList $root; " ^
  "$react   = Start-Job -Name 'React'   -ScriptBlock { param($r) Set-Location \"$r\Frontend\"; npm run dev 2>&1 } -ArgumentList $root; " ^
  "Start-Sleep 2; " ^
  "Write-Host ' [OK] Laravel   ->  http://localhost:8000' @g; " ^
  "Write-Host ' [OK] Reverb    ->  ws://localhost:8080'  @g; " ^
  "Write-Host ' [OK] React     ->  http://localhost:5173' @g; " ^
  "Write-Host ''; " ^
  "Write-Host ' Open browser: http://localhost:5173' @y; " ^
  "Write-Host ' Press Ctrl+C to stop all services.' @y; " ^
  "Write-Host ''; " ^
  "Write-Host ' ---- Live Output ----' @c; " ^
  "Write-Host ''; " ^
  "try { while ($true) { " ^
  "  Receive-Job $laravel | ForEach-Object { Write-Host \"  [Laravel] $_\" }; " ^
  "  Receive-Job $reverb  | ForEach-Object { Write-Host \"  [Reverb]  $_\" }; " ^
  "  Receive-Job $react   | ForEach-Object { Write-Host \"  [React]   $_\" }; " ^
  "  Start-Sleep -Milliseconds 300 " ^
  "} } finally { " ^
  "  Stop-Job $laravel,$reverb,$react; " ^
  "  Remove-Job $laravel,$reverb,$react; " ^
  "  Get-Process php,node -ErrorAction SilentlyContinue | Stop-Process -Force; " ^
  "  Write-Host ''; Write-Host ' All services stopped.' -ForegroundColor Red " ^
  "}"
