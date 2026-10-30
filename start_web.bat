@echo off
title Red Line VIP Web Store (Local Dev)
cd /d "%~dp0"
echo ========================================================
echo   RED LINE VIP - WEB STORE & CUSTOMER PORTAL
echo ========================================================
echo.
echo [Launch] Starting Next.js server on http://localhost:3000...
node node_modules/next/dist/bin/next dev -p 3000
pause

