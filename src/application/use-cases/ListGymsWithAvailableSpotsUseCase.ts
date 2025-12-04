import { Gym } from '../../domain/entities/Gym';
import { IGymRepository } from '../../domain/repositories/IGymRepository';

export class ListGymsWithAvailableSpotsUseCase {
  constructor(private gymRepository: IGymRepository) {}

  async execute(): Promise<
    Array<{ gym: Gym; availableSpots: number | null; currentCount: number }>
  > {
    return await this.gymRepository.findWithAvailableSpots();
  }
}

