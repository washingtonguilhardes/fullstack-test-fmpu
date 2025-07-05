import { describe, it, expect, beforeEach } from '@jest/globals';
import { UpdateUserUseCaseImpl } from '../update-user.usecase';

const mockOwnershipValidationService: any = {
  execute: jest.fn(),
};
const mockUpdateUserService: any = {
  execute: jest.fn(),
};

describe('UpdateUserUseCaseImpl', () => {
  let usecase: UpdateUserUseCaseImpl;
  let mockTokenPayload: any;
  let mockData: any;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new UpdateUserUseCaseImpl(
      mockOwnershipValidationService,
      mockUpdateUserService,
    );
    mockTokenPayload = { getSubject: jest.fn().mockReturnValue('user-id') };
    mockData = {
      id: 'user-id',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };
  });

  it('should validate ownership and update user', async () => {
    mockOwnershipValidationService.execute.mockResolvedValue(undefined);
    mockUpdateUserService.execute.mockResolvedValue(undefined);
    await usecase.execute(mockTokenPayload, mockData);
    expect(mockOwnershipValidationService.execute).toHaveBeenCalledWith(
      expect.anything(),
      'user-id',
    );
    expect(mockUpdateUserService.execute).toHaveBeenCalledWith(
      'user-id',
      expect.anything(),
      'John',
      'Doe',
    );
  });

  it('should throw if ownership validation fails', async () => {
    mockOwnershipValidationService.execute.mockRejectedValue(
      new Error('not owner'),
    );
    await expect(usecase.execute(mockTokenPayload, mockData)).rejects.toThrow(
      'not owner',
    );
  });

  it('should throw if update user fails', async () => {
    mockOwnershipValidationService.execute.mockResolvedValue(undefined);
    mockUpdateUserService.execute.mockRejectedValue(new Error('update fail'));
    await expect(usecase.execute(mockTokenPayload, mockData)).rejects.toThrow(
      'update fail',
    );
  });
});
