import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}

export class ResendVerificationDto {
  @IsEmail()
  email: string;
}

export class CheckEmailVerificationStatusDto {
  @IsEmail()
  email: string;
}