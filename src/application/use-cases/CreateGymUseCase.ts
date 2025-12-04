import { Gym, GymType } from '../../domain/entities/Gym';
import { IGymRepository } from '../../domain/repositories/IGymRepository';
import { CreateGymDTO } from '../dtos/CreateGymDTO';

export class CreateGymUseCase {
  constructor(private gymRepository: IGymRepository) {}

  async execute(dto: CreateGymDTO): Promise<Gym> {
    const gym = Gym.create(
      dto.name,
      dto.type as GymType,
      dto.location,
      dto.capacity
    );

    return await this.gymRepository.save(gym);
  }
}

