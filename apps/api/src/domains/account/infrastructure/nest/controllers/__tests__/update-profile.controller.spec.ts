import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProfileController } from '../update-profile.controller';
import {
  UpdateUserUseCase,
  UpdateUserUseCaseRef,
} from '@/domains/account/application/usecases/update-user.usecase';
import {
  DecodeTokenService,
  DecodeTokenServiceRef,
  TokenPayload,
} from '@/domains/authentication/interfaces';
import { UpdateUserDto } from '@driveapp/contracts/entities/users/user.entity';

const mockUpdateUserUseCase: jest.Mocked<UpdateUserUseCase> = {
  execute: jest.fn(),
};
const mockDecodeTokenService: jest.Mocked<DecodeTokenService> = {
  execute: jest.fn(),
};

describe('UpdateProfileController', () => {
  let controller: UpdateProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateProfileController],
      providers: [
        { provide: UpdateUserUseCaseRef, useValue: mockUpdateUserUseCase },
        { provide: DecodeTokenServiceRef, useValue: mockDecodeTokenService },
      ],
    }).compile();
    controller = module.get<UpdateProfileController>(UpdateProfileController);
    jest.clearAllMocks();
  });

  it('should update profile successfully', async () => {
    const id = 'user123';
    const body: UpdateUserDto = {
      email: 'new@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
    };
    const accessToken = 'token123';
    const mockPayload: jest.Mocked<TokenPayload> = {
      getSubject: jest.fn().mockReturnValue('user123') as jest.MockedFunction<
        () => string
      >,
      getUsername: jest.fn().mockReturnValue('user123') as jest.MockedFunction<
        () => string
      >,
      getIssuedAt: jest.fn().mockReturnValue(Date.now()) as jest.MockedFunction<
        () => number
      >,
      getType: jest.fn().mockReturnValue('access') as jest.MockedFunction<
        () => string
      >,
      toJSON: jest.fn().mockReturnValue({
        sub: 'user123',
      }) as jest.MockedFunction<() => object>,
    };

    mockDecodeTokenService.execute.mockResolvedValue(mockPayload);
    mockUpdateUserUseCase.execute.mockResolvedValue(undefined);

    const result = await controller.updateProfile(id, body, accessToken);

    expect(mockDecodeTokenService.execute).toHaveBeenCalledWith(accessToken);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith(mockPayload, {
      id,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
    });
    expect(result).toEqual({ message: 'Profile updated successfully' });
  });

  it('should throw if token decoding fails', async () => {
    const id = 'user123';
    const body: UpdateUserDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };
    const accessToken = 'invalid-token';

    mockDecodeTokenService.execute.mockRejectedValue(
      new Error('invalid token'),
    );

    await expect(
      controller.updateProfile(id, body, accessToken),
    ).rejects.toThrow('invalid token');
  });

  it('should throw if profile update fails', async () => {
    const id = 'user123';
    const body: UpdateUserDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };
    const accessToken = 'token123';
    const mockPayload = { getSubject: () => 'user123' };

    mockDecodeTokenService.execute.mockResolvedValue(mockPayload);
    mockUpdateUserUseCase.execute.mockRejectedValue(new Error('update failed'));

    await expect(
      controller.updateProfile(id, body, accessToken),
    ).rejects.toThrow('update failed');
  });
});
