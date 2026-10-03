import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ServiceUnavailableException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { BookingStatus } from '@prisma/client';

const COMMISSION_RATE = Number(process.env.COMMISSION_RATE || 0.15);

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // Creates a payment record after Razorpay order creation
  // In production, call Razorpay API here and return order_id
  async createOrder(userId: string, bookingId: string) {
    if (process.env.NODE_ENV === 'production') throw new ServiceUnavailableException('Live payment processing is not configured.');
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true, listing: true },
    });
    if (!booking) throw new NotFoundException('बुकिंग नहीं मिली।');
    if (booking.userId !== userId) throw new ForbiddenException('अनुमति नहीं है।');
    if (booking.status !== 'CONFIRMED') throw new BadRequestException('The Panda must confirm this booking before payment.');
    if (booking.listing.priceType === 'QUOTE_ONLY') throw new BadRequestException('Agree on a price with the Panda before payment.');
    if (booking.payment) return booking.payment;

    const commissionAmount = booking.priceAgreed * COMMISSION_RATE;
    const vendorPayoutAmount = booking.priceAgreed - commissionAmount;

    // Demo: create payment in CAPTURED state directly
    try {
      return await this.prisma.$transaction(async tx => {
        // Lock and recheck the booking so cancellation cannot race payment.
        const locked = await tx.booking.updateMany({ where: { id: bookingId, status: 'CONFIRMED' }, data: { status: 'CONFIRMED' } });
        if (!locked.count) throw new ConflictException('Booking changed. Refresh and try again.');
        const existing = await tx.payment.findUnique({ where: { bookingId } });
        if (existing) return existing;
        return tx.payment.create({
          data: { bookingId, amount: booking.priceAgreed, commissionAmount, vendorPayoutAmount, status: 'CAPTURED', gatewayTxnId: `DEMO_${Date.now()}` },
        });
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('A payment already exists for this booking.');
      throw error;
    }
  }

  // Webhook handler — in production: verify Razorpay signature
  async handleWebhook(_payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    // TODO: verify signature with Razorpay secret
    throw new ServiceUnavailableException('Payment gateway webhook verification is not configured.');
  }

  async releaseVendorPayout(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });
    if (!booking || !booking.payment) throw new NotFoundException('भुगतान नहीं मिला।');
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new ForbiddenException('सेवा पूर्ण होने के बाद ही भुगतान जारी होगा।');
    }

    return this.prisma.payment.update({
      where: { bookingId },
      data: { status: 'PAYOUT_RELEASED' },
    });
  }
}
