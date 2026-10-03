import { PrismaService } from '../prisma.service.js';
import { BookingStatus } from '@prisma/client';
import type { CreateBookingDto } from './booking.dto.js';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: CreateBookingDto): Promise<{
        user: {
            id: string;
            phone: string;
            name: string | null;
        };
        listing: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            vendorId: string;
            status: import("@prisma/client").$Enums.ListingStatus;
            type: import("@prisma/client").$Enums.ListingType;
            title: string;
            description: string;
            category: string;
            price: number;
            priceType: import("@prisma/client").$Enums.PriceType;
            durationMinutes: number | null;
            includesSamagri: boolean;
            maxGroupSize: number | null;
            photos: string[];
        };
        review: {
            id: string;
            createdAt: Date;
            userId: string;
            vendorId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        } | null;
        vendor: {
            user: {
                phone: string;
                name: string | null;
            };
            id: string;
            userId: string;
            photoUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
        listingId: string;
        slotId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        performedOnBehalfOf: string | null;
        groupSize: number;
        priceAgreed: number;
        scheduledDate: Date;
        customerName: string | null;
        customerPhone: string | null;
        location: string | null;
        notes: string | null;
    }>;
    updateStatus(bookingId: string, actorUserId: string, actorRole: string, status: BookingStatus): Promise<({
        user: {
            id: string;
            phone: string;
            name: string | null;
        };
        listing: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            vendorId: string;
            status: import("@prisma/client").$Enums.ListingStatus;
            type: import("@prisma/client").$Enums.ListingType;
            title: string;
            description: string;
            category: string;
            price: number;
            priceType: import("@prisma/client").$Enums.PriceType;
            durationMinutes: number | null;
            includesSamagri: boolean;
            maxGroupSize: number | null;
            photos: string[];
        };
        review: {
            id: string;
            createdAt: Date;
            userId: string;
            vendorId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        } | null;
        vendor: {
            user: {
                phone: string;
                name: string | null;
            };
            id: string;
            userId: string;
            photoUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
        listingId: string;
        slotId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        performedOnBehalfOf: string | null;
        groupSize: number;
        priceAgreed: number;
        scheduledDate: Date;
        customerName: string | null;
        customerPhone: string | null;
        location: string | null;
        notes: string | null;
    }) | null>;
    findOne(id: string, userId: string, role: string): Promise<{
        user: {
            id: string;
            phone: string;
            name: string | null;
        };
        listing: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            vendorId: string;
            status: import("@prisma/client").$Enums.ListingStatus;
            type: import("@prisma/client").$Enums.ListingType;
            title: string;
            description: string;
            category: string;
            price: number;
            priceType: import("@prisma/client").$Enums.PriceType;
            durationMinutes: number | null;
            includesSamagri: boolean;
            maxGroupSize: number | null;
            photos: string[];
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            bookingId: string;
            amount: number;
            commissionAmount: number;
            vendorPayoutAmount: number;
            gatewayTxnId: string | null;
        } | null;
        review: {
            id: string;
            createdAt: Date;
            userId: string;
            vendorId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        } | null;
        vendor: {
            user: {
                phone: string;
                name: string | null;
            };
            id: string;
            userId: string;
            photoUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
        listingId: string;
        slotId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        performedOnBehalfOf: string | null;
        groupSize: number;
        priceAgreed: number;
        scheduledDate: Date;
        customerName: string | null;
        customerPhone: string | null;
        location: string | null;
        notes: string | null;
    }>;
    cancel(bookingId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
        listingId: string;
        slotId: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        performedOnBehalfOf: string | null;
        groupSize: number;
        priceAgreed: number;
        scheduledDate: Date;
        customerName: string | null;
        customerPhone: string | null;
        location: string | null;
        notes: string | null;
    } | null>;
}
