@echo off
REM Ouvre l'administration (/admin/) du site servi depuis ce PC.
cd /d "%~dp0.."
netstat -ano | findstr /r /c:":8123 .*LISTENING" >nul
if errorlevel 1 (
  start "Philo admin" /min python -m http.server 8123
  timeout /t 2 /nobreak >nul
)
start "" "http://localhost:8123/admin/"