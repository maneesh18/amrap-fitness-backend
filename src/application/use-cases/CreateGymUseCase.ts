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
    // Verify manager exists and get the user ID
    if (!dto.userId) {
      throw new Error('User ID is required');
    }
    
    const manager = await this.userRepository.findById(dto.userId);
    if (!manager) {
      throw new EntityNotFoundError('User', dto.userId);
    }

    // Ensure required fields are present
    if (!dto.name) {
      throw new Error('Gym name is required');
    }
    
    if (!dto.type) {
      throw new Error('Gym type is required');
    }

    // Create the gym with the required fields
    const gym = Gym.create(
      dto.name,
      dto.type,
      dto.userId,
      dto.location,
      dto.capacity
    );

    return await this.gymRepository.save(gym);
  }
}