import { PrismaService } from '../prisma.service.js';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(userId: string, bookingId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        bookingId: string;
        amount: number;
        commissionAmount: number;
        vendorPayoutAmount: number;
        gatewayTxnId: string | null;
    }>;
    handleWebhook(_payload: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<void>;
    releaseVendorPayout(bookingId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        bookingId: string;
        amount: number;
        commissionAmount: number;
        vendorPayoutAmount: number;
        gatewayTxnId: string | null;
    }>;
}
