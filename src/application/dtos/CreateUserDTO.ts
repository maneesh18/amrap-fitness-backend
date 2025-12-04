import { IsString, IsEmail, IsDateString, IsEnum } from 'class-validator';
import { FitnessGoal } from '../../domain/entities/User';

export class CreateUserDTO {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsEnum(FitnessGoal)
  fitnessGoal!: FitnessGoal;
}

