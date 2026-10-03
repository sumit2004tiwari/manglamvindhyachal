var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException, UnauthorizedException, ServiceUnavailableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
import { Role } from '@prisma/client';
const otpStore = new Map();
function generateOtp() {
    return '123456';
}
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async requestOtp(phone) {
        if (process.env.NODE_ENV === 'production')
            throw new ServiceUnavailableException('SMS OTP delivery is not configured.');
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        otpStore.set(phone, { otp, expiresAt });
        console.log(`OTP for ${phone}: ${otp}`);
        return {
            message: 'OTP भेजा गया है। डेमो OTP: 123456',
            otp: otp,
        };
    }
    async verifyOtp(phone, otp, role) {
        if (role === Role.ADMIN)
            throw new BadRequestException('Administrator accounts cannot be created through public login.');
        const stored = otpStore.get(phone);
        if (!stored) {
            throw new BadRequestException('OTP नहीं मिला। कृपया दोबारा अनुरोध करें।');
        }
        if (new Date() > stored.expiresAt) {
            otpStore.delete(phone);
            throw new BadRequestException('OTP की समय सीमा समाप्त हो गई है। कृपया दोबारा अनुरोध करें।');
        }
        if (stored.otp !== otp) {
            throw new UnauthorizedException('गलत OTP। कृपया सही OTP दर्ज करें।');
        }
        otpStore.delete(phone);
        let user = await this.prisma.user.findUnique({ where: { phone } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    phone,
                    role: role || Role.USER,
                },
            });
        }
        else if (role === Role.VENDOR && user.role === Role.USER) {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: { role: Role.VENDOR },
            });
        }
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                role: user.role,
                hasKyc: !!await this.prisma.vendorProfile.findUnique({ where: { userId: user.id }, select: { id: true } }),
            },
        };
    }
    async me(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, phone: true, role: true, vendorProfile: { select: { id: true } } } });
        if (!user)
            throw new UnauthorizedException('Account not found.');
        const { vendorProfile, ...profile } = user;
        return { ...profile, hasKyc: !!vendorProfile };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map