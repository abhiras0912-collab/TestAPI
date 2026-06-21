const fs = require('fs');
const path = require('path');
const { download, OUT_PATH, SWAGGER_URL } = require('./swagger-loader');
const cfg = require('./utils/config');
const { log } = require('./utils/logger');

async function ensureSwagger() {
  if (!fs.existsSync(OUT_PATH)) {
    log('Swagger file missing; downloading');
    await download();
  }
  const raw = fs.readFileSync(OUT_PATH, 'utf8');
  return JSON.parse(raw);
}

function makeBaseUrl(spec) {
  // Swagger v2: use schemes + host + basePath
  if (cfg.BASE_URL) return cfg.BASE_URL;
  const schemes = spec.schemes || ['https'];
  const scheme = schemes[0];
  const host = spec.host || 'localhost';
  const basePath = spec.basePath || '';
  return `${scheme}://${host}${basePath}`;
}

function sampleForSchema(schema, definitions = {}) {
  if (!schema) return {};
  if (schema.$ref) {
    const name = schema.$ref.replace('#/definitions/', '');
    const def = definitions[name];
    if (!def) return {};
    return sampleForSchema(def, definitions);
  }
  if (schema.type === 'object') {
    const obj = {};
    const props = schema.properties || {};
    for (const [k, v] of Object.entries(props)) {
      if (v.example !== undefined) obj[k] = v.example;
      else if (v.type === 'string') obj[k] = 'string';
      else if (v.type === 'integer' || v.type === 'number') obj[k] = 1;
      else if (v.type === 'boolean') obj[k] = true;
      else if (v.type === 'array') obj[k] = [sampleForSchema(v.items || {}, definitions)];
      else obj[k] = null;
    }
    return obj;
  }
  if (schema.type === 'array') return [sampleForSchema(schema.items || {}, definitions)];
  if (schema.type === 'string') return schema.example || 'string';
  if (schema.type === 'integer' || schema.type === 'number') return 1;
  if (schema.type === 'boolean') return true;
  return {};
}

function generateTests(spec) {
  const baseUrl = makeBaseUrl(spec);
  const defs = spec.definitions || {};
  const lines = [];
  lines.push("const { createClient } = require('../src/api-client');");
  lines.push("const { buildValidator } = require('../src/utils/validator');");
  lines.push("const client = createClient(\"" + baseUrl + "\");");
  lines.push("const validator = buildValidator(require('../src/swagger.json').definitions || {});");
  lines.push("describe('Generated API tests from Swagger', () => {");

  for (const [route, methods] of Object.entries(spec.paths || {})) {
    for (const [method, op] of Object.entries(methods)) {
      // Skip operations that require multipart or urlencoded forms (file uploads)
      const consumes = (op.consumes || spec.consumes || []).map(s => s.toLowerCase());
      if (consumes.includes('multipart/form-data') || consumes.includes('application/x-www-form-urlencoded')) {
        continue;
      }
      const opId = (op.operationId || `${method}_${route}`).replace(/[^a-zA-Z0-9_]/g, '_');
      const okResponses = Object.keys(op.responses || {}).filter(s => /^2/.test(s));
      const expectStatus = okResponses.length ? okResponses[0] : '200';

      // Construct path with sample path params
      let testPath = route;
      const pathParams = (op.parameters || []).filter(p => p.in === 'path');
      for (const p of pathParams) {
        const sample = p.example || (p.type === 'integer' ? 1 : '1');
        testPath = testPath.replace(`{${p.name}}`, encodeURIComponent(sample));
      }

      // Query params
      const queryParams = (op.parameters || []).filter(p => p.in === 'query');
      const qpPairs = queryParams.map(p => `${p.name}=${encodeURIComponent(p.example || ('string'))}`);
      const queryString = qpPairs.length ? `?${qpPairs.join('&')}` : '';

      // Body sample
      const bodyParam = (op.parameters || []).find(p => p.in === 'body');
      let bodySample = 'null';
      if (bodyParam && bodyParam.schema) {
        const sample = sampleForSchema(bodyParam.schema, defs);
        bodySample = JSON.stringify(sample);
      }

      // Response schema (first 2xx)
      const respSchema = (op.responses && Object.entries(op.responses).find(([k]) => /^2/.test(k)) || [])[1];
      let respSchemaStr = 'null';
      if (respSchema && respSchema.schema) respSchemaStr = JSON.stringify(respSchema.schema);

      // Positive test
      lines.push(`  test('${method.toUpperCase()} ${route} - positive', async () => {`);
        lines.push(`    const res = await client.request({ method: '${method}', url: '${testPath}${queryString}', data: ${bodySample} });`);
      lines.push(`    expect(res.status.toString().startsWith('2')).toBeTruthy();`);
      lines.push(`    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();`);
      if (respSchemaStr !== 'null') {
        lines.push(`    const schema = ${respSchemaStr};`);
        lines.push(`    const out = validator.validateSchema(schema, res.data);`);
        lines.push(`    expect(out.valid).toBeTruthy();`);
      }
      lines.push('  });');

      // Negative test: missing required path param or invalid id
      if (pathParams.length) {
        const badPath = route.replace(/\{[^}]+\}/g, '99999999');
        lines.push(`  test('${method.toUpperCase()} ${route} - negative invalid id', async () => {`);
        lines.push('    let threw = false;');
        lines.push('    try {');
          lines.push(`      await client.request({ method: '${method}', url: '${badPath}' });`);
        lines.push('    } catch (e) { threw = true; expect(e.response && [400,404,422].includes(e.response.status)).toBeTruthy(); }');
        lines.push('    expect(threw).toBeTruthy();');
        lines.push('  });');
      }
    }
  }

  lines.push('});');

  return lines.join('\n');
}

async function main() {
  const spec = await ensureSwagger();
  const tests = generateTests(spec);
  const outPath = path.join(process.cwd(), 'tests', 'generated.test.js');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, tests, 'utf8');
  log('Wrote generated tests to', outPath);
  console.log('Generated tests:', outPath);
}

if (require.main === module) main().catch(err => { console.error(err); process.exit(1); });

module.exports = { generateTests };
