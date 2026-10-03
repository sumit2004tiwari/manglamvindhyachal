import { Controller, Get, Param, Query, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PrismaService } from '../prisma.service.js';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get(':id/bookings')
  async getUserBookings(@Param('id') id: string, @Request() req: any, @Query('as') view?: string) {
    if (req.user.userId !== id && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only view your own bookings');
    }

    if (view === 'panda') {
      return this.prisma.booking.findMany({
        where: { vendor: { userId: id } },
        include: { 
          listing: true, 
          vendor: { select: { id: true, photoUrl: true, user: { select: { name: true, phone: true } } } },
          user: true 
        },
        orderBy: { scheduledDate: 'asc' }
      });
    }
    
    return this.prisma.booking.findMany({
      where: { userId: id },
      include: { 
        listing: true, 
        vendor: { select: { id: true, photoUrl: true, user: { select: { name: true, phone: true } } } },
        review: true,
        user: true 
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
