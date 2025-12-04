import { User } from '../../domain/entities/User';
import { IMembershipRepository } from '../../domain/repositories/IMembershipRepository';
import { IGymRepository } from '../../domain/repositories/IGymRepository';
import { EntityNotFoundError } from '../../domain/errors/DomainError';

export class ListGymUsersUseCase {
  constructor(
    private membershipRepository: IMembershipRepository,
    private gymRepository: IGymRepository
  ) {}

  async execute(gymId: string): Promise<User[]> {
    const gym = await this.gymRepository.findById(gymId);
    if (!gym) {
      throw new EntityNotFoundError('Gym', gymId);
    }

    const memberships = await this.membershipRepository.findByGymId(gymId);
    return memberships.map((m) => m.user);
  }
}

