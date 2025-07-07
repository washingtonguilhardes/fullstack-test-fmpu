import { Model } from 'mongoose';
import request from 'supertest';

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { EmailImpl } from '../src/domains/users/domain/email';
import { HashedPasswordImpl } from '../src/domains/users/domain/hashed-password';
import { UserImpl } from '../src/domains/users/domain/user';
import { UserModelName } from '../src/domains/users/infrastructure/mongoose/user.schema';

describe('Authentication E2E Tests', () => {
  let app: INestApplication;
  let userModel: Model<any>;

  beforeEach(async () => {
    // Create a mock user for successful authentication
    const mockUser = new UserImpl(
      new EmailImpl('test@example.com'),
      new HashedPasswordImpl('$2b$10$hashedpassword'),
      'John',
      'Doe',
      new Date(),
      null,
    );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken(UserModelName))
      .useValue({
        findOne: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue({
            _id: 'user123',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            passwordHash: '$2b$10$hashedpassword',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as never),
        }),
        findById: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue({
            _id: 'user123',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            passwordHash: '$2b$10$hashedpassword',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as never),
        }),
        create: jest.fn().mockResolvedValue({
          _id: 'user123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          passwordHash: '$2b$10$hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as never),
        findByIdAndUpdate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue({
            _id: 'user123',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            passwordHash: '$2b$10$hashedpassword',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as never),
        }),
        findOneAndUpdate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue({
            _id: 'user123',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            passwordHash: '$2b$10$hashedpassword',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as never),
        }),
      } as never)
      .overrideProvider('ValidateUserByCredentialsServiceRef')
      .useValue({
        execute: jest.fn().mockResolvedValue(mockUser as never),
      } as never)
      .overrideProvider('IssueTokenServiceRef')
      .useValue({
        execute: jest.fn().mockResolvedValue('mock-jwt-token' as never),
      } as never)
      .overrideProvider('SetTokenCookieServiceRef')
      .useValue({
        execute: jest.fn(),
      } as never)
      .compile();

    app = moduleFixture.createNestApplication();
    userModel = moduleFixture.get<Model<any>>(getModelToken(UserModelName));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('POST /account/login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'Password123',
    };

    it('should successfully login and return token', async () => {
      const response = await request(app.getHttpServer())
        .post('/account/login')
        .send(validLoginData)
        .expect(201);

      expect(response.body).toEqual({ token: 'mock-jwt-token' });
    });

    it('should return 400 for invalid email format', async () => {
      const invalidEmailData = {
        email: 'invalid-email',
        password: 'Password123',
      };

      await request(app.getHttpServer())
        .post('/account/login')
        .send(invalidEmailData)
        .expect(400);
    });

    it('should return 400 for weak password', async () => {
      const weakPasswordData = {
        email: 'test@example.com',
        password: '123',
      };

      await request(app.getHttpServer())
        .post('/account/login')
        .send(weakPasswordData)
        .expect(400);
    });

    it('should return 400 for missing email', async () => {
      const missingEmailData = {
        password: 'Password123',
      };

      await request(app.getHttpServer())
        .post('/account/login')
        .send(missingEmailData)
        .expect(400);
    });

    it('should return 400 for missing password', async () => {
      const missingPasswordData = {
        email: 'test@example.com',
      };

      await request(app.getHttpServer())
        .post('/account/login')
        .send(missingPasswordData)
        .expect(400);
    });

    it('should handle empty request body', async () => {
      await request(app.getHttpServer())
        .post('/account/login')
        .send({})
        .expect(400);
    });

    it('should handle malformed JSON', async () => {
      await request(app.getHttpServer())
        .post('/account/login')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });

    it('should handle special characters in email', async () => {
      const specialEmailData = {
        email: 'test+tag@example.com',
        password: 'Password123',
      };

      await request(app.getHttpServer())
        .post('/account/login')
        .send(specialEmailData)
        .expect(201);
    });

    it('should handle long email addresses', async () => {
      const longEmailData = {
        email: 'very.long.email.address.that.might.be.valid@example.com',
        password: 'Password123',
      };

      await request(app.getHttpServer())
        .post('/account/login')
        .send(longEmailData)
        .expect(201);
    });

    it('should handle complex passwords', async () => {
      const complexPasswordData = {
        email: 'test@example.com',
        password: 'ComplexP@ssw0rd!123',
      };

      await request(app.getHttpServer())
        .post('/account/login')
        .send(complexPasswordData)
        .expect(201);
    });
  });

  describe('Authentication Flow Integration', () => {
    it('should maintain session consistency', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      // First login
      const response1 = await request(app.getHttpServer())
        .post('/account/login')
        .send(loginData)
        .expect(201);

      expect(response1.body.token).toBe('mock-jwt-token');

      // Second login with same credentials
      const response2 = await request(app.getHttpServer())
        .post('/account/login')
        .send(loginData)
        .expect(201);

      expect(response2.body.token).toBe('mock-jwt-token');
    });

    it('should handle concurrent login requests', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      // Make concurrent requests
      const promises = Array(3)
        .fill(null)
        .map(() =>
          request(app.getHttpServer()).post('/account/login').send(loginData),
        );

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body.token).toBe('mock-jwt-token');
      });
    });
  });
});
