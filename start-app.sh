#!/bin/bash

# Start backend (Node.js server)
echo "Starting backend..."
cd backend/
node server.js

sleep 5

# Start frontend (React app)
echo "Starting frontend..."
cd ../frontend
npm start

