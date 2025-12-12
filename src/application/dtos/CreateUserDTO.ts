import { IsString, IsEmail, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { FitnessGoal, UserRole } from '../../domain/entities/User';

export class CreateUserDTO {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsEnum(FitnessGoal)
  fitnessGoal!: FitnessGoal;
  
  @IsBoolean()
  isManager: boolean = false;
}

