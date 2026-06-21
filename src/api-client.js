const axios = require('axios');
const cfg = require('./utils/config');
const { log } = require('./utils/logger');

function createClient(baseURL) {
  const instance = axios.create({
    baseURL,
    timeout: cfg.TIMEOUT,
    headers: { 'Accept': 'application/json' }
  });

  async function requestWithRetry(opts) {
    const attempts = cfg.RETRIES + 1;
    let lastErr;
    for (let i = 0; i < attempts; i++) {
      try {
        log('Request', { attempt: i + 1, opts });
        const res = await instance.request(opts);
        log('Response', { status: res.status, data: res.data });
        return res;
      } catch (err) {
        lastErr = err;
        const status = err.response && err.response.status;
        log('Request error', { attempt: i + 1, status, message: err.message });
        if (i === attempts - 1) throw err;
      }
    }
    throw lastErr;
  }

  return { request: requestWithRetry, instance };
}

module.exports = { createClient };
