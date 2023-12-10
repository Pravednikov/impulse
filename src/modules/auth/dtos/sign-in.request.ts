import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignIn {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
