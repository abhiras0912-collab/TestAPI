const Ajv = require('ajv');
const addFormats = require('ajv-formats');

function buildValidator(definitions = {}) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  // We'll keep definitions available and, at validation time, merge them
  // into the schema so that local $ref like "#/definitions/Name" resolves.
  const defs = definitions || {};

  return {
    validateSchema: (schema, data) => {
      if (!schema) return { valid: true };
      // Merge definitions into the schema so nested $ref('#/definitions/...') resolve locally
      const schemaWithDefs = Object.keys(defs).length ? Object.assign({}, schema, { definitions: defs }) : schema;
      const valid = ajv.validate(schemaWithDefs, data);
      return { valid, errors: ajv.errors };
    }
  };
}

module.exports = { buildValidator };
