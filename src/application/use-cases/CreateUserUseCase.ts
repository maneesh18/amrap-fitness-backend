import { User, FitnessGoal, UserRole } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { DuplicateEntityError } from '../../domain/errors/DomainError';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new DuplicateEntityError('User', 'email', dto.email);
    }
    console.log('Creating user with data:', dto);
    const user = User.create(
      dto.name,
      dto.email,
      new Date(dto.dateOfBirth),
      dto.fitnessGoal as FitnessGoal,
      dto.isManager ? UserRole.MANAGER : UserRole.USER
    );

    return await this.userRepository.save(user);
  }
}

