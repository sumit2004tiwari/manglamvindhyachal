import { PrismaService } from '../prisma.service.js';
export declare class UsersController {
    private prisma;
    constructor(prisma: PrismaService);
    getUserBookings(id: string, req: any, view?: string): Promise<({
        user: {
            id: string;
            phone: string;
            email: string | null;
            name: string | null;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
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
        vendor: {
            user: {
                phone: string;
                name: string | null;
            };
            id: string;
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
    })[]>;
}
