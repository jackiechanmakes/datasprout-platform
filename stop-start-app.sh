#!/bin/bash

# Stop the frontend (React app) served by PM2
echo "Stopping frontend..."
pm2 stop "datasprout-frontend"

# Stop the backend (Node.js server) managed by PM2
echo "Stopping backend..."
pm2 stop "datasprout-backend"

# Delete the stopped processes from PM2 
echo "Deleting frontend and backend from PM2 process list..."
pm2 delete "datasprout--frontend"
pm2 delete "datasprout-backend"

# Save the PM2 process list
pm2 save

# Confirm shutdown
echo "Frontend and backend processes have been stopped and removed from PM2."

# Start backend (Node.js server)
echo "Starting backend..."
cd backend/
# node server.js &
pm2 start server.js --name "datasprout-backend"

sleep 2

# Start frontend (React app)
echo "Starting frontend..."
cd ../frontend
# npm start &
npm run build 
pm2 serve build --name "datasprout-frontend" --port 3000

