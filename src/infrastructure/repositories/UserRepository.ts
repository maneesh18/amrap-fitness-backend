import { User, FitnessGoal, UserRole } from '../../domain/entities/User';
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
      id: user.id,
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      role: user.role, // This will be 'USER' or 'MANAGER' as string
      fitnessGoal: user.fitnessGoal.toLowerCase() as 'strength' | 'hypertrophy' | 'endurance',
    };
    
    const saved = await prisma.user.upsert({
      where: { id: user.id },
      create: data,
      update: data
    });
    
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
    role: string; 
    createdAt: Date;
    updatedAt: Date;
  }): User {
    // Map the role string to the UserRole enum
    const role = data.role === 'USER' ? UserRole.USER : UserRole.MANAGER;
    
    return new User(
      data.id,
      data.name,
      data.email,
      data.dateOfBirth,
      data.fitnessGoal as FitnessGoal,
      role,
      data.createdAt,
      data.updatedAt
    );
  }
}
