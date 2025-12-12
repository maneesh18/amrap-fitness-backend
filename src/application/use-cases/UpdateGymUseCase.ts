// src/application/use-cases/UpdateGymUseCase.ts
import { Gym, GymType } from '../../domain/entities/Gym';
import { IGymRepository } from '../../domain/repositories/IGymRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UpdateGymDTO } from '../dtos/UpdateGymDTO';
import { EntityNotFoundError } from '../../domain/errors/DomainError';

export class UpdateGymUseCase {
  constructor(
    private gymRepository: IGymRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(id: string, dto: UpdateGymDTO): Promise<Gym> {
    const gym = await this.gymRepository.findById(id);
    if (!gym) {
      throw new EntityNotFoundError('Gym', id);
    }

    // If updating manager, verify the new manager exists
    if (dto.userId) {
      const manager = await this.userRepository.findById(dto.userId);
      if (!manager) {
        throw new EntityNotFoundError('User', dto.userId);
      }
    }

    gym.update(
      dto.name,
      dto.type as GymType | undefined,
      dto.userId,
      dto.location,
      dto.capacity
    );

    return await this.gymRepository.update(gym);
  }
}