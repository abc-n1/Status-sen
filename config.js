const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Configuration object
const config = {
  SESSION_ID: process.env.SESSION_ID || 'mw4kkDTT#LQu2xUysGGCKm-BrLSyoIa7XUNXuREG7zVElqj93sTQ',
  PREFIX: process.env.PREFIX || '.', // Command prefix for manual commands
};

// Validate required configurations
function validateConfig() {
  if (!config.SESSION_ID) {
    throw new Error('SESSION_ID is required in .env file');
  }
}

validateConfig();

module.exports = config;
