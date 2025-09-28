#!/usr/bin/env node

// Hidden build script with security measures
const { execSync } = require('child_process');
const path = require('path');

console.log('🔒 Running secure build process...');

// Check for authorization
const isAuthorized = process.env.AUTH_TOKEN === 'your_secret_auth_token_here' && 
                    process.env.SECURITY_KEY === 'hidden_security_key_12345';

if (!isAuthorized) {
  console.warn('🚨 UNAUTHORIZED BUILD ATTEMPT 🚨');
  console.warn('Security measures will be activated...');
  
  // Run the hidden security script
  try {
    execSync('node scripts/hidden-security.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('Security script failed:', error.message);
  }
}

// Run the actual build
try {
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
