import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard, Roles } from '../auth/jwt-auth.guard.js';
import { VerificationStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('vendors/pending')
  getPendingVendors() {
    return this.adminService.getPendingVendors();
  }

  @Patch('vendors/:id/verify')
  verifyVendor(
    @Param('id') id: string,
    @Body('status') status: VerificationStatus,
    @Body('comment') comment?: string,
  ) {
    return this.adminService.verifyVendor(id, status, comment);
  }

  @Get('analytics/overview')
  getAnalytics() {
    return this.adminService.getAnalytics();
  }
}
