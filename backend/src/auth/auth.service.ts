import { Injectable, BadRequestException, UnauthorizedException, ServiceUnavailableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
import { Role } from '@prisma/client';

// In-memory OTP store for demo purposes
// In production, use Redis with TTL
const otpStore = new Map<string, { otp: string; expiresAt: Date }>();

function generateOtp(): string {
  // For demo: always return 123456
  return '123456';
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async requestOtp(phone: string): Promise<{ message: string; otp?: string }> {
    if (process.env.NODE_ENV === 'production') throw new ServiceUnavailableException('SMS OTP delivery is not configured.');
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    otpStore.set(phone, { otp, expiresAt });

    // In production: send via MSG91 / WhatsApp API
    // For demo, we return the OTP in the response
    console.log(`OTP for ${phone}: ${otp}`);

    return {
      message: 'OTP भेजा गया है। डेमो OTP: 123456',
      otp: otp, // Only for demo/dev - remove in production
    };
  }

  async verifyOtp(
    phone: string,
    otp: string,
    role?: Role,
  ): Promise<{ accessToken: string; user: object }> {
    if (role === Role.ADMIN) throw new BadRequestException('Administrator accounts cannot be created through public login.');
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
    } else if (role === Role.VENDOR && user.role === Role.USER) {
      // Upgrade pilgrim to vendor
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

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, phone: true, role: true, vendorProfile: { select: { id: true } } } });
    if (!user) throw new UnauthorizedException('Account not found.');
    const { vendorProfile, ...profile } = user;
    return { ...profile, hasKyc: !!vendorProfile };
  }
}
