var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Param, Query, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PrismaService } from '../prisma.service.js';
let UsersController = class UsersController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserBookings(id, req, view) {
        if (req.user.userId !== id && req.user.role !== 'ADMIN') {
            throw new ForbiddenException('You can only view your own bookings');
        }
        if (view === 'panda') {
            return this.prisma.booking.findMany({
                where: { vendor: { userId: id } },
                include: {
                    listing: true,
                    vendor: { select: { id: true, photoUrl: true, user: { select: { name: true, phone: true } } } },
                    user: true
                },
                orderBy: { scheduledDate: 'asc' }
            });
        }
        return this.prisma.booking.findMany({
            where: { userId: id },
            include: {
                listing: true,
                vendor: { select: { id: true, photoUrl: true, user: { select: { name: true, phone: true } } } },
                review: true,
                user: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};
__decorate([
    Get(':id/bookings'),
    __param(0, Param('id')),
    __param(1, Request()),
    __param(2, Query('as')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserBookings", null);
UsersController = __decorate([
    UseGuards(JwtAuthGuard),
    Controller('users'),
    __metadata("design:paramtypes", [PrismaService])
], UsersController);
export { UsersController };
//# sourceMappingURL=users.controller.js.map