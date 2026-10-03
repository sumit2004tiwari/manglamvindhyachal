import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { JwtAuthGuard, Public } from '../auth/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-order')
  createOrder(@Request() req: any, @Body('bookingId') bookingId: string) {
    return this.paymentsService.createOrder(req.user.userId, bookingId);
  }

  @Public()
  @Post('webhook')
  handleWebhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }
}
