import { IGymRepository } from '../../domain/repositories/IGymRepository';
import { EntityNotFoundError } from '../../domain/errors/DomainError';

export class DeleteGymUseCase {
  constructor(private gymRepository: IGymRepository) {}

  async execute(id: string): Promise<void> {
    const gym = await this.gymRepository.findById(id);
    if (!gym) {
      throw new EntityNotFoundError('Gym', id);
    }
    await this.gymRepository.delete(id);
  }
}

