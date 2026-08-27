const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;
let app;

before(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  // Force a fresh require so server.js picks up the MONGODB_URI we just set
  // - other test files run in separate processes (Node's default test
  // isolation), so this doesn't affect them.
  delete require.cache[require.resolve('../server')];
  app = require('../server');
  await app.ready;
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test('server actually connects to MongoDB, not the in-memory fallback', () => {
  assert.equal(mongoose.connection.readyState, 1);
});

test('demo account is seeded into MongoDB and can log in', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'demo@lifeline.ai', password: 'demo1234' });
  assert.equal(res.status, 200);
  assert.equal(res.body.user.id, 'user-demo');
});

test('hospitals are seeded and queryable', async () => {
  const res = await request(app).get('/api/hospitals');
  assert.equal(res.status, 200);
  assert.ok(res.body.hospitals.length >= 3);
});

test('data written through the API is actually persisted in MongoDB, not just echoed back', async () => {
  const login = await request(app).post('/api/auth/login').send({ email: 'demo@lifeline.ai', password: 'demo1234' });
  const token = login.body.token;

  const createRes = await request(app)
    .post('/api/vitals')
    .set('Authorization', `Bearer ${token}`)
    .send({ heartRate: 88, bloodPressure: '122/80', temperature: 98.7, oxygenLevel: 96 });
  assert.equal(createRes.status, 200);

  // Read it back with a query that bypasses the API entirely, to prove this
  // round-tripped through real MongoDB rather than an in-memory array.
  const Vital = require('../src/models/Vital');
  const stored = await Vital.findById(createRes.body.vital._id).lean();
  assert.ok(stored, 'expected the vital to exist in MongoDB');
  assert.equal(stored.heartRate, 88);
});

test('per-user authorization still holds against MongoDB-backed data', async () => {
  const login = await request(app).post('/api/auth/login').send({ email: 'demo@lifeline.ai', password: 'demo1234' });
  const res = await request(app)
    .get('/api/vitals/someone-elses-id')
    .set('Authorization', `Bearer ${login.body.token}`);
  assert.equal(res.status, 403);
});
