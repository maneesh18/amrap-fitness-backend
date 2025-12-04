import { Gym } from '../../domain/entities/Gym';
import { IMembershipRepository } from '../../domain/repositories/IMembershipRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { EntityNotFoundError } from '../../domain/errors/DomainError';

export class ListUserGymsUseCase {
  constructor(
    private membershipRepository: IMembershipRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<Gym[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundError('User', userId);
    }

    const memberships = await this.membershipRepository.findByUserId(userId);
    return memberships.map((m) => m.gym);
  }
}

