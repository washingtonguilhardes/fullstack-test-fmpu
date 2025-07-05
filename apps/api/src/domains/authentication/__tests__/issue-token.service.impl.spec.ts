import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import * as jwt from 'jsonwebtoken';
import { IssueTokenServiceImpl } from '../application/issue-token.service.impl';
import { ApplicationException } from '@/shared/exceptions/application.exception';

// Mocks
const mockValidateUserByCredentialsService: any = {
  execute: jest.fn(),
};

const mockPayload = {
  getEmail: jest.fn(),
  getPassword: jest.fn(),
  validate: jest.fn(),
};

const mockUser = {
  getId: jest.fn(),
  getEmail: jest.fn(),
};

jest.mock('jsonwebtoken');

describe('IssueTokenServiceImpl', () => {
  const jwtSecret = 'test-secret';
  const jwtExpiresIn = '1h';
  let service: IssueTokenServiceImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new IssueTokenServiceImpl(
      jwtSecret,
      jwtExpiresIn,
      mockValidateUserByCredentialsService as any,
    );
  });

  it('should throw if jwtSecret is missing', () => {
    expect(
      () =>
        new IssueTokenServiceImpl(
          '',
          jwtExpiresIn,
          mockValidateUserByCredentialsService as any,
        ),
    ).toThrow(ApplicationException);
  });

  it('should issue a token for valid credentials', async () => {
    mockPayload.validate.mockImplementation(() => {});
    mockPayload.getEmail.mockReturnValue('email');
    mockPayload.getPassword.mockReturnValue('password');
    mockValidateUserByCredentialsService.execute.mockResolvedValue({
      getId: () => 'user-id',
      getEmail: () => ({ getValue: () => 'user@example.com' }),
    } as any);
    const mockToken = 'signed.jwt.token';
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const token = await service.execute(mockPayload as any);
    expect(token).toBe(mockToken);
    expect(mockPayload.validate).toHaveBeenCalled();
    expect(mockValidateUserByCredentialsService.execute).toHaveBeenCalledWith(
      'email',
      'password',
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({ sub: 'user-id', username: 'user@example.com' }),
      jwtSecret,
      expect.objectContaining({
        expiresIn: jwtExpiresIn,
        issuer: 'driveapp-api',
        audience: 'driveapp-users',
      }),
    );
  });

  it('should throw ApplicationException if jwt.sign throws JsonWebTokenError', async () => {
    mockPayload.validate.mockImplementation(() => {});
    mockPayload.getEmail.mockReturnValue('email');
    mockPayload.getPassword.mockReturnValue('password');
    mockValidateUserByCredentialsService.execute.mockResolvedValue({
      getId: () => 'user-id',
      getEmail: () => ({ getValue: () => 'user@example.com' }),
    } as any);
    (jwt.sign as jest.Mock).mockImplementation(() => {
      throw new jwt.JsonWebTokenError('jwt error');
    });

    await expect(service.execute(mockPayload as any)).rejects.toThrow(
      ApplicationException,
    );
  });

  it('should throw ApplicationException for other errors', async () => {
    mockPayload.validate.mockImplementation(() => {});
    mockPayload.getEmail.mockReturnValue('email');
    mockPayload.getPassword.mockReturnValue('password');
    mockValidateUserByCredentialsService.execute.mockRejectedValue(
      new Error('user validation failed') as any,
    );

    await expect(service.execute(mockPayload as any)).rejects.toThrow(
      ApplicationException,
    );
  });
});
