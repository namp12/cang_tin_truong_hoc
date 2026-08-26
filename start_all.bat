@echo off
title Smart Canteen Fullstack Runner
echo ===================================================
echo   KHOI DONG HE THONG QUAN LY CANG TIN THONG MINH
echo ===================================================

echo [1/2] Dang khoi dong Backend API Server (Port 5000)...
start "Backend API Server (Port 5000)" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo [2/2] Dang khoi dong Frontend Web App (Port 5173)...
start "Frontend Web App (Port 5173)" cmd /k "cd frontend && npm run dev"

echo ===================================================
echo   HE THONG DA KHOI DONG THANH CONG!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ===================================================
timeout /t 2 /nobreak > nul
start http://localhost:5173
pause
