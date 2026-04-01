import { IsString } from 'class-validator';

export class SignupUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
