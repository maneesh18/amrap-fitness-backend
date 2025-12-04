import { CreateUserUseCase } from '../CreateUserUseCase';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User, FitnessGoal } from '../../../domain/entities/User';
import { DuplicateEntityError } from '../../../domain/errors/DomainError';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateUserUseCase(mockUserRepository);
  });

  it('should create a user successfully', async () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      dateOfBirth: '1990-01-01',
      fitnessGoal: FitnessGoal.STRENGTH,
    };

    const savedUser = User.create(
      dto.name,
      dto.email,
      new Date(dto.dateOfBirth),
      dto.fitnessGoal
    );
    savedUser.id = 'user-id';

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue(savedUser);

    const result = await useCase.execute(dto);

    expect(result).toEqual(savedUser);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('should throw error if user with email already exists', async () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      dateOfBirth: '1990-01-01',
      fitnessGoal: FitnessGoal.STRENGTH,
    };

    const existingUser = User.create(
      dto.name,
      dto.email,
      new Date(dto.dateOfBirth),
      dto.fitnessGoal
    );
    existingUser.id = 'existing-id';

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(dto)).rejects.toThrow(DuplicateEntityError);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});

