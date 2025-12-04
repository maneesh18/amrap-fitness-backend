import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User, FitnessGoal } from '../../../domain/entities/User';
import { MembershipEntity } from './MembershipEntity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'date' })
  dateOfBirth!: Date;

  @Column({
    type: 'enum',
    enum: FitnessGoal,
  })
  fitnessGoal!: FitnessGoal;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => MembershipEntity, (membership) => membership.user)
  memberships!: MembershipEntity[];

  toDomain(): User {
    return new User(
      this.id,
      this.name,
      this.email,
      this.dateOfBirth,
      this.fitnessGoal,
      this.createdAt,
      this.updatedAt
    );
  }

  static fromDomain(user: User): UserEntity {
    const entity = new UserEntity();
    if (user.id) {
      entity.id = user.id;
    }
    entity.name = user.name;
    entity.email = user.email;
    entity.dateOfBirth = user.dateOfBirth;
    entity.fitnessGoal = user.fitnessGoal;
    return entity;
  }
}

