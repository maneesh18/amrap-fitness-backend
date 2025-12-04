import { Gym } from '../entities/Gym';

export interface IGymRepository {
  findById(id: string): Promise<Gym | null>;
  findAll(): Promise<Gym[]>;
  save(gym: Gym): Promise<Gym>;
  update(gym: Gym): Promise<Gym>;
  delete(id: string): Promise<void>;
  findWithAvailableSpots(): Promise<Array<{ gym: Gym; availableSpots: number | null; currentCount: number }>>;
  getMemberCount(gymId: string): Promise<number>;
}

