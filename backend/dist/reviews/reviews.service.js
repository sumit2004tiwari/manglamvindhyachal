var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { BookingStatus } from '@prisma/client';
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: data.bookingId },
        });
        if (!booking)
            throw new NotFoundException('बुकिंग नहीं मिली।');
        if (booking.userId !== userId)
            throw new BadRequestException('आप इस बुकिंग की समीक्षा नहीं कर सकते।');
        if (booking.status !== BookingStatus.COMPLETED) {
            throw new BadRequestException('सेवा पूर्ण होने के बाद ही समीक्षा दी जा सकती है।');
        }
        const existingReview = await this.prisma.review.findUnique({
            where: { bookingId: data.bookingId },
        });
        if (existingReview)
            throw new BadRequestException('इस बुकिंग की समीक्षा पहले से दे दी गई है।');
        if (data.rating < 1 || data.rating > 5) {
            throw new BadRequestException('रेटिंग 1 से 5 के बीच होनी चाहिए।');
        }
        const review = await this.prisma.review.create({
            data: {
                bookingId: data.bookingId,
                userId,
                vendorId: booking.vendorId,
                rating: data.rating,
                comment: data.comment,
            },
        });
        const allReviews = await this.prisma.review.findMany({
            where: { vendorId: booking.vendorId },
            select: { rating: true },
        });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await this.prisma.vendorProfile.update({
            where: { id: booking.vendorId },
            data: { avgRating },
        });
        return review;
    }
};
ReviewsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ReviewsService);
export { ReviewsService };
//# sourceMappingURL=reviews.service.js.map