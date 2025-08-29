@echo off
echo Starting Greeny Credit Backend Server...
echo.
echo Make sure you have configured the .env file with your email credentials!
echo.
echo Installing dependencies (if needed)...
npm install
echo.
echo Starting server in development mode...
echo Server will be available at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
npm run dev
pause
