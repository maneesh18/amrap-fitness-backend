import { Gym } from '../../domain/entities/Gym';
import { IGymRepository } from '../../domain/repositories/IGymRepository';

export class ListGymsUseCase {
  constructor(private gymRepository: IGymRepository) {}

  async execute(): Promise<Gym[]> {
    return await this.gymRepository.findAll();
  }
}

