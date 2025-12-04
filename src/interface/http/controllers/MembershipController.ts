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
    try {
      const membership = await this.addUserToGymUseCase.execute(dto);
      res.status(201).json(membership);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add user to gym' });
    }
  }

  async removeUserFromGym(req: Request, res: Response): Promise<void> {
    const { userId, gymId } = req.params;
    if (!userId || !gymId) {
      res.status(400).json({ error: 'Both user ID and gym ID are required' });
      return;
    }
    try {
      await this.removeUserFromGymUseCase.execute(userId, gymId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove user from gym' });
    }
  }

  async listGymUsers(req: Request, res: Response): Promise<void> {
    const { gymId } = req.params;
    if (!gymId) {
      res.status(400).json({ error: 'Gym ID is required' });
      return;
    }
    try {
      const users = await this.listGymUsersUseCase.execute(gymId);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch gym users' });
    }
  }

  async listUserGyms(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    try {
      const gyms = await this.listUserGymsUseCase.execute(userId);
      res.json(gyms);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user gyms' });
    }
  }
}

