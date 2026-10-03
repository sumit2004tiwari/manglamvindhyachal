import { IsString, IsOptional, IsIn, Matches } from 'class-validator';
import { Role } from '@prisma/client';

export class RequestOtpDto {
  @IsString()
  @Matches(/^[6-9]\d{9}$/)
  phone: string;
}

export class VerifyOtpDto {
  @IsString()
  @Matches(/^[6-9]\d{9}$/)
  phone: string;

  @IsString()
  @Matches(/^\d{6}$/)
  otp: string;

  @IsOptional()
  @IsIn([Role.USER, Role.VENDOR])
  role?: Role;
}
