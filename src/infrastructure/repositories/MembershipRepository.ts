import { Membership } from '../../domain/entities/Membership';
import { User, FitnessGoal } from '../../domain/entities/User';
import { Gym, GymType } from '../../domain/entities/Gym';
import { IMembershipRepository } from '../../domain/repositories/IMembershipRepository';
import { prisma } from '../database/prisma';

export class MembershipRepository implements IMembershipRepository {
  async findByUserAndGym(userId: string, gymId: string): Promise<Membership | null> {
    const data = await prisma.membership.findUnique({
      where: {
        userId_gymId: {
          userId,
          gymId,
        },
      },
    });
    return data ? this.toDomain(data) : null;
  }

  async findByUserId(userId: string): Promise<Array<{ membership: Membership; gym: Gym }>> {
    const data = await prisma.membership.findMany({
      where: { userId },
      include: { gym: true },
      orderBy: { joinDate: 'desc' },
    });
    return data.map((item) => ({
      membership: this.toDomain(item),
      gym: this.gymToDomain(item.gym),
    }));
  }

  async findByGymId(gymId: string): Promise<Array<{ membership: Membership; user: User }>> {
    const data = await prisma.membership.findMany({
      where: { gymId },
      include: { user: true },
      orderBy: { joinDate: 'desc' },
    });
    return data.map((item) => ({
      membership: this.toDomain(item),
      user: this.userToDomain(item.user),
    }));
  }

  async save(membership: Membership): Promise<Membership> {
    const data = {
      userId: membership.userId,
      gymId: membership.gymId,
      joinDate: membership.joinDate,
    };

    const saved = membership.id
      ? await prisma.membership.update({
          where: { id: membership.id },
          data,
        })
      : await prisma.membership.create({ data });

    return this.toDomain(saved);
  }

  async delete(membershipId: string): Promise<void> {
    await prisma.membership.delete({ where: { id: membershipId } });
  }

  async countByGymId(gymId: string): Promise<number> {
    return await prisma.membership.count({ where: { gymId } });
  }

  private toDomain(data: {
    id: string;
    userId: string;
    gymId: string;
    joinDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }): Membership {
    return new Membership(
      data.id,
      data.userId,
      data.gymId,
      data.joinDate,
      data.createdAt,
      data.updatedAt
    );
  }

  private userToDomain(data: {
    id: string;
    name: string;
    email: string;
    dateOfBirth: Date;
    fitnessGoal: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      data.id,
      data.name,
      data.email,
      data.dateOfBirth,
      data.fitnessGoal.toUpperCase() as FitnessGoal,
      data.createdAt,
      data.updatedAt
    );
  }

  private gymToDomain(data: {
    id: string;
    name: string;
    type: string;
    location: string | null;
    capacity: number | null;
    createdAt: Date;
    updatedAt: Date;
  }): Gym {
    return new Gym(
      data.id,
      data.name,
      data.type.toUpperCase() as GymType,
      data.location,
      data.capacity,
      data.createdAt,
      data.updatedAt
    );
  }
}
