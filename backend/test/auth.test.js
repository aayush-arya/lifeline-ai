const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../server');

test('login with the seeded demo account succeeds and returns a token', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'demo@lifeline.ai', password: 'demo1234' });
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.user.email, 'demo@lifeline.ai');
  assert.ok(res.body.token, 'expected a JWT in the response');
});

test('login with the wrong password is rejected', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'demo@lifeline.ai', password: 'wrong-password' });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test('login with an unknown email is rejected', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'nobody@example.com', password: 'demo1234' });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test('register creates a new account with a hashed password and returns a token', async () => {
  const email = `test-${Date.now()}@example.com`;
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email, password: 'a-secure-password', userType: 'patient' });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.user.email, email);
  assert.ok(res.body.token);

  // and can immediately log back in with the same credentials
  const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'a-secure-password' });
  assert.equal(loginRes.status, 200);
  assert.equal(loginRes.body.success, true);
});

test('guest login issues a usable token', async () => {
  const res = await request(app).post('/api/auth/guest');
  assert.equal(res.status, 200);
  assert.equal(res.body.user.userType, 'guest');
  assert.ok(res.body.token);
});
