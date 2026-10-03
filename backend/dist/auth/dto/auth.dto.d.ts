import { Role } from '@prisma/client';
export declare class RequestOtpDto {
    phone: string;
}
export declare class VerifyOtpDto {
    phone: string;
    otp: string;
    role?: Role;
}
