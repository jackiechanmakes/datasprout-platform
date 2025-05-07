#!/bin/bash

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


