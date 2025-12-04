import { DataSource } from 'typeorm';
import { UserEntity } from './entities/UserEntity';
import { GymEntity } from './entities/GymEntity';
import { MembershipEntity } from './entities/MembershipEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'fitness_platform',
  synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in dev, use migrations in prod
  logging: process.env.NODE_ENV === 'development',
  entities: [UserEntity, GymEntity, MembershipEntity],
  migrations: ['src/infrastructure/database/migrations/**/*.ts'],
  subscribers: ['src/infrastructure/database/subscribers/**/*.ts'],
});

