import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import { GetUserUseCase } from '../../../application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from '../../../application/use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from '../../../application/use-cases/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../../application/use-cases/DeleteUserUseCase';
import { CreateUserDTO } from '../../../application/dtos/CreateUserDTO';
import { UpdateUserDTO } from '../../../application/dtos/UpdateUserDTO';

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
    const user = await this.createUserUseCase.execute(dto);
    res.status(201).json(user);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await this.getUserUseCase.execute(id);
    res.json(user);
  }

  async list(req: Request, res: Response): Promise<void> {
    const users = await this.listUsersUseCase.execute();
    res.json(users);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto = req.body as UpdateUserDTO;
    const user = await this.updateUserUseCase.execute(id, dto);
    res.json(user);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.deleteUserUseCase.execute(id);
    res.status(204).send();
  }
}

