import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { FitnessGoal } from '../../domain/entities/User';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsEnum(FitnessGoal)
  @IsOptional()
  fitnessGoal?: FitnessGoal;
}

