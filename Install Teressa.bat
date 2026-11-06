@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Install Teressa.ps1"
if errorlevel 1 (
  echo.
  echo Teressa could not be installed. See the message above for details.
  pause
  exit /b 1
)
