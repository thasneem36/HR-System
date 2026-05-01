@echo off
title HR System - Stopping
color 0C
cls

echo.
echo  ==========================================
echo       University HR System - Stopping
echo  ==========================================
echo.

echo  Stopping PHP (Laravel + Reverb)...
taskkill /F /IM php.exe >nul 2>&1
echo  [Done] PHP stopped

echo  Stopping Node (React)...
taskkill /F /IM node.exe >nul 2>&1
echo  [Done] Node stopped

echo.
echo  All services stopped.
echo.
pause
