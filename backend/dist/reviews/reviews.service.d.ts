import { PrismaService } from '../prisma.service.js';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
        bookingId: string;
        rating: number;
        comment?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        vendorId: string;
        bookingId: string;
        rating: number;
        comment: string | null;
    }>;
}
