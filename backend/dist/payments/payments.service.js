var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ServiceUnavailableException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { BookingStatus } from '@prisma/client';
const COMMISSION_RATE = Number(process.env.COMMISSION_RATE || 0.15);
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(userId, bookingId) {
        if (process.env.NODE_ENV === 'production')
            throw new ServiceUnavailableException('Live payment processing is not configured.');
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { payment: true, listing: true },
        });
        if (!booking)
            throw new NotFoundException('बुकिंग नहीं मिली।');
        if (booking.userId !== userId)
            throw new ForbiddenException('अनुमति नहीं है।');
        if (booking.status !== 'CONFIRMED')
            throw new BadRequestException('The Panda must confirm this booking before payment.');
        if (booking.listing.priceType === 'QUOTE_ONLY')
            throw new BadRequestException('Agree on a price with the Panda before payment.');
        if (booking.payment)
            return booking.payment;
        const commissionAmount = booking.priceAgreed * COMMISSION_RATE;
        const vendorPayoutAmount = booking.priceAgreed - commissionAmount;
        try {
            return await this.prisma.$transaction(async (tx) => {
                const locked = await tx.booking.updateMany({ where: { id: bookingId, status: 'CONFIRMED' }, data: { status: 'CONFIRMED' } });
                if (!locked.count)
                    throw new ConflictException('Booking changed. Refresh and try again.');
                const existing = await tx.payment.findUnique({ where: { bookingId } });
                if (existing)
                    return existing;
                return tx.payment.create({
                    data: { bookingId, amount: booking.priceAgreed, commissionAmount, vendorPayoutAmount, status: 'CAPTURED', gatewayTxnId: `DEMO_${Date.now()}` },
                });
            });
        }
        catch (error) {
            if (error.code === 'P2002')
                throw new ConflictException('A payment already exists for this booking.');
            throw error;
        }
    }
    async handleWebhook(_payload) {
        throw new ServiceUnavailableException('Payment gateway webhook verification is not configured.');
    }
    async releaseVendorPayout(bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { payment: true },
        });
        if (!booking || !booking.payment)
            throw new NotFoundException('भुगतान नहीं मिला।');
        if (booking.status !== BookingStatus.COMPLETED) {
            throw new ForbiddenException('सेवा पूर्ण होने के बाद ही भुगतान जारी होगा।');
        }
        return this.prisma.payment.update({
            where: { bookingId },
            data: { status: 'PAYOUT_RELEASED' },
        });
    }
};
PaymentsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], PaymentsService);
export { PaymentsService };
//# sourceMappingURL=payments.service.js.map