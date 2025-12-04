import { User, FitnessGoal } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { prisma } from '../database/prisma';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const data = await prisma.user.findUnique({ where: { id } });
    return data ? this.toDomain(data) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await prisma.user.findUnique({ where: { email } });
    return data ? this.toDomain(data) : null;
  }

  async findAll(): Promise<User[]> {
    const data = await prisma.user.findMany();
    return data.map((item) => this.toDomain(item));
  }

  async save(user: User): Promise<User> {
    const data = {
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      fitnessGoal: user.fitnessGoal.toLowerCase() as 'strength' | 'hypertrophy' | 'endurance',
    };

    const saved = user.id
      ? await prisma.user.update({
          where: { id: user.id },
          data,
        })
      : await prisma.user.create({ data });

    return this.toDomain(saved);
  }

  async update(user: User): Promise<User> {
    return this.save(user);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  private toDomain(data: {
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
}
