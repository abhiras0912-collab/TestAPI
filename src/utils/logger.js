const util = require('util');
const cfg = require('./config');

function log(...args) {
  if (!cfg.LOGGING) return;
  console.log('[api-tester]', ...args.map(a => (typeof a === 'object' ? util.inspect(a, { depth: 2 }) : a)));
}

module.exports = { log };
