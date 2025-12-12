// src/infrastructure/repositories/GymRepository.ts
import { Gym, GymType } from '../../domain/entities/Gym';
import { IGymRepository } from '../../domain/repositories/IGymRepository';
import { prisma } from '../database/prisma';

export class GymRepository implements IGymRepository {
  async findById(id: string): Promise<Gym | null> {
    const data = await prisma.gym.findUnique({ where: { id } });
    return data ? this.toDomain(data) : null;
  }
  
  async findByUserId(userId: string): Promise<Gym[] | []> {
    const data = await prisma.gym.findMany({ where: { userId } });
    return data ? data.map((item) => this.toDomain(item)):[];
  }

  async findAll(): Promise<Gym[]> {
    const data = await prisma.gym.findMany();
    return data.map((item) => this.toDomain(item));
  }

  async save(gym: Gym): Promise<Gym> {
    const { userId, ...gymData } = {
      name: gym.name,
      type: gym.type.toLowerCase() as 'commercial' | 'home' | 'apartment',
      location: gym.location,
      capacity: gym.capacity,
      userId: gym.userId
    };

    const saved = gym.id
      ? await prisma.gym.update({
          where: { id: gym.id },
          data: gymData, // For update, we usually don't change the owner (userId)
        })
      : await prisma.gym.create({ 
          data: {
            ...gymData, // <--- This now DOES NOT contain 'userId', fixing the error!
            user: { 
              connect: { id: userId } // We allow 'connect' to handle the linking
            }
          },
          include: { user: true }
        });

    return this.toDomain(saved);
  }

  async update(gym: Gym): Promise<Gym> {
    return this.save(gym);
  }

  async delete(id: string): Promise<void> {
    await prisma.gym.delete({ where: { id } });
  }

  async getMemberCount(gymId: string): Promise<number> {
    return await prisma.membership.count({ where: { gymId } });
  }

  async findWithAvailableSpots(): Promise<
    Array<{ gym: Gym; availableSpots: number | null; currentCount: number }>
  > {
    const gyms = await prisma.gym.findMany();
    const result = await Promise.all(
      gyms.map(async (gymData) => {
        const gym = this.toDomain(gymData);
        const currentCount = await this.getMemberCount(gym.id);
        const availableSpots = gym.getAvailableSpots(currentCount);
        return { gym, availableSpots, currentCount };
      })
    );

    return result
      .filter((item) => item.availableSpots === null || item.availableSpots > 0)
      .sort((a, b) => {
        if (a.availableSpots === null) return 1;
        if (b.availableSpots === null) return -1;
        return b.availableSpots - a.availableSpots;
      });
  }

  private toDomain(data: {
    id: string;
    name: string;
    type: string;
    location: string | null;
    capacity: number | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Gym {
    return new Gym(
      data.id,
      data.name,
      data.type.toUpperCase() as GymType,
      data.location,
      data.capacity,
      data.userId,
      data.createdAt,
      data.updatedAt
    );
  }
}