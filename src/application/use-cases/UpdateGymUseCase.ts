import { Gym, GymType } from '../../domain/entities/Gym';
import { IGymRepository } from '../../domain/repositories/IGymRepository';
import { UpdateGymDTO } from '../dtos/UpdateGymDTO';
import { EntityNotFoundError } from '../../domain/errors/DomainError';

export class UpdateGymUseCase {
  constructor(private gymRepository: IGymRepository) {}

  async execute(id: string, dto: UpdateGymDTO): Promise<Gym> {
    const gym = await this.gymRepository.findById(id);
    if (!gym) {
      throw new EntityNotFoundError('Gym', id);
    }

    gym.update(
      dto.name,
      dto.type as GymType | undefined,
      dto.location,
      dto.capacity
    );

    return await this.gymRepository.update(gym);
  }
}

