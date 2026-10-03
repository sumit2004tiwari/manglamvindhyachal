import { PrismaService } from '../prisma.service.js';
export declare class VendorsService {
    private prisma;
    constructor(prisma: PrismaService);
    search(filters: {
        category?: string;
        language?: string;
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
        date?: string;
    }): Promise<{
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
        listings: {
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
        }[];
    }[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            phone: string;
            name: string | null;
        };
        id: string;
        reviews: ({
            user: {
                id: string;
                name: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            vendorId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        })[];
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
        listings: {
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
        }[];
    }>;
    getMyProfile(userId: string): Promise<{
        listings: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        lineageDetails: string | null;
        bio: string | null;
        languages: string[];
        yearsExperience: number | null;
        specializations: string[];
        photoUrl: string | null;
        videoIntroUrl: string | null;
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        aadhaarDocUrl: string | null;
        selfieUrl: string | null;
        bankAccountDetails: import("@prisma/client/runtime/client").JsonValue | null;
        dateOfBirth: Date | null;
        address: string | null;
        identityType: string | null;
        identityLastFour: string | null;
        avgRating: number | null;
    }>;
    getAvailability(vendorId: string, date?: string): Promise<{
        id: string;
        createdAt: Date;
        vendorId: string;
        date: Date;
        startTime: Date;
        endTime: Date;
        isBooked: boolean;
    }[]>;
    setAvailability(userId: string, vendorId: string, slots: {
        date: string;
        startTime: string;
        endTime: string;
    }[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
