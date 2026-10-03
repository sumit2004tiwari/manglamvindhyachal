import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { publicVendorSelect } from '../vendors/public-profile.js';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    type?: 'SERVICE' | 'PRODUCT';
    title: string;
    description: string;
    category: string;
    price: number;
    priceType?: 'FIXED' | 'STARTING_FROM' | 'QUOTE_ONLY';
    durationMinutes?: number;
    includesSamagri?: boolean;
    maxGroupSize?: number;
    photos?: string[];
  }) {
    const vendor = await this.prisma.vendorProfile.findUnique({ where: { userId } });
    if (!vendor) throw new ForbiddenException('केवल सत्यापित पांडा जी लिस्टिंग बना सकते हैं।');

    return this.prisma.listing.create({
      data: { vendorId: vendor.id, ...data },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { vendor: { select: publicVendorSelect } },
    });
    if (!listing) throw new NotFoundException('लिस्टिंग नहीं मिली।');
    return listing;
  }

  async update(id: string, userId: string, data: Partial<{
    title: string;
    description: string;
    price: number;
    status: 'ACTIVE' | 'PAUSED';
    includesSamagri: boolean;
    maxGroupSize: number;
  }>) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { vendor: true },
    });
    if (!listing) throw new NotFoundException('लिस्टिंग नहीं मिली।');
    if (listing.vendor.userId !== userId) throw new ForbiddenException('आप इसे संपादित नहीं कर सकते।');

    return this.prisma.listing.update({ where: { id }, data });
  }

  async findByVendor(vendorId: string) {
    return this.prisma.listing.findMany({ where: { vendorId } });
  }
}
