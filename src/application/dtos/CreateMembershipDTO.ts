import { IsUUID } from 'class-validator';

export class CreateMembershipDTO {
  @IsUUID()
  userId!: string;

  @IsUUID()
  gymId!: string;
}

