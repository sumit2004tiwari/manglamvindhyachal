var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { VerificationStatus } from '@prisma/client';
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPendingVendors() {
        return this.prisma.vendorProfile.findMany({
            where: { verificationStatus: VerificationStatus.PENDING },
            include: { user: { select: { id: true, name: true, phone: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async verifyVendor(vendorId, status, _comment) {
        if (!['VERIFIED', 'REJECTED'].includes(status))
            throw new BadRequestException('Choose VERIFIED or REJECTED.');
        return this.prisma.vendorProfile.update({
            where: { id: vendorId },
            data: { verificationStatus: status },
        });
    }
    async getAnalytics() {
        const [totalUsers, totalVendors, totalBookings, totalRevenue, recentBookings] = await Promise.all([
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
};
AdminService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AdminService);
export { AdminService };
//# sourceMappingURL=admin.service.js.map