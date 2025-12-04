import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { EntityNotFoundError } from '../../domain/errors/DomainError';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new EntityNotFoundError('User', id);
    }
    await this.userRepository.delete(id);
  }
}

