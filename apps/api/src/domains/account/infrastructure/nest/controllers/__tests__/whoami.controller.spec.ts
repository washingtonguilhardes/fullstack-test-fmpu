import { describe, it, expect, beforeEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { WhoAmIController } from '../whoami.controller';
import {
  ValidateTokenService,
  ValidateTokenServiceRef,
  DecodeTokenService,
  DecodeTokenServiceRef,
} from '@/domains/authentication/interfaces';
import {
  GetUserByEmailService,
  GetUserByEmailServiceRef,
} from '@/domains/users/interfaces';

const mockValidateTokenService = { execute: jest.fn() };
const mockDecodeTokenService = { execute: jest.fn() };
const mockGetUserByEmailService = { execute: jest.fn() };

describe('WhoAmIController', () => {
  let controller: WhoAmIController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhoAmIController],
      providers: [
        {
          provide: ValidateTokenServiceRef,
          useValue: mockValidateTokenService,
        },
        { provide: DecodeTokenServiceRef, useValue: mockDecodeTokenService },
        {
          provide: GetUserByEmailServiceRef,
          useValue: mockGetUserByEmailService,
        },
      ],
    }).compile();
    controller = module.get<WhoAmIController>(WhoAmIController);
    jest.clearAllMocks();
  });

  it('should return user information', async () => {
    const accessToken = 'token123';
    const mockPayload = { getUsername: () => 'test@example.com' };
    const mockUser = {
      getId: () => 'user123',
      getEmail: () => ({ getValue: () => 'test@example.com' }),
      getFirstName: () => 'John',
      getLastName: () => 'Doe',
    };

    mockValidateTokenService.execute.mockResolvedValue(undefined);
    mockDecodeTokenService.execute.mockResolvedValue(mockPayload);
    mockGetUserByEmailService.execute.mockResolvedValue(mockUser);

    const result = await controller.whoami(accessToken);

    expect(mockValidateTokenService.execute).toHaveBeenCalledWith(accessToken);
    expect(mockDecodeTokenService.execute).toHaveBeenCalledWith(accessToken);
    expect(mockGetUserByEmailService.execute).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should throw if token validation fails', async () => {
    const accessToken = 'invalid-token';

    mockValidateTokenService.execute.mockRejectedValue(
      new Error('invalid token'),
    );

    await expect(controller.whoami(accessToken)).rejects.toThrow(
      'invalid token',
    );
  });

  it('should throw if token decoding fails', async () => {
    const accessToken = 'token123';

    mockValidateTokenService.execute.mockResolvedValue(undefined);
    mockDecodeTokenService.execute.mockRejectedValue(
      new Error('decode failed'),
    );

    await expect(controller.whoami(accessToken)).rejects.toThrow(
      'decode failed',
    );
  });

  it('should throw if user retrieval fails', async () => {
    const accessToken = 'token123';
    const mockPayload = { getUsername: () => 'test@example.com' };

    mockValidateTokenService.execute.mockResolvedValue(undefined);
    mockDecodeTokenService.execute.mockResolvedValue(mockPayload);
    mockGetUserByEmailService.execute.mockRejectedValue(
      new Error('user not found'),
    );

    await expect(controller.whoami(accessToken)).rejects.toThrow(
      'user not found',
    );
  });
});
