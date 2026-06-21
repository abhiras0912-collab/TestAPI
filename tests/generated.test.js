const { createClient } = require('../src/api-client');
const { buildValidator } = require('../src/utils/validator');
const client = createClient("https://petstore.swagger.io/v2");
const validator = buildValidator(require('../src/swagger.json').definitions || {});
describe('Generated API tests from Swagger', () => {
  test('POST /pet - positive', async () => {
    const res = await client.request({ method: 'post', url: '/pet', data: {"id":1,"category":null,"name":"doggie","photoUrls":["string"],"tags":[{"id":1,"name":"string"}],"status":"string"} });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
  });
  test('PUT /pet - positive', async () => {
    const res = await client.request({ method: 'put', url: '/pet', data: {"id":1,"category":null,"name":"doggie","photoUrls":["string"],"tags":[{"id":1,"name":"string"}],"status":"string"} });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
  });
  test('GET /pet/findByStatus - positive', async () => {
    const res = await client.request({ method: 'get', url: '/pet/findByStatus?status=string', data: null });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
    const schema = {"type":"array","items":{"$ref":"#/definitions/Pet"}};
    const out = validator.validateSchema(schema, res.data);
    expect(out.valid).toBeTruthy();
  });
  test('GET /pet/findByTags - positive', async () => {
    const res = await client.request({ method: 'get', url: '/pet/findByTags?tags=string', data: null });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
    const schema = {"type":"array","items":{"$ref":"#/definitions/Pet"}};
    const out = validator.validateSchema(schema, res.data);
    expect(out.valid).toBeTruthy();
  });
  test('GET /pet/{petId} - positive', async () => {
    const res = await client.request({ method: 'get', url: '/pet/1', data: null });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
    const schema = {"$ref":"#/definitions/Pet"};
    const out = validator.validateSchema(schema, res.data);
    expect(out.valid).toBeTruthy();
  });
  test('GET /pet/{petId} - negative invalid id', async () => {
    let threw = false;
    try {
      await client.request({ method: 'get', url: '/pet/99999999' });
    } catch (e) { threw = true; expect(e.response && [400,404,422].includes(e.response.status)).toBeTruthy(); }
    expect(threw).toBeTruthy();
  });
  test('DELETE /pet/{petId} - positive', async () => {
    const res = await client.request({ method: 'delete', url: '/pet/1', data: null });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
  });
  test('DELETE /pet/{petId} - negative invalid id', async () => {
    let threw = false;
    try {
      await client.request({ method: 'delete', url: '/pet/99999999' });
    } catch (e) { threw = true; expect(e.response && [400,404,422].includes(e.response.status)).toBeTruthy(); }
    expect(threw).toBeTruthy();
  });
  test('GET /store/inventory - positive', async () => {
    const res = await client.request({ method: 'get', url: '/store/inventory', data: null });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
    const schema = {"type":"object","additionalProperties":{"type":"integer","format":"int32"}};
    const out = validator.validateSchema(schema, res.data);
    expect(out.valid).toBeTruthy();
  });
  test('POST /store/order - positive', async () => {
    const res = await client.request({ method: 'post', url: '/store/order', data: {"id":1,"petId":1,"quantity":1,"shipDate":"string","status":"string","complete":true} });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
    const schema = {"$ref":"#/definitions/Order"};
    const out = validator.validateSchema(schema, res.data);
    expect(out.valid).toBeTruthy();
  });
  test('GET /store/order/{orderId} - positive', async () => {
    const res = await client.request({ method: 'get', url: '/store/order/1', data: null });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
    const schema = {"$ref":"#/definitions/Order"};
    const out = validator.validateSchema(schema, res.data);
    expect(out.valid).toBeTruthy();
  });
  test('GET /store/order/{orderId} - negative invalid id', async () => {
    let threw = false;
    try {
      await client.request({ method: 'get', url: '/store/order/99999999' });
    } catch (e) { threw = true; expect(e.response && [400,404,422].includes(e.response.status)).toBeTruthy(); }
    expect(threw).toBeTruthy();
  });
  test('DELETE /store/order/{orderId} - positive', async () => {
    const res = await client.request({ method: 'delete', url: '/store/order/1', data: null });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
  });
  test('DELETE /store/order/{orderId} - negative invalid id', async () => {
    let threw = false;
    try {
      await client.request({ method: 'delete', url: '/store/order/99999999' });
    } catch (e) { threw = true; expect(e.response && [400,404,422].includes(e.response.status)).toBeTruthy(); }
    expect(threw).toBeTruthy();
  });
  test('POST /user/createWithList - positive', async () => {
    const res = await client.request({ method: 'post', url: '/user/createWithList', data: [{"id":1,"username":"string","firstName":"string","lastName":"string","email":"string","password":"string","phone":"string","userStatus":1}] });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
  });
  test('GET /user/{username} - positive', async () => {
    const res = await client.request({ method: 'get', url: '/user/1', data: null });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
    const schema = {"$ref":"#/definitions/User"};
    const out = validator.validateSchema(schema, res.data);
    expect(out.valid).toBeTruthy();
  });
  test('GET /user/{username} - negative invalid id', async () => {
    let threw = false;
    try {
      await client.request({ method: 'get', url: '/user/99999999' });
    } catch (e) { threw = true; expect(e.response && [400,404,422].includes(e.response.status)).toBeTruthy(); }
    expect(threw).toBeTruthy();
  });
  test('PUT /user/{username} - positive', async () => {
    const res = await client.request({ method: 'put', url: '/user/1', data: {"id":1,"username":"string","firstName":"string","lastName":"string","email":"string","password":"string","phone":"string","userStatus":1} });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
  });
  test('PUT /user/{username} - negative invalid id', async () => {
    let threw = false;
    try {
      await client.request({ method: 'put', url: '/user/99999999' });
    } catch (e) { threw = true; expect(e.response && [400,404,422].includes(e.response.status)).toBeTruthy(); }
    expect(threw).toBeTruthy();
  });
  test('DELETE /user/{username} - positive', async () => {
    const res = await client.request({ method: 'delete', url: '/user/1', data: null });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
  });
  test('DELETE /user/{username} - negative invalid id', async () => {
    let threw = false;
    try {
      await client.request({ method: 'delete', url: '/user/99999999' });
    } catch (e) { threw = true; expect(e.response && [400,404,422].includes(e.response.status)).toBeTruthy(); }
    expect(threw).toBeTruthy();
  });
  test('GET /user/login - positive', async () => {
    const res = await client.request({ method: 'get', url: '/user/login?username=string&password=string', data: null });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
    const schema = {"type":"string"};
    const out = validator.validateSchema(schema, res.data);
    expect(out.valid).toBeTruthy();
  });
  test('GET /user/logout - positive', async () => {
    const res = await client.request({ method: 'get', url: '/user/logout', data: null });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
  });
  test('POST /user/createWithArray - positive', async () => {
    const res = await client.request({ method: 'post', url: '/user/createWithArray', data: [{"id":1,"username":"string","firstName":"string","lastName":"string","email":"string","password":"string","phone":"string","userStatus":1}] });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
  });
  test('POST /user - positive', async () => {
    const res = await client.request({ method: 'post', url: '/user', data: {"id":1,"username":"string","firstName":"string","lastName":"string","email":"string","password":"string","phone":"string","userStatus":1} });
    expect(res.status.toString().startsWith('2')).toBeTruthy();
    if (res.headers['content-type']) expect(res.headers['content-type'].includes('application/json')).toBeTruthy();
  });
});