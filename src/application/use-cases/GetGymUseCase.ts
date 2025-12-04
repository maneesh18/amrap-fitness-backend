import { Gym } from '../../domain/entities/Gym';
import { IGymRepository } from '../../domain/repositories/IGymRepository';
import { EntityNotFoundError } from '../../domain/errors/DomainError';

export class GetGymUseCase {
  constructor(private gymRepository: IGymRepository) {}

  async execute(id: string): Promise<Gym> {
    const gym = await this.gymRepository.findById(id);
    if (!gym) {
      throw new EntityNotFoundError('Gym', id);
    }
    return gym;
  }
}

