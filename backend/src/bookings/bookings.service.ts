import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { BookingStatus } from '@prisma/client';
import type { CreateBookingDto } from './booking.dto.js';

const bookingInclude = {
  listing: true,
  user: { select: { id: true, name: true, phone: true } },
  vendor: { select: { id: true, userId: true, photoUrl: true, user: { select: { name: true, phone: true } } } },
  review: true,
} as const;

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateBookingDto) {
    const scheduledDate = new Date(data.scheduledDate);
    if (!Number.isFinite(scheduledDate.getTime()) || scheduledDate <= new Date()) throw new BadRequestException('Choose a valid date and time in the future.');
    if (scheduledDate.getUTCSeconds() !== 0 || scheduledDate.getUTCMilliseconds() !== 0) throw new BadRequestException('Bookings must start on a whole minute.');
    const calendarDate = new Date(`${data.scheduledDate.slice(0, 10)}T00:00:00Z`);
    if (calendarDate.toISOString().slice(0, 10) !== data.scheduledDate.slice(0, 10)) throw new BadRequestException('Choose a valid calendar date.');
    try {
      return await this.prisma.$transaction(async tx => {
        const listing = await tx.listing.findUnique({ where: { id: data.listingId }, include: { vendor: true } });
        if (!listing) throw new NotFoundException('Pooja service not found.');
        if (listing.vendorId !== data.vendorId) throw new BadRequestException('The selected Pooja does not belong to this Panda.');
        if (listing.status !== 'ACTIVE' || listing.vendor.verificationStatus === 'REJECTED') throw new BadRequestException('This Pooja is unavailable.');
        if (listing.vendor.userId === userId) throw new BadRequestException('You cannot book yourself.');
        if (!Number.isInteger(data.groupSize) || data.groupSize < 1 || (listing.maxGroupSize && data.groupSize > listing.maxGroupSize)) throw new BadRequestException('Invalid group size for this Pooja.');
        if (data.slotId) {
          const slot = await tx.availabilitySlot.findUnique({ where: { id: data.slotId } });
          if (!slot || slot.vendorId !== data.vendorId || slot.isBooked) throw new ConflictException('This Panda slot is unavailable.');
          const local = new Date(scheduledDate.getTime() + 330 * 60000);
          if (slot.date.toISOString().slice(0, 10) !== local.toISOString().slice(0, 10) || slot.startTime.toISOString().slice(11, 16) !== local.toISOString().slice(11, 16)) throw new BadRequestException('The selected date and time do not match this slot.');
          const claimed = await tx.availabilitySlot.updateMany({ where: { id: slot.id, isBooked: false }, data: { isBooked: true } });
          if (!claimed.count) throw new ConflictException('This Panda slot is unavailable.');
        }
        const conflict = await tx.booking.findFirst({ where: { vendorId: data.vendorId, scheduledDate, status: { not: 'CANCELLED' } } });
        if (conflict) throw new ConflictException('This Panda is already booked at this date and time. Choose another time.');
        return tx.booking.create({ data: {
          userId, vendorId: listing.vendorId, listingId: listing.id, slotId: data.slotId,
          scheduledDate, groupSize: data.groupSize, performedOnBehalfOf: data.performedOnBehalfOf,
          customerName: data.customerName.trim(), customerPhone: data.customerPhone,
          location: data.location.trim(), notes: data.notes?.trim(), priceAgreed: listing.price,
        }, include: bookingInclude });
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('This Panda is already booked at this date and time. Choose another time.');
      throw error;
    }
  }

  async updateStatus(bookingId: string, actorUserId: string, actorRole: string, status: BookingStatus) {
    return this.prisma.$transaction(async tx => {
      const booking = await tx.booking.findUnique({ where: { id: bookingId }, include: { vendor: true } });
      if (!booking) throw new NotFoundException('Booking not found.');
      if (booking.vendor.userId !== actorUserId && actorRole !== 'ADMIN') throw new ForbiddenException('You can only manage your own Panda bookings.');
      const transitions: Record<string, string[]> = { PENDING: ['CONFIRMED', 'CANCELLED'], CONFIRMED: ['COMPLETED', 'CANCELLED', 'DISPUTED'], DISPUTED: ['COMPLETED', 'CANCELLED'], COMPLETED: [], CANCELLED: [] };
      if (!transitions[booking.status]?.includes(status)) throw new BadRequestException('Invalid booking status transition.');
      if (status === 'COMPLETED' && booking.scheduledDate > new Date()) throw new BadRequestException('A future Pooja cannot be marked completed.');
      const result = await tx.booking.updateMany({ where: { id: bookingId, status: booking.status }, data: { status, ...(status === 'CANCELLED' && { slotId: null }) } });
      if (!result.count) throw new ConflictException('Booking changed. Refresh and try again.');
      if (status === 'CANCELLED' && booking.slotId) await tx.availabilitySlot.update({ where: { id: booking.slotId }, data: { isBooked: false } });
      return tx.booking.findUnique({ where: { id: bookingId }, include: bookingInclude });
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id }, include: { ...bookingInclude, payment: true } });
    if (!booking) throw new NotFoundException('Booking not found.');
    if (booking.userId !== userId && booking.vendor.userId !== userId && role !== 'ADMIN') throw new ForbiddenException('You cannot view this booking.');
    return booking;
  }

  async cancel(bookingId: string, userId: string) {
    return this.prisma.$transaction(async tx => {
      const booking = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!booking) throw new NotFoundException('Booking not found.');
      if (booking.userId !== userId) throw new ForbiddenException('You can only cancel your own bookings.');
      if (booking.status === 'CANCELLED') return booking;
      if (!['PENDING', 'CONFIRMED'].includes(booking.status)) throw new BadRequestException('This booking cannot be cancelled.');
      const result = await tx.booking.updateMany({ where: { id: bookingId, status: booking.status }, data: { status: 'CANCELLED', slotId: null } });
      if (!result.count) throw new ConflictException('Booking changed. Refresh and try again.');
      if (booking.slotId) await tx.availabilitySlot.update({ where: { id: booking.slotId }, data: { isBooked: false } });
      return tx.booking.findUnique({ where: { id: bookingId } });
    });
  }
}
