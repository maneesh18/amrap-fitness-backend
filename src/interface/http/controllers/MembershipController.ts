import { Request, Response } from 'express';
import { AddUserToGymUseCase } from '../../../application/use-cases/AddUserToGymUseCase';
import { RemoveUserFromGymUseCase } from '../../../application/use-cases/RemoveUserFromGymUseCase';
import { ListGymUsersUseCase } from '../../../application/use-cases/ListGymUsersUseCase';
import { ListUserGymsUseCase } from '../../../application/use-cases/ListUserGymsUseCase';
import { CreateMembershipDTO } from '../../../application/dtos/CreateMembershipDTO';

export class MembershipController {
  constructor(
    private addUserToGymUseCase: AddUserToGymUseCase,
    private removeUserFromGymUseCase: RemoveUserFromGymUseCase,
    private listGymUsersUseCase: ListGymUsersUseCase,
    private listUserGymsUseCase: ListUserGymsUseCase
  ) {}

  async addUserToGym(req: Request, res: Response): Promise<void> {
    const dto = req.body as CreateMembershipDTO;
    const membership = await this.addUserToGymUseCase.execute(dto);
    res.status(201).json(membership);
  }

  async removeUserFromGym(req: Request, res: Response): Promise<void> {
    const { userId, gymId } = req.params;
    await this.removeUserFromGymUseCase.execute(userId, gymId);
    res.status(204).send();
  }

  async listGymUsers(req: Request, res: Response): Promise<void> {
    const { gymId } = req.params;
    const users = await this.listGymUsersUseCase.execute(gymId);
    res.json(users);
  }

  async listUserGyms(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const gyms = await this.listUserGymsUseCase.execute(userId);
    res.json(gyms);
  }
}

