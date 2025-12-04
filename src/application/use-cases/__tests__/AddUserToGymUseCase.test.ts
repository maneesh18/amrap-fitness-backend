import { AddUserToGymUseCase } from '../AddUserToGymUseCase';
import { IMembershipRepository } from '../../../domain/repositories/IMembershipRepository';
import { IGymRepository } from '../../../domain/repositories/IGymRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User, FitnessGoal } from '../../../domain/entities/User';
import { Gym, GymType } from '../../../domain/entities/Gym';
import { Membership } from '../../../domain/entities/Membership';
import {
  EntityNotFoundError,
  GymCapacityExceededError,
  MembershipAlreadyExistsError,
} from '../../../domain/errors/DomainError';

describe('AddUserToGymUseCase', () => {
  let useCase: AddUserToGymUseCase;
  let mockMembershipRepository: jest.Mocked<IMembershipRepository>;
  let mockGymRepository: jest.Mocked<IGymRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockMembershipRepository = {
      findByUserAndGym: jest.fn(),
      findByUserId: jest.fn(),
      findByGymId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      countByGymId: jest.fn(),
    };

    mockGymRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getMemberCount: jest.fn(),
      findWithAvailableSpots: jest.fn(),
    };

    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new AddUserToGymUseCase(
      mockMembershipRepository,
      mockGymRepository,
      mockUserRepository
    );
  });

  it('should add user to gym successfully', async () => {
    const userId = 'user-id';
    const gymId = 'gym-id';

    const user = User.create('John', 'john@example.com', new Date('1990-01-01'), FitnessGoal.STRENGTH);
    user.id = userId;

    const gym = Gym.create('Test Gym', GymType.COMMERCIAL, 'Location', 10);
    gym.id = gymId;

    const membership = Membership.create(userId, gymId);
    membership.id = 'membership-id';

    mockUserRepository.findById.mockResolvedValue(user);
    mockGymRepository.findById.mockResolvedValue(gym);
    mockMembershipRepository.findByUserAndGym.mockResolvedValue(null);
    mockMembershipRepository.countByGymId.mockResolvedValue(5);
    mockMembershipRepository.save.mockResolvedValue(membership);

    const result = await useCase.execute({ userId, gymId });

    expect(result).toEqual(membership);
    expect(mockMembershipRepository.save).toHaveBeenCalled();
  });

  it('should throw error if user not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ userId: 'user-id', gymId: 'gym-id' })).rejects.toThrow(
      EntityNotFoundError
    );
  });

  it('should throw error if gym not found', async () => {
    const user = User.create('John', 'john@example.com', new Date('1990-01-01'), FitnessGoal.STRENGTH);
    user.id = 'user-id';

    mockUserRepository.findById.mockResolvedValue(user);
    mockGymRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ userId: 'user-id', gymId: 'gym-id' })).rejects.toThrow(
      EntityNotFoundError
    );
  });

  it('should throw error if gym capacity exceeded', async () => {
    const userId = 'user-id';
    const gymId = 'gym-id';

    const user = User.create('John', 'john@example.com', new Date('1990-01-01'), FitnessGoal.STRENGTH);
    user.id = userId;

    const gym = Gym.create('Test Gym', GymType.COMMERCIAL, 'Location', 10);
    gym.id = gymId;

    mockUserRepository.findById.mockResolvedValue(user);
    mockGymRepository.findById.mockResolvedValue(gym);
    mockMembershipRepository.findByUserAndGym.mockResolvedValue(null);
    mockMembershipRepository.countByGymId.mockResolvedValue(10); // At capacity

    await expect(useCase.execute({ userId, gymId })).rejects.toThrow(GymCapacityExceededError);
  });

  it('should throw error if membership already exists', async () => {
    const userId = 'user-id';
    const gymId = 'gym-id';

    const user = User.create('John', 'john@example.com', new Date('1990-01-01'), FitnessGoal.STRENGTH);
    user.id = userId;

    const gym = Gym.create('Test Gym', GymType.COMMERCIAL, 'Location', 10);
    gym.id = gymId;

    const existingMembership = Membership.create(userId, gymId);
    existingMembership.id = 'existing-id';

    mockUserRepository.findById.mockResolvedValue(user);
    mockGymRepository.findById.mockResolvedValue(gym);
    mockMembershipRepository.findByUserAndGym.mockResolvedValue(existingMembership);

    await expect(useCase.execute({ userId, gymId })).rejects.toThrow(MembershipAlreadyExistsError);
  });
});

