import { Request, Response } from 'express';
import { CreateGymUseCase } from '../../../application/use-cases/CreateGymUseCase';
import { GetGymUseCase } from '../../../application/use-cases/GetGymUseCase';
import { ListGymsUseCase } from '../../../application/use-cases/ListGymsUseCase';
import { UpdateGymUseCase } from '../../../application/use-cases/UpdateGymUseCase';
import { DeleteGymUseCase } from '../../../application/use-cases/DeleteGymUseCase';
import { ListGymsWithAvailableSpotsUseCase } from '../../../application/use-cases/ListGymsWithAvailableSpotsUseCase';
import { GetGymsByUserIdUseCase } from '../../../application/use-cases/GetGymsByUserIdUseCase';
import { GetUserUseCase } from '../../../application/use-cases/GetUserUseCase';
import { CreateGymDTO } from '../../../application/dtos/CreateGymDTO';
import { UpdateGymDTO } from '../../../application/dtos/UpdateGymDTO';
import { 
  RequiredFieldError, 
  CreationFailedError, 
  OperationFailedError,
  EntityNotFoundError,
  UnauthorizedError
} from '../../../domain/errors/DomainError';
import { UserRole } from '../../../domain/entities/User';

export class GymController {
  constructor(
    private createGymUseCase: CreateGymUseCase,
    private getGymUseCase: GetGymUseCase,
    private getGymsByUserIdUseCase: GetGymsByUserIdUseCase,
    private listGymsUseCase: ListGymsUseCase,
    private updateGymUseCase: UpdateGymUseCase,
    private deleteGymUseCase: DeleteGymUseCase,
    private getUserUseCase: GetUserUseCase,
    private listGymsWithAvailableSpotsUseCase: ListGymsWithAvailableSpotsUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const dto = req.body as CreateGymDTO;
    // Set userId from authenticated user if not provided
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      throw new UnauthorizedError('Unauthorized');
    }
    dto.userId = currentUserId;
    try {
      const gym = await this.createGymUseCase.execute(dto);
      res.status(201).json(gym);
    } catch (error) {
      if (error instanceof EntityNotFoundError || error instanceof RequiredFieldError) {
        throw error;
      }
      throw new CreationFailedError('gym', error instanceof Error ? error.message : undefined);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      throw new RequiredFieldError('Gym ID', 'gym');
    }
    try {
      const gym = await this.getGymUseCase.execute(id);
      res.json(gym);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      throw new OperationFailedError('fetch', 'gym', error instanceof Error ? error.message : undefined);
    }
  }

  async listMyGyms(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError('User not authenticated');
      }
      const user = await this.getUserUseCase.execute(userId);
      let gyms;

      if (user.role === UserRole.MANAGER) {
        // MANAGER: See only gyms I manage
        console.log(`User ${user.email} is a MANAGER. Fetching their gyms.`);
        gyms = await this.getGymsByUserIdUseCase.execute(userId);
      } else {
        // USER: See ALL gyms (discovery mode)
        console.log(`User ${user.email} is a USER. Fetching all gyms.`);
        gyms = await this.listGymsUseCase.execute();
      }      
      res.json(gyms);
    } catch (error) {
      throw new OperationFailedError('list user gyms', 'gym', error instanceof Error ? error.message : undefined);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const gyms = await this.listGymsUseCase.execute();
      res.json(gyms);
    } catch (error) {
      throw new OperationFailedError('list', 'gyms', error instanceof Error ? error.message : undefined);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      throw new RequiredFieldError('Gym ID', 'gym');
    }
    const dto = req.body as UpdateGymDTO;
    try {
      const gym = await this.updateGymUseCase.execute(id, dto);
      res.json(gym);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      throw new OperationFailedError('update', 'gym', error instanceof Error ? error.message : undefined);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      throw new RequiredFieldError('Gym ID', 'gym');
    }
    try {
      await this.deleteGymUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      throw new OperationFailedError('delete', 'gym', error instanceof Error ? error.message : undefined);
    }
  }

  async listWithAvailableSpots(req: Request, res: Response): Promise<void> {
    try {
      const gyms = await this.listGymsWithAvailableSpotsUseCase.execute();
      res.json(gyms);
    } catch (error) {
      throw new OperationFailedError('fetch', 'gyms with available spots', error instanceof Error ? error.message : undefined);
    }
  }
}

