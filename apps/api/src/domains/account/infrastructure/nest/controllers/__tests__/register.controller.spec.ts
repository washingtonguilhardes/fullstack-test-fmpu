import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from '../register.controller';
import {
  ISignupNewAccountUsecase,
  SignupNewAccountUsecaseRef,
} from '@/domains/account/interfaces/signup-new-account.inteface';
import {
  SetTokenCookieService,
  SetTokenCookieServiceRef,
} from '@/domains/authentication/application/token-cookie.service.impl';
import { CreateAccountDto } from '@driveapp/contracts/entities/users/user.entity';

const mockSignupNewAccountUsecase = { execute: jest.fn() };
const mockSetTokenCookieService = { execute: jest.fn() };

describe('RegisterController', () => {
  let controller: RegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        {
          provide: SignupNewAccountUsecaseRef,
          useValue: mockSignupNewAccountUsecase,
        },
        {
          provide: SetTokenCookieServiceRef,
          useValue: mockSetTokenCookieService,
        },
      ],
    }).compile();
    controller = module.get<RegisterController>(RegisterController);
    jest.clearAllMocks();
  });

  it('should register user and set token cookie', async () => {
    const dto: CreateAccountDto = {
      email: 'test@example.com',
      password: 'Password123',
      firstName: 'John',
      lastName: 'Doe',
    };
    const res: any = { cookie: jest.fn() };
    const mockUser = {
      getId: () => 'user123',
      getEmail: () => ({ getValue: () => 'test@example.com' }),
      getFirstName: () => 'John',
      getLastName: () => 'Doe',
    };
    mockSignupNewAccountUsecase.execute.mockResolvedValue([
      mockUser,
      'token123',
    ]);
    mockSetTokenCookieService.execute.mockImplementation((r, t) =>
      r.cookie('token', t),
    );

    const result = await controller.register(dto, res);

    expect(mockSignupNewAccountUsecase.execute).toHaveBeenCalled();
    expect(mockSetTokenCookieService.execute).toHaveBeenCalledWith(
      res,
      'token123',
    );
    expect(result).toEqual({
      user: {
        id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      token: 'token123',
    });
    expect(res.cookie).toHaveBeenCalledWith('token', 'token123');
  });

  it('should throw if registration fails', async () => {
    const dto: CreateAccountDto = {
      email: 'fail@example.com',
      password: 'FailPass123',
      firstName: 'Fail',
      lastName: 'User',
    };
    const res: any = { cookie: jest.fn() };
    mockSignupNewAccountUsecase.execute.mockRejectedValue(new Error('fail'));

    await expect(controller.register(dto, res)).rejects.toThrow('fail');
  });
});
