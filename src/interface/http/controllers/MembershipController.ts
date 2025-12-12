import { Request, Response } from 'express';
import { AddUserToGymUseCase } from '../../../application/use-cases/AddUserToGymUseCase';
import { RemoveUserFromGymUseCase } from '../../../application/use-cases/RemoveUserFromGymUseCase';
import { ListGymUsersUseCase } from '../../../application/use-cases/ListGymUsersUseCase';
import { ListUserGymsUseCase } from '../../../application/use-cases/ListUserGymsUseCase';
import { CreateMembershipDTO } from '../../../application/dtos/CreateMembershipDTO';
import { 
  RequiredFieldError, 
  OperationFailedError, 
  EntityNotFoundError,
  MembershipAlreadyExistsError,
  GymCapacityExceededError
} from '../../../domain/errors/DomainError';

export class MembershipController {
  constructor(
    private addUserToGymUseCase: AddUserToGymUseCase,
    private removeUserFromGymUseCase: RemoveUserFromGymUseCase,
    private listGymUsersUseCase: ListGymUsersUseCase,
    private listUserGymsUseCase: ListUserGymsUseCase,
  ) {}

  async addUserToGym(req: Request, res: Response): Promise<void> {
    const dto = req.body as CreateMembershipDTO;
    if (!dto.userId || !dto.gymId) {
      throw new RequiredFieldError('User ID and Gym ID', 'membership');
    }
    try {
      const membership = await this.addUserToGymUseCase.execute(dto);
      res.status(200).json(membership);
    } catch (error) {
      if (error instanceof EntityNotFoundError || 
          error instanceof MembershipAlreadyExistsError ||
          error instanceof GymCapacityExceededError) {
        throw error;
      }
      throw new OperationFailedError('add user to gym', 'membership', error instanceof Error ? error.message : undefined);
    }
  }

  async removeUserFromGym(req: Request, res: Response): Promise<void> {
    const { userId, gymId } = req.params;
    if (!userId || !gymId) {
      throw new RequiredFieldError('User ID and Gym ID', 'membership removal');
    }
    try {
      await this.removeUserFromGymUseCase.execute(userId, gymId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      throw new OperationFailedError('remove user from gym', 'membership', error instanceof Error ? error.message : undefined);
    }
  }

  async listGymUsers(req: Request, res: Response): Promise<void> {
    const { gymId } = req.params;
    if (!gymId) {
      throw new RequiredFieldError('Gym ID', 'gym users list');
    }
    try {
      const users = await this.listGymUsersUseCase.execute(gymId);
      res.json(users);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      throw new OperationFailedError('fetch', 'gym users', error instanceof Error ? error.message : undefined);
    }
  }

  async listUserGyms(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    if (!userId) {
      throw new RequiredFieldError('User ID', 'user gyms list');
    }
    try {
      const gyms = await this.listUserGymsUseCase.execute(userId);
      res.json(gyms);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      throw new OperationFailedError('fetch', 'user gyms', error instanceof Error ? error.message : undefined);
    }
  }
}

