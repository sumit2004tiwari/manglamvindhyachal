import { PrismaService } from '../prisma.service.js';
import type { CreatePandaDto } from './panda.dto.js';
export declare class PandasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: CreatePandaDto, allowUpdate?: boolean): Promise<{
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
    findAll(): Promise<({
        vendor: {
            verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        } | null;
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        vendor: {
            id: string;
            lineageDetails: string | null;
            verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
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
        } | null;
    } & {
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
}
