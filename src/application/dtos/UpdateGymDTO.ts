import { IsString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { GymType } from '../../domain/entities/Gym';

export class UpdateGymDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(GymType)
  @IsOptional()
  type?: GymType;

  @IsString()
  @IsOptional()
  location?: string | null;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number | null;
}

