import { jest, describe, it, expect } from '@jest/globals';
import { TokenImpl } from '../domain/token.domain.impl';

describe('TokenImpl', () => {
  describe('constructor', () => {
    it('should create token with valid string', () => {
      const tokenString = 'test.jwt.token';
      const token = new TokenImpl(tokenString);

      expect(token.getValue()).toBe(tokenString);
    });

    it('should create token with empty string', () => {
      const tokenString = '';
      const token = new TokenImpl(tokenString);

      expect(token.getValue()).toBe(tokenString);
    });
  });

  describe('getValue', () => {
    it('should return the token string', () => {
      const tokenString = 'test.jwt.token';
      const token = new TokenImpl(tokenString);

      expect(token.getValue()).toBe(tokenString);
    });
  });

  describe('toJSON', () => {
    it('should return the token string', () => {
      const tokenString = 'test.jwt.token';
      const token = new TokenImpl(tokenString);

      expect(token.toJSON()).toBe(tokenString);
    });

    it('should return empty string for empty token', () => {
      const tokenString = '';
      const token = new TokenImpl(tokenString);

      expect(token.toJSON()).toBe(tokenString);
    });
  });
});
