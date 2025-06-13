#!/usr/bin/env node

/**
 * Sysora Platform Startup Script
 * This script helps you start the Sysora platform with all necessary services
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvironment() {
  log('🔍 Checking environment...', 'cyan');
  
  // Check if .env file exists
  const envPath = join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found!', 'red');
    log('📝 Creating .env file from template...', 'yellow');
    
    const envTemplate = `# Sysora Platform Environment Variables

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sysora_platform
DB_NAME=sysora_platform

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Sysora

# Email Configuration (for future use)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Payment Configuration (for future use)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# App Configuration
DEFAULT_SUBDOMAIN_SUFFIX=.sysora.com
FRONTEND_URL=http://localhost:3000`;

    fs.writeFileSync(envPath, envTemplate);
    log('✅ .env file created successfully!', 'green');
  }

  // Check if node_modules exists
  const nodeModulesPath = join(__dirname, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log('❌ node_modules not found!', 'red');
    log('📦 Please run: npm install', 'yellow');
    process.exit(1);
  }

  log('✅ Environment check passed!', 'green');
}

function startMongoDB() {
  log('🍃 Starting MongoDB...', 'green');
  log('💡 Make sure MongoDB is installed and running on your system', 'yellow');
  log('   - Windows: Start MongoDB service or run mongod.exe', 'yellow');
  log('   - macOS: brew services start mongodb-community', 'yellow');
  log('   - Linux: sudo systemctl start mongod', 'yellow');
}

function startBackend() {
  log('🚀 Starting backend server...', 'blue');
  
  const backend = spawn('npm', ['run', 'dev:backend'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  backend.on('error', (error) => {
    log(`❌ Backend error: ${error.message}`, 'red');
  });

  return backend;
}

function startFrontend() {
  log('⚡ Starting frontend development server...', 'magenta');
  
  const frontend = spawn('npm', ['run', 'dev:frontend'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  frontend.on('error', (error) => {
    log(`❌ Frontend error: ${error.message}`, 'red');
  });

  return frontend;
}

function displayWelcomeMessage() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🎉 WELCOME TO SYSORA PLATFORM! 🎉', 'bright');
  log('='.repeat(60), 'cyan');
  log('', 'reset');
  log('🌐 Frontend (Landing Page): http://localhost:3000', 'green');
  log('🔧 Backend API: http://localhost:5000', 'blue');
  log('📊 Dashboard: http://localhost:3000/dashboard', 'magenta');
  log('', 'reset');
  log('📚 API Endpoints:', 'yellow');
  log('   • POST /api/auth/register-hotel - Register new hotel', 'reset');
  log('   • POST /api/auth/login - User login', 'reset');
  log('   • GET  /api/hotels/dashboard - Dashboard data', 'reset');
  log('   • GET  /api/rooms - Manage rooms', 'reset');
  log('   • GET  /api/guests - Manage guests', 'reset');
  log('   • GET  /api/reservations - Manage reservations', 'reset');
  log('', 'reset');
  log('🔑 Default Test Account (after registration):', 'yellow');
  log('   • Email: Your registered email', 'reset');
  log('   • Password: Generated temporary password (check console)', 'reset');
  log('', 'reset');
  log('💡 Tips:', 'cyan');
  log('   • Register a hotel on the landing page', 'reset');
  log('   • Use the generated credentials to access dashboard', 'reset');
  log('   • Check the console for temporary passwords', 'reset');
  log('', 'reset');
  log('🛑 To stop: Press Ctrl+C', 'red');
  log('='.repeat(60), 'cyan');
}

async function main() {
  log('🚀 Starting Sysora Platform...', 'bright');
  log('', 'reset');

  // Check environment
  checkEnvironment();

  // Display MongoDB instructions
  startMongoDB();

  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Start services
  const backend = startBackend();
  
  // Wait for backend to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const frontend = startFrontend();

  // Display welcome message
  setTimeout(() => {
    displayWelcomeMessage();
  }, 5000);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('\n🛑 Shutting down Sysora Platform...', 'yellow');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });

  // Keep the process alive
  process.stdin.resume();
}

main().catch((error) => {
  log(`❌ Startup error: ${error.message}`, 'red');
  process.exit(1);
});
