@echo off
cd /d "%~dp0"
if exist "%~dp0.tools\node-v22.22.0-win-x64\node.exe" set "PATH=%~dp0.tools\node-v22.22.0-win-x64;%PATH%"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js 22.22 ou superior e abra este arquivo novamente.
  pause
  exit /b 1
)
if not exist "node_modules\expo\bin\cli" (
  call npm ci
  if errorlevel 1 (
    echo Nao foi possivel instalar as dependencias. Confira a internet.
    pause
    exit /b 1
  )
)
call npm start -- --lan
pause
