import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from '../login.controller';
import {
  IssueTokenService,
  IssueTokenServiceRef,
} from '@/domains/authentication/interfaces';
import {
  SetTokenCookieService,
  SetTokenCookieServiceRef,
} from '@/domains/authentication/application/token-cookie.service.impl';
import { AuthenticationPayloadDto } from '@driveapp/contracts/entities/authentication/authentication.entity';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

const mockIssueTokenService = { execute: jest.fn() };
const mockSetTokenCookieService = { execute: jest.fn() };

describe('LoginController', () => {
  let controller: LoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        { provide: IssueTokenServiceRef, useValue: mockIssueTokenService },
        {
          provide: SetTokenCookieServiceRef,
          useValue: mockSetTokenCookieService,
        },
      ],
    }).compile();
    controller = module.get<LoginController>(LoginController);
    jest.clearAllMocks();
  });

  it('should login and set token cookie', async () => {
    const dto: AuthenticationPayloadDto = {
      email: 'test@example.com',
      password: 'Password123',
    };
    const res: any = { cookie: jest.fn() };
    mockIssueTokenService.execute.mockResolvedValue('token123');
    mockSetTokenCookieService.execute.mockImplementation((r, t) =>
      r.cookie('token', t),
    );
    const result = await controller.login(dto, res);
    expect(mockIssueTokenService.execute).toHaveBeenCalled();
    expect(mockSetTokenCookieService.execute).toHaveBeenCalledWith(
      res,
      'token123',
    );
    expect(result).toEqual({ token: 'token123' });
    expect(res.cookie).toHaveBeenCalledWith('token', 'token123');
  });

  it('should throw if token service fails', async () => {
    const dto: AuthenticationPayloadDto = {
      email: 'fail@example.com',
      password: 'FailPass123',
    };
    const res: any = { cookie: jest.fn() };
    mockIssueTokenService.execute.mockRejectedValue(new Error('fail'));
    await expect(controller.login(dto, res)).rejects.toThrow('fail');
  });
});
