import { Gym } from '../../domain/entities/Gym';
import { IGymRepository } from '../../domain/repositories/IGymRepository';
import { RequiredFieldError } from '../../domain/errors/DomainError';

export class GetGymsByUserIdUseCase {
  constructor(private gymRepository: IGymRepository) {}

  async execute(userId: string): Promise<Gym[]> {
    if (!userId) {
      throw new RequiredFieldError('User ID', 'get gyms by user');
    }
    return await this.gymRepository.findByUserId(userId);
  }
}