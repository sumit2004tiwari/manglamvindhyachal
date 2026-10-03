import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPendingVendors() {
    return this.prisma.vendorProfile.findMany({
      where: { verificationStatus: VerificationStatus.PENDING },
      include: { user: { select: { id: true, name: true, phone: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async verifyVendor(vendorId: string, status: VerificationStatus, _comment?: string) {
    if (!['VERIFIED', 'REJECTED'].includes(status)) throw new BadRequestException('Choose VERIFIED or REJECTED.');
    return this.prisma.vendorProfile.update({
      where: { id: vendorId },
      data: { verificationStatus: status },
    });
  }

  async getAnalytics() {
    const [totalUsers, totalVendors, totalBookings, totalRevenue, recentBookings] =
      await Promise.all([
        this.prisma.user.count({ where: { role: 'USER' } }),
        this.prisma.vendorProfile.count({ where: { verificationStatus: 'VERIFIED' } }),
        this.prisma.booking.count(),
        this.prisma.payment.aggregate({ _sum: { amount: true } }),
        this.prisma.booking.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true } },
            listing: { select: { title: true } },
          },
        }),
      ]);

    return {
      totalUsers,
      totalVendors,
      totalBookings,
      gmv: totalRevenue._sum.amount || 0,
      recentBookings,
    };
  }
}
