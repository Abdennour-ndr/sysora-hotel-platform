# 🏨 Sysora Platform

> **Professional Hotel Management SaaS Platform**

A complete multi-tenant hotel management system with landing page, hotel dashboard, admin panel, and mobile applications.

## 📋 Quick Overview

Sysora is a comprehensive hotel management platform that includes:

- **🌐 Landing Page**: Multi-language landing page with hotel registration
- **🏨 Hotel Dashboard**: Complete hotel management system
- **👑 Admin Panel**: Platform administration and oversight
- **📱 Mobile Apps**: Android and React Native applications

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev

# Access the application
# Landing Page: http://localhost:3000
# Hotel Dashboard: http://localhost:3000/dashboard
# Admin Panel: http://localhost:3000/admin
```

## 📁 Project Structure

This project has been reorganized for better maintainability:

```
📁 Sysora LP/
├── 📁 docs/                    # 📚 All documentation & reports
├── 📁 deployment/              # 🚀 Deployment scripts & tools
├── 📁 mobile-apps/             # 📱 Mobile applications
│   ├── 📁 android-project/     # Native Android app
│   ├── 📁 react-native-app/    # React Native app
│   └── 📁 legacy-hotel-system/ # Legacy Python system
├── 📁 src/                     # 💻 Main application source
├── 📁 server/                  # 🔧 Backend server
└── 📄 PROJECT_STRUCTURE.md     # 📖 Detailed structure guide
```

## 🎯 Key Features

### 🌐 Landing Page
- Multi-language support (EN/AR/FR)
- Hotel workspace registration
- Real-time subdomain validation
- Responsive design

### 🏨 Hotel Management
- Room management with status tracking
- Guest profiles and loyalty programs
- Reservation system with payments
- Service requests and housekeeping
- Custom theming and branding
- Role-based access control

### 👑 Admin Dashboard
- Platform oversight and management
- Hotel analytics and reporting
- Subscription and billing management
- System configuration

### 📱 Mobile Applications
- Native Android application
- Cross-platform React Native app
- Legacy Python hotel system

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **Multer** for file uploads

### Mobile
- **React Native** for cross-platform
- **Native Android** development

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running quickly
- **[Project Summary](docs/PROJECT_SUMMARY.md)** - Detailed project overview
- **[API Documentation](docs/README.md)** - Complete API reference
- **[Deployment Guide](docs/DEPLOYMENT_README.md)** - Production deployment
- **[Mobile Setup](docs/mobile-setup-guide.md)** - Mobile app development

## 🚀 Deployment

### Fly.io Deployment (Recommended)

The application is configured for easy deployment on Fly.io:

```bash
# Install Fly.io CLI
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
flyctl auth login

# Deploy the application
flyctl deploy

# Check deployment status
flyctl status
```

### GitHub Actions CI/CD

Automated deployment is configured with GitHub Actions:

1. **Push to main branch** → Automatic deployment to Fly.io
2. **Pull requests** → Run tests and security scans
3. **Health checks** → Verify deployment success

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start:prod

# Deploy to AWS (legacy)
npm run deploy
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
# Edit .env with your configuration
```

## 🌍 Multi-language Support

The platform supports multiple languages:
- **English** (Primary)
- **French** (Planned)
- **Arabic** (Planned)

## 🎨 Brand Identity

- **Colors**: Midnight Blue (#002D5B), Mint (#2EC4B6), Light Gray (#F9FAFB)
- **Typography**: Inter & Poppins fonts
- **Design**: Modern, clean, professional

## 📱 Mobile Applications

### Android Project (`mobile-apps/android-project/`)
Native Android application for hotel management on mobile devices.

### React Native App (`mobile-apps/react-native-app/`)
Cross-platform mobile application for iOS and Android.

### Legacy Hotel System (`mobile-apps/legacy-hotel-system/`)
Python-based hotel management system (legacy).

## 🔧 Development Scripts

```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only (port 3000)
npm run dev:backend      # Start backend only (port 5000)
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm start               # Start production server
```

## 📞 Support & Documentation

- **Technical Documentation**: See `docs/` directory
- **Project Structure**: See `PROJECT_STRUCTURE.md`
- **API Reference**: See `docs/README.md`
- **Deployment Guide**: See `deployment/` directory

## 🤝 Contributing

1. Review the project structure in `PROJECT_STRUCTURE.md`
2. Check existing documentation in `docs/`
3. Follow the established code organization
4. Test thoroughly before submitting changes

---

**Sysora Platform** - Master Your Hotel Operations

For detailed information about any component, please refer to the respective documentation in the `docs/` directory or the `PROJECT_STRUCTURE.md` file.
#   S y s o r a   H o t e l   P l a t f o r m  
 