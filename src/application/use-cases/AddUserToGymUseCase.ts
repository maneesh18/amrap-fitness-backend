import { Membership } from '../../domain/entities/Membership';
import { IMembershipRepository } from '../../domain/repositories/IMembershipRepository';
import { IGymRepository } from '../../domain/repositories/IGymRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateMembershipDTO } from '../dtos/CreateMembershipDTO';
import {
  EntityNotFoundError,
  GymCapacityExceededError,
  MembershipAlreadyExistsError,
} from '../../domain/errors/DomainError';

export class AddUserToGymUseCase {
  constructor(
    private membershipRepository: IMembershipRepository,
    private gymRepository: IGymRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(dto: CreateMembershipDTO): Promise<Membership> {
    // Verify user exists
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new EntityNotFoundError('User', dto.userId);
    }

    // Verify gym exists
    const gym = await this.gymRepository.findById(dto.gymId);
    if (!gym) {
      throw new EntityNotFoundError('Gym', dto.gymId);
    }

    // Check if membership already exists
    const existingMembership = await this.membershipRepository.findByUserAndGym(
      dto.userId,
      dto.gymId
    );
    if (existingMembership) {
      throw new MembershipAlreadyExistsError(dto.userId, dto.gymId);
    }

    // Check capacity
    const currentMemberCount = await this.membershipRepository.countByGymId(dto.gymId);
    if (!gym.hasCapacity(currentMemberCount)) {
      throw new GymCapacityExceededError(gym.name, gym.capacity!);
    }

    const membership = Membership.create(dto.userId, dto.gymId);
    return await this.membershipRepository.save(membership);
  }
}

