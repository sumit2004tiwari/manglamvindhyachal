import { VendorsService } from './vendors.service.js';
import { CreatePandaDto } from '../pandas/panda.dto.js';
import { PandasService } from '../pandas/pandas.service.js';
import { SetAvailabilityDto } from './availability.dto.js';
export declare class VendorsController {
    private vendorsService;
    private pandasService;
    constructor(vendorsService: VendorsService, pandasService: PandasService);
    search(category?: string, language?: string, minPrice?: string, maxPrice?: string, minRating?: string, date?: string): Promise<{
        user: {
            id: string;
            phone: string;
            name: string | null;
        };
        id: string;
        photoUrl: string | null;
        bio: string | null;
        languages: string[];
        userId: string;
        lineageDetails: string | null;
        yearsExperience: number | null;
        specializations: string[];
        videoIntroUrl: string | null;
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        avgRating: number | null;
        listings: {
            id: string;
            vendorId: string;
            status: import("@prisma/client").$Enums.ListingStatus;
            createdAt: Date;
            updatedAt: Date;
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
    getMyProfile(req: any): Promise<{
        listings: {
            id: string;
            vendorId: string;
            status: import("@prisma/client").$Enums.ListingStatus;
            createdAt: Date;
            updatedAt: Date;
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
        photoUrl: string | null;
        bio: string | null;
        languages: string[];
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        lineageDetails: string | null;
        yearsExperience: number | null;
        specializations: string[];
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
    findOne(id: string): Promise<{
        user: {
            id: string;
            phone: string;
            name: string | null;
        };
        id: string;
        photoUrl: string | null;
        bio: string | null;
        languages: string[];
        reviews: ({
            user: {
                id: string;
                name: string | null;
            };
        } & {
            id: string;
            vendorId: string;
            createdAt: Date;
            userId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        })[];
        userId: string;
        lineageDetails: string | null;
        yearsExperience: number | null;
        specializations: string[];
        videoIntroUrl: string | null;
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        avgRating: number | null;
        listings: {
            id: string;
            vendorId: string;
            status: import("@prisma/client").$Enums.ListingStatus;
            createdAt: Date;
            updatedAt: Date;
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
    submitKyc(req: any, body: CreatePandaDto): Promise<{
        id: string;
        vendorId: string | null;
        phone: string;
        name: string;
        email: string | null;
        photoUrl: string;
        bio: string | null;
        languages: string[];
        experience: number | null;
        specialities: string[];
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAvailability(id: string, date?: string): Promise<{
        id: string;
        vendorId: string;
        createdAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        isBooked: boolean;
    }[]>;
    setAvailability(id: string, req: any, body: SetAvailabilityDto): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
