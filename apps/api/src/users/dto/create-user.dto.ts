import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  encryptedPassword: string;

  @IsOptional()
  @IsString()
  name?: string;
}
