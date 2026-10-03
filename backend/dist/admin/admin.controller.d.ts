import { AdminService } from './admin.service.js';
import { VerificationStatus } from '@prisma/client';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getPendingVendors(): Promise<({
        user: {
            id: string;
            phone: string;
            name: string | null;
        };
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
    })[]>;
    verifyVendor(id: string, status: VerificationStatus, comment?: string): Promise<{
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
    getAnalytics(): Promise<{
        totalUsers: number;
        totalVendors: number;
        totalBookings: number;
        gmv: number;
        recentBookings: ({
            user: {
                name: string | null;
            };
            listing: {
                title: string;
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
        })[];
    }>;
}
