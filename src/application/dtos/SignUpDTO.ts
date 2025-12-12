import { IsString, IsEmail, MinLength, IsBoolean } from 'class-validator';

export class SignUpDTO {
  @IsString()
  @MinLength(3)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;

  @IsBoolean()
  isManager: boolean = false;
}