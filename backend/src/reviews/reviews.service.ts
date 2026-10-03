import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    bookingId: string;
    rating: number;
    comment?: string;
  }) {
    // Only allow review after booking is COMPLETED
    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId },
    });
    if (!booking) throw new NotFoundException('बुकिंग नहीं मिली।');
    if (booking.userId !== userId) throw new BadRequestException('आप इस बुकिंग की समीक्षा नहीं कर सकते।');
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('सेवा पूर्ण होने के बाद ही समीक्षा दी जा सकती है।');
    }

    const existingReview = await this.prisma.review.findUnique({
      where: { bookingId: data.bookingId },
    });
    if (existingReview) throw new BadRequestException('इस बुकिंग की समीक्षा पहले से दे दी गई है।');

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

    // Update vendor's average rating
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
}
