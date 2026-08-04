@echo off
echo Starting LifeLine AI Healthcare Dashboard...
echo.

echo Checking if Node modules are installed...
if not exist "backend\node_modules" (
  echo Installing backend dependencies...
  cd backend
  call npm install
  cd ..
)

if not exist "frontend\node_modules" (
  echo Installing frontend dependencies...
  cd frontend
  call npm install
  cd ..
)

echo.
echo Starting Backend Server...
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak

echo Starting Frontend Development Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo LifeLine AI is starting up!
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press any key to close this window...
pause
