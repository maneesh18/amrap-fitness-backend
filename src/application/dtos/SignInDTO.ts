import { IsString, IsEmail } from 'class-validator';
export class SignInDTO {
  @IsEmail()
  username!: string;

  @IsString()
  password!: string;
}