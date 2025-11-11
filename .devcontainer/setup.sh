#!/bin/bash

echo "🚀 Setting up Inventory Management System..."

# Install backend dependencies
cd /workspace/backend
if [ -f "package.json" ]; then
    npm install
    echo "✅ Backend dependencies installed"
fi

# Install frontend dependencies
cd /workspace/frontend
if [ -f "package.json" ]; then
    npm install
    echo "✅ Frontend dependencies installed"
fi

# Initialize database
cd /workspace
echo "📦 Initializing database..."
psql -h db -U inventory -d inventory_system -f database/init.sql

echo "🎉 Setup complete! Starting services..."

# Start backend and frontend in background
cd /workspace/backend && npm start &
cd /workspace/frontend && npm start &

echo "✅ Services started! Access your app at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
