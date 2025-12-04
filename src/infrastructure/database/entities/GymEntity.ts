import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Gym, GymType } from '../../../domain/entities/Gym';
import { MembershipEntity } from './MembershipEntity';

@Entity('gyms')
export class GymEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({
    type: 'enum',
    enum: GymType,
  })
  type!: GymType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location!: string | null;

  @Column({ type: 'int', nullable: true })
  capacity!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => MembershipEntity, (membership) => membership.gym)
  memberships!: MembershipEntity[];

  toDomain(): Gym {
    return new Gym(
      this.id,
      this.name,
      this.type,
      this.location,
      this.capacity,
      this.createdAt,
      this.updatedAt
    );
  }

  static fromDomain(gym: Gym): GymEntity {
    const entity = new GymEntity();
    if (gym.id) {
      entity.id = gym.id;
    }
    entity.name = gym.name;
    entity.type = gym.type;
    entity.location = gym.location;
    entity.capacity = gym.capacity;
    return entity;
  }
}

