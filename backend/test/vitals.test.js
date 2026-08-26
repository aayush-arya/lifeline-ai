const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../server');

async function loginDemo() {
  const res = await request(app).post('/api/auth/login').send({ email: 'demo@lifeline.ai', password: 'demo1234' });
  return { token: res.body.token, userId: res.body.user.id };
}

test('creating a vital without a token is rejected', async () => {
  const res = await request(app).post('/api/vitals').send({ heartRate: 80 });
  assert.equal(res.status, 401);
});

test('an authenticated user can record and then read their own vitals', async () => {
  const { token, userId } = await loginDemo();

  const createRes = await request(app)
    .post('/api/vitals')
    .set('Authorization', `Bearer ${token}`)
    .send({ heartRate: 81, bloodPressure: '119/78', temperature: 98.2, oxygenLevel: 97 });

  assert.equal(createRes.status, 200);
  assert.equal(createRes.body.vital.userId, userId);

  const listRes = await request(app).get(`/api/vitals/${userId}`).set('Authorization', `Bearer ${token}`);
  assert.equal(listRes.status, 200);
  assert.ok(listRes.body.vitals.some((v) => v.heartRate === 81));
});

test('a user cannot read another user\'s vitals with their own token', async () => {
  const { token } = await loginDemo();
  const res = await request(app).get('/api/vitals/someone-elses-id').set('Authorization', `Bearer ${token}`);
  assert.equal(res.status, 403);
});

test('an invalid token is rejected', async () => {
  const res = await request(app).get('/api/vitals/user-demo').set('Authorization', 'Bearer not-a-real-token');
  assert.equal(res.status, 401);
});
