// src/application/use-cases/CreateGymUseCase.ts
import { Gym, GymType } from '../../domain/entities/Gym';
import { IGymRepository } from '../../domain/repositories/IGymRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateGymDTO } from '../dtos/CreateGymDTO';
import { EntityNotFoundError } from '../../domain/errors/DomainError';

export class CreateGymUseCase {
  constructor(
    private gymRepository: IGymRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(dto: CreateGymDTO): Promise<Gym> {
    // Verify manager exists
    const manager = await this.userRepository.findById(dto.userId);
    if (!manager) {
      throw new EntityNotFoundError('User', dto.userId);
    }

    const gym = Gym.create(
      dto.name,
      dto.type as GymType,
      dto.userId,
      dto.location,
      dto.capacity
    );

    return await this.gymRepository.save(gym);
  }
}