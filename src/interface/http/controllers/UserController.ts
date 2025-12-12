import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import { GetUserUseCase } from '../../../application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from '../../../application/use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from '../../../application/use-cases/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../../application/use-cases/DeleteUserUseCase';
import { CreateUserDTO } from '../../../application/dtos/CreateUserDTO';
import { UpdateUserDTO } from '../../../application/dtos/UpdateUserDTO';
import { 
  RequiredFieldError, 
  OperationFailedError, 
  EntityNotFoundError,
  CreationFailedError,
  DuplicateEntityError,
  UnauthorizedError
} from '../../../domain/errors/DomainError';
import { UserRole, User } from '../../../domain/entities/User';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private listUsersUseCase: ListUsersUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const dto = req.body as CreateUserDTO;
    if (!dto.email || !dto.name) {
      throw new RequiredFieldError('Email and Name', 'user');
    }
    try {
      const user = await this.createUserUseCase.execute(dto);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof DuplicateEntityError) {
        throw error;
      }
      throw new CreationFailedError('user', error instanceof Error ? error.message : undefined);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      throw new RequiredFieldError('User ID', 'user');
    }
    try {
      const user = await this.getUserUseCase.execute(id);
      if (!user) {
        throw new EntityNotFoundError('User', id);
      }
      res.json(user);
    } catch (error) {
      if (error instanceof EntityNotFoundError || error instanceof RequiredFieldError) {
        throw error;
      }
      throw new OperationFailedError('fetch', 'user', error instanceof Error ? error.message : undefined);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      // console.log('Current user ID:', req.user?.id);
      const currentUserId = req.user?.id;
      if (!currentUserId) {
        throw new UnauthorizedError('Unauthorized');
        return;
      }
      const user = await this.getUserUseCase.execute(currentUserId);
      let users: User[] = [user];
      if(user.role === UserRole.MANAGER) {
        users = await this.listUsersUseCase.execute();
      }
      res.json(users);
    } catch (error) {
      throw new OperationFailedError('list', 'users', error instanceof Error ? error.message : undefined);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      throw new RequiredFieldError('User ID', 'user');
    }
    const dto = req.body as UpdateUserDTO;
    if (Object.keys(dto).length === 0) {
      throw new RequiredFieldError('At least one field to update', 'user');
    }
    try {
      const user = await this.updateUserUseCase.execute(id, dto);
      if (!user) {
        throw new EntityNotFoundError('User', id);
      }
      res.json(user);
    } catch (error) {
      if (error instanceof EntityNotFoundError || 
          error instanceof RequiredFieldError ||
          error instanceof DuplicateEntityError) {
        throw error;
      }
      throw new OperationFailedError('update', 'user', error instanceof Error ? error.message : undefined);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      throw new RequiredFieldError('User ID', 'user');
    }
    try {
      // First check if user exists
      const user = await this.getUserUseCase.execute(id);
      if (!user) {
        throw new EntityNotFoundError('User', id);
      }
      
      // If user exists, proceed with deletion
      await this.deleteUserUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof EntityNotFoundError || 
          error instanceof RequiredFieldError) {
        throw error;
      }
      throw new OperationFailedError('delete', 'user', error instanceof Error ? error.message : undefined);
    }
  }
}

