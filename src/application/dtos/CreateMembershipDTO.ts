import { IsUUID } from 'class-validator';

export class CreateMembershipDTO {
  userId!: string;

  @IsUUID()
  gymId!: string;
}

