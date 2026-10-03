var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { publicVendorSelect } from '../vendors/public-profile.js';
let ListingsService = class ListingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const vendor = await this.prisma.vendorProfile.findUnique({ where: { userId } });
        if (!vendor)
            throw new ForbiddenException('केवल सत्यापित पांडा जी लिस्टिंग बना सकते हैं।');
        return this.prisma.listing.create({
            data: { vendorId: vendor.id, ...data },
        });
    }
    async findOne(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: { vendor: { select: publicVendorSelect } },
        });
        if (!listing)
            throw new NotFoundException('लिस्टिंग नहीं मिली।');
        return listing;
    }
    async update(id, userId, data) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: { vendor: true },
        });
        if (!listing)
            throw new NotFoundException('लिस्टिंग नहीं मिली।');
        if (listing.vendor.userId !== userId)
            throw new ForbiddenException('आप इसे संपादित नहीं कर सकते।');
        return this.prisma.listing.update({ where: { id }, data });
    }
    async findByVendor(vendorId) {
        return this.prisma.listing.findMany({ where: { vendorId } });
    }
};
ListingsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ListingsService);
export { ListingsService };
//# sourceMappingURL=listings.service.js.map