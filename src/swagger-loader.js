const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { log } = require('./utils/logger');

const SWAGGER_URL = 'https://petstore.swagger.io/v2/swagger.json';
const OUT_PATH = path.join(__dirname, 'swagger.json');

async function download() {
  log('Downloading Swagger spec from', SWAGGER_URL);
  const res = await axios.get(SWAGGER_URL, { timeout: 15000 });
  fs.writeFileSync(OUT_PATH, JSON.stringify(res.data, null, 2), 'utf8');
  log('Saved swagger to', OUT_PATH);
}

if (require.main === module) {
  download()
    .then(() => console.log('Swagger refreshed:', OUT_PATH))
    .catch(err => {
      console.error('Failed to download swagger:', err.message || err);
      process.exit(1);
    });
}

module.exports = { download, OUT_PATH, SWAGGER_URL };
