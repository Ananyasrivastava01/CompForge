const fs = require('fs');
const path = require('path');

console.log('🚀 Starting CompForge Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found!');
  console.log('📝 Please create a .env file based on env.example');
  console.log('💡 Run: cp env.example .env');
  console.log('🔧 Then edit .env with your configuration\n');
  process.exit(1);
}

// Check required environment variables
require('dotenv').config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'OPENROUTER_API_KEY'
];

const optionalEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Please add these to your .env file\n');
  process.exit(1);
}

// Check optional OAuth variables
const missingOAuthVars = optionalEnvVars.filter(varName => !process.env[varName]);
if (missingOAuthVars.length > 0) {
  console.log('⚠️  OAuth not configured (optional):');
  missingOAuthVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('💡 OAuth will be disabled. Email/password auth will still work.\n');
} else {
  console.log('✅ OAuth configured (Google & GitHub)');
}

console.log('✅ Environment variables loaded');
console.log('📦 Connecting to database...');

// Start the app
require('./src/app.js'); 