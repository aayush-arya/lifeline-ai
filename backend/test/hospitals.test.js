const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../server');

test('GET /api/hospitals returns the seeded hospital list', async () => {
  const res = await request(app).get('/api/hospitals');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.hospitals.length >= 3);
  assert.ok(res.body.hospitals[0].name);
});

test('GET /api/hospitals/nearby without a Google Maps key falls back to mock data sorted by distance', async () => {
  const res = await request(app).get('/api/hospitals/nearby').query({ lat: 40.7128, lng: -74.006 });
  assert.equal(res.status, 200);
  assert.equal(res.body.source, 'mock');
  const distances = res.body.hospitals.map((h) => h.distanceKm);
  const sorted = [...distances].sort((a, b) => a - b);
  assert.deepEqual(distances, sorted);
});

test('GET /api/hospitals/nearby without coordinates still returns hospitals (distance null)', async () => {
  const res = await request(app).get('/api/hospitals/nearby');
  assert.equal(res.status, 200);
  assert.equal(res.body.hospitals[0].distanceKm, null);
});
