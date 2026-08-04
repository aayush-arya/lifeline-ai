#!/bin/bash

echo "Starting LifeLine AI Healthcare Dashboard..."
echo ""

# Check and install backend dependencies
if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  cd backend
  npm install
  cd ..
fi

# Check and install frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd frontend
  npm install
  cd ..
fi

echo ""
echo "Starting Backend Server..."
(cd backend && npm start) &
BACKEND_PID=$!

sleep 3

echo "Starting Frontend Development Server..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "LifeLine AI is starting up!"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers..."

wait
