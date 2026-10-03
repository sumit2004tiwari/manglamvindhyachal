import { ListingsService } from './listings.service.js';
import { CreateListingDto, UpdateListingDto } from './listing.dto.js';
export declare class ListingsController {
    private listingsService;
    constructor(listingsService: ListingsService);
    create(req: any, body: CreateListingDto): Promise<{
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
    update(id: string, req: any, body: UpdateListingDto): Promise<{
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
}
