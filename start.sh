#!/bin/bash

# Trading View Automation - Startup Script
# This script helps you run the application locally

echo "🚀 Trading View Automation - Setup Script"
echo "=========================================="

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    
    echo ""
    echo "Choose how to run the application:"
    echo "1. Run with Docker (recommended)"
    echo "2. Run without Docker (manual setup)"
    read -p "Enter your choice (1 or 2): " choice
    
    if [ "$choice" = "1" ]; then
        echo ""
        echo "🐳 Starting with Docker..."
        echo ""
        docker-compose up --build
    else
        echo ""
        echo "📦 Manual setup instructions below..."
    fi
else
    echo "❌ Docker is not installed"
    echo ""
    echo "To install Docker:"
    echo "  • Download from: https://docker.com/products/docker-desktop"
    echo "  • Or use Homebrew: brew install --cask docker"
    echo ""
fi

echo ""
echo "=========================================="
echo "Manual Setup Instructions (without Docker)"
echo "=========================================="
echo ""
echo "1. Install MongoDB:"
echo "   brew install mongodb-community"
echo "   brew services start mongodb-community"
echo ""
echo "2. Run Backend (Terminal 1):"
echo "   cd backend"
echo "   pip3 install -r requirements.txt"
echo "   python3 -m uvicorn server:app --reload --port 8000"
echo ""
echo "3. Run Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm install"
echo "   npm start"
echo ""
echo "4. Open in browser:"
echo "   http://localhost:3000"
echo ""
echo "=========================================="
