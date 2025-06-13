# Sysora Platform - Project Structure

## 📁 Project Organization

This document outlines the reorganized structure of the Sysora hotel management platform.

### 🏗️ Root Directory Structure

```
📁 Sysora LP/
├── 📁 docs/                          # Documentation & Reports
│   ├── 📄 README.md                  # Main project documentation
│   ├── 📄 QUICK_START.md             # Quick start guide
│   ├── 📄 PROJECT_SUMMARY.md         # Project overview
│   └── 📄 *.md                       # All technical reports
│
├── 📁 deployment/                    # Deployment Scripts & Tools
│   ├── 📄 deploy.sh                  # Main deployment script
│   ├── 📄 deploy.ps1                 # PowerShell deployment
│   ├── 📄 *.js                       # Deployment utilities
│   └── 📄 *.ps1                      # PowerShell scripts
│
├── 📁 mobile-apps/                   # Mobile Applications
│   ├── 📁 android-project/           # Native Android app
│   ├── 📁 react-native-app/          # React Native app
│   └── 📁 legacy-hotel-system/       # Legacy Python hotel system
│
├── 📁 src/                          # Main Application Source
│   ├── 📁 components/               # React Components
│   │   ├── 📁 common/               # Shared components
│   │   ├── 📁 landing/              # Landing page components
│   │   ├── 📁 hotel/                # Hotel dashboard components
│   │   ├── 📁 admin/                # Admin dashboard components
│   │   └── 📁 forms/                # Form components
│   │
│   ├── 📁 pages/                    # Page Components
│   │   ├── 📁 landing/              # Landing pages (EN/AR/FR)
│   │   ├── 📁 hotel/                # Hotel dashboard pages
│   │   └── 📁 admin/                # Admin dashboard pages
│   │
│   ├── 📁 services/                 # API Services
│   ├── 📁 hooks/                    # Custom React Hooks
│   ├── 📁 contexts/                 # React Contexts
│   ├── 📁 utils/                    # Utility Functions
│   ├── 📁 styles/                   # CSS & Styling
│   └── 📁 translations/             # Internationalization
│
├── 📁 server/                       # Backend Server
│   ├── 📁 controllers/              # API Controllers
│   ├── 📁 models/                   # Database Models
│   ├── 📁 routes/                   # API Routes
│   ├── 📁 middleware/               # Express Middleware
│   ├── 📁 utils/                    # Server Utilities
│   └── 📁 seeders/                  # Database Seeders
│
├── 📁 dist/                         # Built Application
├── 📁 uploads/                      # File Uploads
├── 📁 node_modules/                 # Dependencies
│
├── 📄 package.json                  # Project Configuration
├── 📄 vite.config.js               # Vite Configuration
├── 📄 tailwind.config.js           # Tailwind CSS Config
├── 📄 docker-compose.yml           # Docker Configuration
└── 📄 PROJECT_STRUCTURE.md         # This file
```

## 🎯 Key Features by Section

### 🌐 Landing Page (`src/pages/landing/`)
- Multi-language support (English, Arabic, French)
- Hotel workspace registration
- User authentication
- Pricing information
- Demo access

### 🏨 Hotel Dashboard (`src/pages/hotel/`)
- Room management
- Reservation system
- Guest management
- Payment processing
- Settings & customization
- Housekeeping services

### 👑 Admin Dashboard (`src/pages/admin/`)
- Platform management
- Hotel oversight
- Subscription management
- Analytics & reporting
- System configuration

### 📱 Mobile Applications (`mobile-apps/`)
- **Android Project**: Native Android application
- **React Native App**: Cross-platform mobile app
- **Legacy Hotel System**: Python-based hotel management system

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Deploy to AWS**:
   ```bash
   npm run deploy
   ```

## 📚 Documentation

All technical documentation, reports, and guides are located in the `docs/` directory:

- **Setup Guides**: Installation and configuration
- **Feature Reports**: Detailed feature documentation
- **Deployment Guides**: AWS and production deployment
- **API Documentation**: Backend API reference

## 🔧 Development

### Frontend Stack
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations

### Backend Stack
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **Multer** for file uploads

### Mobile Stack
- **React Native** for cross-platform
- **Native Android** for Android-specific features

## 🌍 Multi-language Support

The platform supports multiple languages:
- **English** (Primary)
- **French** (Planned)
- **Arabic** (Planned)

Language files are organized in `src/translations/`.

## 📦 Deployment

Deployment scripts and configurations are in the `deployment/` directory:
- AWS deployment automation
- Docker containerization
- Environment configuration
- Health checks and monitoring

---

**Sysora Platform** - Professional Hotel Management System
