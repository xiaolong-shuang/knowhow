@echo off
title KnowHow

cd /d "%~dp0"

echo.
echo   ========================================
echo     KnowHow - Industry Analysis Agent
echo   ========================================
echo.

:: Check node_modules
if not exist "node_modules\" (
    echo [1/2] Installing dependencies...
    call pnpm install
    echo.
)

echo [2/2] Starting server on http://localhost:3101
echo.
start http://localhost:3101
call npx next dev -p 3101
pause
