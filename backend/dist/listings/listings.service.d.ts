import { PrismaService } from '../prisma.service.js';
export declare class ListingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
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
    }): Promise<{
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
    }>;
    findOne(id: string): Promise<{
        vendor: {
            user: {
                id: string;
                phone: string;
                name: string | null;
            };
            id: string;
            userId: string;
            lineageDetails: string | null;
            bio: string | null;
            languages: string[];
            yearsExperience: number | null;
            specializations: string[];
            photoUrl: string | null;
            videoIntroUrl: string | null;
            verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
            avgRating: number | null;
        };
    } & {
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
    }>;
    update(id: string, userId: string, data: Partial<{
        title: string;
        description: string;
        price: number;
        status: 'ACTIVE' | 'PAUSED';
        includesSamagri: boolean;
        maxGroupSize: number;
    }>): Promise<{
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
    }>;
    findByVendor(vendorId: string): Promise<{
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
    }[]>;
}
