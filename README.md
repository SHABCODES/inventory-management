# Inventory Management System

A modern, full-stack inventory management system built with React.js, Node.js, and PostgreSQL.

##  Features

- Product management (CRUD operations)
- Real-time stock tracking
- Low stock alerts
- Category management
- Responsive design

##  Tech Stack

- **Frontend**: React.js, Vite, CSS3
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Container**: Docker, Dev Containers

##  Getting Started

This project is configured for GitHub Codespaces. Simply:

1. Click "Code" → "Open with Codespaces"
2. Create a new codespace
3. Wait for the setup to complete automatically

The system will:
- Set up PostgreSQL database
- Install all dependencies
- Start both frontend and backend servers

##  Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Database**: PostgreSQL on localhost:5432

##  Project Structure
inventory-management/
├── backend/ # Node.js/Express API
├── frontend/ # React.js frontend
├── database/ # Database schema and init scripts
└── .devcontainer/ # Codespace configuration


##  Usage

1. **View Products**: See all products with stock levels
2. **Add Product**: Click "Add Product" to create new items
3. **Edit Product**: Click "Edit" on any product card
4. **Stock Alerts**: Low stock items are highlighted in red
5. **Delete Products**: Remove products with the delete button

##  Development

The codespace comes with:
- Auto-forwarded ports
- Pre-installed extensions
- Hot-reload for both frontend and backend
- PostgreSQL client tools
