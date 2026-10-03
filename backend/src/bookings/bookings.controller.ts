import { Controller, Get, Post, Patch, Body, Param, Request, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { BookingStatus } from '@prisma/client';
import { CreateBookingDto } from './booking.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  create(@Request() req: any, @Body() body: CreateBookingDto) {
    return this.bookingsService.create(req.user.userId, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.findOne(id, req.user.userId, req.user.role);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Request() req: any,
    @Body('status') status: BookingStatus,
  ) {
    return this.bookingsService.updateStatus(id, req.user.userId, req.user.role, status);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.cancel(id, req.user.userId);
  }
}
