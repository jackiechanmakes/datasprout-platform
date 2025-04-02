#!/bin/bash

# Stop the frontend (React app) served by PM2
echo "Stopping frontend..."
pm2 stop "plant-proj-frontend"

# Stop the backend (Node.js server) managed by PM2
echo "Stopping backend..."
pm2 stop "plant-proj-backend"

# Optionally, delete the stopped processes from PM2 (to remove them from the PM2 process list)
echo "Deleting frontend and backend from PM2 process list..."
pm2 delete "sensor-frontend"
pm2 delete "plant-proj-backend"

# Save the PM2 process list (this ensures PM2 remembers the state after a restart)
pm2 save

# Confirm shutdown
echo "Frontend and backend processes have been stopped and removed from PM2."
