const request = require('supertest');
const app     = require('../index');

// -------------------------------------------------------------------
// GET /
// -------------------------------------------------------------------
describe('GET /', () => {
  it('should return welcome message with status 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Welcome to my Node.js API!');
    expect(res.body).toHaveProperty('status', 'running');
    expect(res.body).toHaveProperty('timestamp');
  });
});

// -------------------------------------------------------------------
// GET /health
// -------------------------------------------------------------------
describe('GET /health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

// -------------------------------------------------------------------
// GET /users
// -------------------------------------------------------------------
describe('GET /users', () => {
  it('should return an array of users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('each user should have id, name and email', async () => {
    const res = await request(app).get('/users');
    res.body.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
    });
  });
});

// -------------------------------------------------------------------
// POST /users
// -------------------------------------------------------------------
describe('POST /users', () => {
  it('should create a user and return 201', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Charlie', email: 'charlie@example.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Charlie');
    expect(res.body.email).toBe('charlie@example.com');
  });

  it('should return 400 when name is missing', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'noname@example.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'NoEmail' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

// -------------------------------------------------------------------
// 404
// -------------------------------------------------------------------
describe('Unknown route', () => {
  it('should return 404 for undefined routes', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Route not found');
  });
});