import { User } from '../../src/model';
import { app } from '../testSetup';

const request = require('supertest');

describe('Auth User create', () => {
  it('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securePassword',
    };

    const res = await request(app).post('/api/auth/create').send(userData).set('Content-Type', 'application/json');
    expect(res.statusCode).toEqual(201);
    await User.deleteOne({ email: userData.email });
  }, 10000);

  it('user already exits', async () => {
    const existingUser = {
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'existingPassword',
    };
    await User.create(existingUser);

    const res = await request(app).post('/api/auth/create').send(existingUser).set('Content-Type', 'application/json');

    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual({ error: 'Email is already registered.' });
    await User.deleteOne({ email: existingUser.email });
  }, 10000);
  it('email not found', async () => {
    const userData = {
      name: 'John Doe',
      password: 'securePassword',
    };

    const res = await request(app).post('/api/auth/create').send(userData).set('Content-Type', 'application/json');

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Email is Required' });
  }, 10000);
  it('name not found', async () => {
    const userData = {
      email: 'existing@example.com',
      password: 'securePassword',
    };

    const res = await request(app).post('/api/auth/create').send(userData).set('Content-Type', 'application/json');

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Name is Required' });
  }, 10000);
  it('password not found', async () => {
    const userData = {
      name: 'John Doe',
      email: 'existing@example.com',
    };

    const res = await request(app).post('/api/auth/create').send(userData).set('Content-Type', 'application/json');

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'Password is Required' });
  }, 10000);
});

describe('Auth User Login', () => {
  it('should login a user successfully', async () => {
    const userForLogin = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testPassword',
    };
    await request(app).post('/api/auth/create').send(userForLogin).set('Content-Type', 'application/json');

    const loginCredentials = {
      email: 'testuser@example.com',
      password: 'testPassword',
    };

    const res = await request(app).post('/api/auth/login').send(loginCredentials).set('Content-Type', 'application/json');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.name).toEqual('Test User');

    await User.deleteOne({ email: userForLogin.email });
  }, 10000);

  it('should handle invalid email or password during login', async () => {
    const invalidCredentials = {
      email: 'nonexistent@example.com',
      password: 'invalidPassword',
    };

    const res = await request(app).post('/api/auth/login').send(invalidCredentials).set('Content-Type', 'application/json');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ error: 'Invalid email or password.' });
  }, 10000);
});
