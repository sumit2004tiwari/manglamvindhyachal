import { PaymentsService } from './payments.service.js';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(req: any, bookingId: string): Promise<{
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
    handleWebhook(payload: any): Promise<void>;
}
