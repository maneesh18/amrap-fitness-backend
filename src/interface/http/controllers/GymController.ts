import { Request, Response } from 'express';
import { CreateGymUseCase } from '../../../application/use-cases/CreateGymUseCase';
import { GetGymUseCase } from '../../../application/use-cases/GetGymUseCase';
import { ListGymsUseCase } from '../../../application/use-cases/ListGymsUseCase';
import { UpdateGymUseCase } from '../../../application/use-cases/UpdateGymUseCase';
import { DeleteGymUseCase } from '../../../application/use-cases/DeleteGymUseCase';
import { ListGymsWithAvailableSpotsUseCase } from '../../../application/use-cases/ListGymsWithAvailableSpotsUseCase';
import { CreateGymDTO } from '../../../application/dtos/CreateGymDTO';
import { UpdateGymDTO } from '../../../application/dtos/UpdateGymDTO';

export class GymController {
  constructor(
    private createGymUseCase: CreateGymUseCase,
    private getGymUseCase: GetGymUseCase,
    private listGymsUseCase: ListGymsUseCase,
    private updateGymUseCase: UpdateGymUseCase,
    private deleteGymUseCase: DeleteGymUseCase,
    private listGymsWithAvailableSpotsUseCase: ListGymsWithAvailableSpotsUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const dto = req.body as CreateGymDTO;
    const gym = await this.createGymUseCase.execute(dto);
    res.status(201).json(gym);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const gym = await this.getGymUseCase.execute(id);
    res.json(gym);
  }

  async list(req: Request, res: Response): Promise<void> {
    const gyms = await this.listGymsUseCase.execute();
    res.json(gyms);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto = req.body as UpdateGymDTO;
    const gym = await this.updateGymUseCase.execute(id, dto);
    res.json(gym);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.deleteGymUseCase.execute(id);
    res.status(204).send();
  }

  async listWithAvailableSpots(req: Request, res: Response): Promise<void> {
    const gyms = await this.listGymsWithAvailableSpotsUseCase.execute();
    res.json(gyms);
  }
}

