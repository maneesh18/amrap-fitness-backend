import { Membership } from '../entities/Membership';
import { User } from '../entities/User';
import { Gym } from '../entities/Gym';

export interface IMembershipRepository {
  findByUserAndGym(userId: string, gymId: string): Promise<Membership | null>;
  findByUserId(userId: string): Promise<Array<{ membership: Membership; gym: Gym }>>;
  findByGymId(gymId: string): Promise<Array<{ membership: Membership; user: User }>>;
  save(membership: Membership): Promise<Membership>;
  delete(membershipId: string): Promise<void>;
  countByGymId(gymId: string): Promise<number>;
}

