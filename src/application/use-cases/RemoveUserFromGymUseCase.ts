import { IMembershipRepository } from '../../domain/repositories/IMembershipRepository';
import { EntityNotFoundError } from '../../domain/errors/DomainError';

export class RemoveUserFromGymUseCase {
  constructor(private membershipRepository: IMembershipRepository) {}

  async execute(userId: string, gymId: string): Promise<void> {
    const membership = await this.membershipRepository.findByUserAndGym(userId, gymId);
    if (!membership) {
      throw new EntityNotFoundError('Membership', `${userId}-${gymId}`);
    }
    await this.membershipRepository.delete(membership.id);
  }
}

