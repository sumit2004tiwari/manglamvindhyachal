var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { VerificationStatus } from '@prisma/client';
import { publicVendorSelect } from './public-profile.js';
let VendorsService = class VendorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(filters) {
        const aliases = {
            mundan: ['Mundan', 'मुंडन'], pind_daan: ['Pind', 'पिंड'], satyanarayan_puja: ['Satyanarayan', 'सत्यनारायण'],
            ganga_aarti: ['Ganga', 'गंगा'], vivah_puja: ['Vivah', 'Wedding', 'विवाह'], namkaran: ['Namkaran', 'नामकरण'],
            griha_pravesh: ['Griha', 'गृह'], shraddh: ['Shraddh', 'श्राद्ध'], rudrabhishek: ['Rudrabhishek', 'रुद्राभिषेक'], navgraha_puja: ['Navgraha', 'नवग्रह'],
        };
        const listingFilters = {
            status: 'ACTIVE',
            ...(filters.category && { OR: [{ category: filters.category }, ...(aliases[filters.category] || []).map(title => ({ title: { contains: title, mode: 'insensitive' } }))] }),
            ...((filters.minPrice !== undefined || filters.maxPrice !== undefined) && { price: { ...(filters.minPrice !== undefined && { gte: filters.minPrice }), ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }) } }),
        };
        if ([filters.minPrice, filters.maxPrice, filters.minRating].some(n => n !== undefined && (!Number.isFinite(n) || n < 0)))
            throw new BadRequestException('Invalid search filters.');
        const vendors = await this.prisma.vendorProfile.findMany({
            where: {
                verificationStatus: VerificationStatus.VERIFIED,
                ...((filters.category || filters.minPrice !== undefined || filters.maxPrice !== undefined) && { listings: { some: listingFilters } }),
                ...(filters.language && {
                    languages: { has: filters.language },
                }),
                ...(filters.minRating && {
                    avgRating: { gte: filters.minRating },
                }),
            },
            select: {
                ...publicVendorSelect,
                listings: {
                    where: listingFilters,
                    take: 3,
                },
            },
            orderBy: { avgRating: 'desc' },
        });
        return vendors;
    }
    async findOne(id) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { id },
            select: {
                ...publicVendorSelect,
                listings: { where: { status: 'ACTIVE' } },
                reviews: {
                    include: { user: { select: { id: true, name: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
            },
        });
        if (!vendor)
            throw new NotFoundException('पांडा जी नहीं मिले।');
        return vendor;
    }
    async getMyProfile(userId) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { userId },
            include: { listings: true },
        });
        if (!vendor)
            throw new NotFoundException('प्रोफ़ाइल नहीं मिली।');
        return vendor;
    }
    async getAvailability(vendorId, date) {
        return this.prisma.availabilitySlot.findMany({
            where: {
                vendorId,
                isBooked: false,
                ...(date && { date: new Date(date) }),
            },
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        });
    }
    async setAvailability(userId, vendorId, slots) {
        const vendor = await this.prisma.vendorProfile.findUnique({ where: { userId } });
        if (!vendor)
            throw new ForbiddenException('विक्रेता प्रोफ़ाइल नहीं मिली।');
        if (vendor.id !== vendorId)
            throw new ForbiddenException('You can only set your own availability.');
        for (const slot of slots) {
            const date = new Date(`${slot.date}T00:00:00Z`);
            if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== slot.date || slot.endTime <= slot.startTime)
                throw new BadRequestException('Choose a valid date and an end time after the start time.');
        }
        return this.prisma.availabilitySlot.createMany({
            data: slots.map((s) => ({
                vendorId: vendor.id,
                date: new Date(s.date),
                startTime: new Date(`1970-01-01T${s.startTime}:00Z`),
                endTime: new Date(`1970-01-01T${s.endTime}:00Z`),
            })),
            skipDuplicates: true,
        });
    }
};
VendorsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], VendorsService);
export { VendorsService };
//# sourceMappingURL=vendors.service.js.map