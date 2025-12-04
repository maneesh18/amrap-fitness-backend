import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Membership } from '../../../domain/entities/Membership';
import { UserEntity } from './UserEntity';
import { GymEntity } from './GymEntity';

@Entity('memberships')
@Unique(['userId', 'gymId'])
export class MembershipEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  gymId!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.memberships)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @ManyToOne(() => GymEntity, (gym) => gym.memberships)
  @JoinColumn({ name: 'gymId' })
  gym!: GymEntity;

  toDomain(): Membership {
    return new Membership(
      this.id,
      this.userId,
      this.gymId,
      this.joinDate,
      this.createdAt,
      this.updatedAt
    );
  }

  static fromDomain(membership: Membership): MembershipEntity {
    const entity = new MembershipEntity();
    if (membership.id) {
      entity.id = membership.id;
    }
    entity.userId = membership.userId;
    entity.gymId = membership.gymId;
    entity.joinDate = membership.joinDate;
    return entity;
  }
}

