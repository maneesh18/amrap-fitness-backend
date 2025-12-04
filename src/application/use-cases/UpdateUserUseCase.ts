import { User, FitnessGoal } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UpdateUserDTO } from '../dtos/UpdateUserDTO';
import { EntityNotFoundError } from '../../domain/errors/DomainError';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new EntityNotFoundError('User', id);
    }

    user.update(
      dto.name,
      dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      dto.fitnessGoal as FitnessGoal | undefined
    );

    return await this.userRepository.update(user);
  }
}

