import { IsString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { GymType } from '../../domain/entities/Gym';

export class CreateGymDTO {
  @IsString()
  name!: string;

  @IsEnum(GymType)
  type!: GymType;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  userId?: string;
}

