import { describe, it, expect, beforeEach } from '@jest/globals';
import { SignupNewUserUsecase } from '../signup-new-user.usecase';
import { AuthenticationPayloadImpl } from '@/domains/authentication/domain/auth.domain.impl';

const mockCreateUserService: any = {
  execute: jest.fn(),
};
const mockIssueTokenService: any = {
  execute: jest.fn(),
};

describe('SignupNewUserUsecase', () => {
  let usecase: SignupNewUserUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock AuthenticationPayloadImpl to avoid domain validation
    jest
      .spyOn(AuthenticationPayloadImpl.prototype, 'validate')
      .mockImplementation(() => undefined);
    usecase = new SignupNewUserUsecase(
      mockCreateUserService,
      mockIssueTokenService,
    );
  });

  it('should create a user and issue a token', async () => {
    const email = { value: 'test@example.com' } as any;
    const password = { value: 'password' } as any;
    const firstName = 'John';
    const lastName = 'Doe';
    const user = { id: '1', email, firstName, lastName };
    const token = 'jwt-token';
    mockCreateUserService.execute.mockResolvedValue(user);
    mockIssueTokenService.execute.mockResolvedValue(token);

    const result = await usecase.execute(email, password, firstName, lastName);
    expect(mockCreateUserService.execute).toHaveBeenCalledWith(
      email,
      password,
      firstName,
      lastName,
    );
    expect(mockIssueTokenService.execute).toHaveBeenCalledWith(
      expect.any(AuthenticationPayloadImpl),
    );
    expect(result).toEqual([user, token]);
  });

  it('should throw if user creation fails', async () => {
    const email = { value: 'test@example.com' } as any;
    const password = { value: 'password' } as any;
    mockCreateUserService.execute.mockRejectedValue(new Error('fail'));
    await expect(usecase.execute(email, password, 'a', 'b')).rejects.toThrow(
      'fail',
    );
  });

  it('should throw if token issuance fails', async () => {
    const email = { value: 'test@example.com' } as any;
    const password = { value: 'password' } as any;
    const user = { id: '1', email };
    mockCreateUserService.execute.mockResolvedValue(user);
    mockIssueTokenService.execute.mockRejectedValue(new Error('token fail'));
    await expect(usecase.execute(email, password, 'a', 'b')).rejects.toThrow(
      'token fail',
    );
  });
});
