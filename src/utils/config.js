const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const cfg = {
  BASE_URL: process.env.BASE_URL || '',
  TIMEOUT: parseInt(process.env.TIMEOUT || '10000', 10),
  RETRIES: parseInt(process.env.RETRIES || '2', 10),
  LOGGING: (process.env.LOGGING || 'true') === 'true'
};

module.exports = cfg;
