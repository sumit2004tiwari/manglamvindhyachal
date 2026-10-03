import { AuthService } from './auth.service.js';
import { RequestOtpDto, VerifyOtpDto } from './dto/auth.dto.js';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    me(req: any): Promise<{
        hasKyc: boolean;
        id: string;
        phone: string;
        name: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    requestOtp(dto: RequestOtpDto): Promise<{
        message: string;
        otp?: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        accessToken: string;
        user: object;
    }>;
}
