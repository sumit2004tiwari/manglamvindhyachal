import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
import { Role } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    requestOtp(phone: string): Promise<{
        message: string;
        otp?: string;
    }>;
    verifyOtp(phone: string, otp: string, role?: Role): Promise<{
        accessToken: string;
        user: object;
    }>;
    me(userId: string): Promise<{
        hasKyc: boolean;
        id: string;
        phone: string;
        name: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
